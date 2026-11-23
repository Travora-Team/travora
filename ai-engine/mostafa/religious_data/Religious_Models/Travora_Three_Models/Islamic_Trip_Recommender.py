"""
Religious-trip recommender for Egypt_Religious_Tourism_Muslim_Christian.csv

    from religious_trip_recommender import RecommenderConfig, load_sites, recommend
    sites = load_sites("Egypt_Religious_Tourism_Muslim_Christian.csv")
    plan = recommend(sites, religion="Islam", budget_egp=400, visitor="foreign", region="Greater Cairo", days=2)
    print(plan.to_text())

CLI:
    python religious_trip_recommender.py data.csv --religion Islam --budget 400 --visitor foreign --region "Greater Cairo" --days 2

Pipeline: filter candidates -> importance score -> HDBSCAN zones (haversine) -> pick best zone per day ->
order stops (nearest neighbour) -> cost = site fees + transport -> drop the weakest stops until the budget holds.

Honest limits (also printed in the output):
  * There is no tier / popularity / rating column. If the CSV has an `ml_importance` column (written by train_importance_model.py,
    Islam only) that trained logistic-regression score is used; otherwise (Christianity, or a plain CSV) the importance is a
    hand-weighted mix of the real signals in the file (wikidata, wikipedia, heritage, age, pilgrimage, curated). Those weights
    live in RecommenderConfig and are NOT learned.
  * Almost all sites are free, so the budget is mostly spent on transport. TRANSPORT_EGP_PER_KM is an ASSUMPTION - set your own.
  * Sites with a ticket but unknown price are flagged and counted at `unknown_fee_egp`.
  * Monastery coordinates are approximate (~2 km).
"""
import argparse
from dataclasses import dataclass, field

import numpy as np
import pandas as pd
from sklearn.cluster import HDBSCAN

EARTH_KM = 6371.0088
# every ranking uses score (high first) then site_id, so equal scores always come out in the same order
SORT_BY, SORT_ASC = ["score", "site_id"], [False, True]


@dataclass
class RecommenderConfig:
    transport_egp_per_km: float = 6.0      # ASSUMPTION: replace with real taxi / ride-hail / bus cost
    unknown_fee_egp: float = 100.0         # assumed price when a ticket exists but the price is unknown
    max_stops_per_day: int = 5
    max_zone_radius_km: float = 12.0       # stops of one day must be within this radius of the zone's best site
    min_zone_size: int = 3
    dedupe_monastery_km: float = 1.0
    zone_min_score: float = 3.0            # only sites scoring at least this are used to build zones
    # sites sold with ONE combined ticket (source: egymonuments.gov.eg: Sultan Hassan + Al-Rifa'i area ticket)
    ticket_bundles: tuple = (("ICONIC_001", "ICONIC_002"),)
    weights: dict = field(default_factory=lambda: dict(
        wikidata=3.0, wikipedia=2.0, heritage=3.0, old=1.5, pilgrimage=2.0, curated=4.0,
        has_real_name=0.5, common_name_penalty=-0.5, approx_coord_penalty=-0.3))


def hav_km(lat1, lon1, lat2, lon2):
    p = np.pi / 180
    h = np.sin((lat2 - lat1) * p / 2) ** 2 + np.cos(lat1 * p) * np.cos(lat2 * p) * np.sin((lon2 - lon1) * p / 2) ** 2
    return 2 * EARTH_KM * np.arcsin(np.sqrt(h))


def load_sites(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    assert {"religion", "latitude", "longitude", "region"} <= set(df.columns)
    return df


def _hand_importance(df: pd.DataFrame, w: dict) -> pd.Series:
    s = pd.Series(0.0, index=df.index)
    s += w["wikidata"] * df["wikidata"].notna()
    s += w["wikipedia"] * df["wikipedia"].notna()
    s += w["heritage"] * df["osm_heritage"].fillna(False).astype(bool)
    s += w["old"] * (df["osm_start_year"].fillna(9999) < 1900)
    s += w["pilgrimage"] * df["pilgrimage_site"].fillna(False).astype(bool)
    s += w["curated"] * df["source"].isin(["Curated", "Curated_Verified"])
    s += w["has_real_name"] * ~df["is_generic_name"].fillna(False).astype(bool)
    s += w["common_name_penalty"] * df["is_common_name"].fillna(False).astype(bool)
    s += w["approx_coord_penalty"] * df["coord_precision"].fillna("").str.startswith("approx")
    return s


ML_SCALE = 5.0    # ml_importance (0..1) of NON-documented sites -> 0..~3 points. Deliberately small: the model's precision is
                  # modest (see model_report.md), so it orders the sites that fill a day but never outranks documented evidence.


def uses_ml(df: pd.DataFrame) -> bool:
    return "ml_importance" in df.columns and len(df) > 0 and bool(df["ml_importance"].notna().all())


def importance(df: pd.DataFrame, w: dict) -> pd.Series:
    """Trained-model score where the data has it (column `ml_importance`, written by train_importance_model.py),
    otherwise the hand-weighted score. Decided row by row so a mixed file still works."""
    hand = _hand_importance(df, w)
    if "ml_importance" not in df.columns:
        return hand
    ml = df["ml_importance"].astype(float)
    # Sites with documented evidence (ml_label == 1) keep the evidence-weighted score: it tells strong evidence from weak.
    # (The model was trained to find MORE such sites, so its score for them is 1.0 by construction and carries no ranking.)
    # Every other site is ranked by the model's cross-fitted probability.
    known = df["ml_label"].eq(1) if "ml_label" in df.columns else pd.Series(False, index=df.index)
    return pd.Series(np.where(ml.notna() & ~known, ML_SCALE * ml, hand), index=df.index)


def site_cost(df: pd.DataFrame, visitor: str, cfg: RecommenderConfig) -> pd.DataFrame:
    col = "fee_foreign_egp" if visitor == "foreign" else "fee_egyptian_egp"
    fee = df[col]
    unknown = fee.isna()
    return df.assign(fee_egp=fee.fillna(cfg.unknown_fee_egp), fee_unknown=unknown)


def zones(df: pd.DataFrame, cfg: RecommenderConfig) -> pd.Series:
    """HDBSCAN on haversine; noise points (-1) become their own singleton zone ids so they can still be recommended."""
    if len(df) < cfg.min_zone_size:
        return pd.Series(np.arange(len(df)), index=df.index)
    xy = np.radians(df[["latitude", "longitude"]].values)
    # (cluster_selection_epsilon crashes in sklearn 1.9 + numpy 2.5, so zone size is capped by max_zone_radius_km instead)
    lab = HDBSCAN(min_cluster_size=cfg.min_zone_size, metric="haversine").fit_predict(xy)
    nxt = lab.max() + 1 if len(lab) else 0
    out = lab.copy()
    for i in np.where(lab == -1)[0]:
        out[i] = nxt
        nxt += 1
    return pd.Series(out, index=df.index)


def day_fees(stops: pd.DataFrame, cfg: "RecommenderConfig") -> float:
    """Sum of fees where a bundled (combined) ticket is charged once, at the bundle's highest fee."""
    fees = stops.set_index("site_id")["fee_egp"]
    total, seen = 0.0, set()
    for bundle in cfg.ticket_bundles:
        present = [s for s in bundle if s in fees.index]
        if len(present) > 1:
            total += float(fees[present].max())
            seen.update(present)
    return total + float(fees[[s for s in fees.index if s not in seen]].sum())


def day_cost(stops: pd.DataFrame, cfg: "RecommenderConfig") -> float:
    km = route_km(stops) if len(stops) > 1 else 0.0
    return day_fees(stops, cfg) + km * cfg.transport_egp_per_km


def dedupe(c: pd.DataFrame, monastery_km: float) -> pd.DataFrame:
    """The same monastery appears several times (OSM + PAThs, or PAThs under different spellings).
    Greedy: keep the highest-scored monastery and drop any other monastery within `monastery_km` of it.
    Rows sharing exact coordinates (coord_group_id) are collapsed for every site type."""
    c = c.sort_values(SORT_BY, ascending=SORT_ASC)
    grp = c["coord_group_id"].fillna("")
    c = c[(grp == "") | ~grp.duplicated()]
    mon = c[c["site_type"] == "Monastery"]
    drop, kept = set(), []
    for i, r in mon.iterrows():
        if any(hav_km(r.latitude, r.longitude, k[0], k[1]) < monastery_km for k in kept):
            drop.add(i)
        else:
            kept.append((r.latitude, r.longitude))
    return c.drop(index=list(drop))


def order_stops(stops: pd.DataFrame) -> pd.DataFrame:
    """Start at the most important stop, then always go to the nearest unvisited one."""
    rest = stops.sort_values(SORT_BY, ascending=SORT_ASC)
    cur = rest.index[0]
    path = [cur]
    left = set(rest.index[1:])
    while left:
        c = stops.loc[cur]
        nxt = min(left, key=lambda i: (hav_km(c.latitude, c.longitude, stops.at[i, "latitude"], stops.at[i, "longitude"]),
                                       stops.at[i, "site_id"]))
        path.append(nxt)
        left.remove(nxt)
        cur = nxt
    return stops.loc[path]


def route_km(stops: pd.DataFrame) -> float:
    la, lo = stops["latitude"].values, stops["longitude"].values
    return float(sum(hav_km(la[i], lo[i], la[i + 1], lo[i + 1]) for i in range(len(stops) - 1)))


@dataclass
class DayPlan:
    day: int
    zone_label: str
    stops: pd.DataFrame
    km: float
    fees_egp: float
    transport_egp: float

    @property
    def total(self):
        return self.fees_egp + self.transport_egp


@dataclass
class TripPlan:
    days: list
    budget_egp: float
    notes: list

    @property
    def total(self):
        return sum(d.total for d in self.days)

    def to_text(self) -> str:
        out = []
        for d in self.days:
            out.append(f"\n=== Day {d.day} | zone: {d.zone_label} | {len(d.stops)} stops | {d.km:.1f} km ===")
            for i, r in enumerate(d.stops.itertuples(), 1):
                flag = "  [fee price unknown]" if r.fee_unknown else ""
                out.append(f"  {i}. {r.name_en}  ({r.site_name})  {r.site_type}  fee {r.fee_egp:.0f} EGP{flag}")
            out.append(f"  day cost: fees {d.fees_egp:.0f} + transport {d.transport_egp:.0f} = {d.total:.0f} EGP")
        out.append(f"\nTOTAL: {self.total:.0f} EGP of budget {self.budget_egp:.0f} EGP")
        out += [f"NOTE: {n}" for n in self.notes]
        return "\n".join(out)


def prepare(sites: pd.DataFrame, religion: str, region, accessible_only: bool, cfg: "RecommenderConfig"):
    """Everything that does not depend on budget or visitor type: filter, score, merge duplicates, build zones.
    Returns (candidates sorted by score then site_id with `score` and `zone` columns, number of merged duplicates)."""
    c = sites[sites["religion"] == religion]
    if region:
        c = c[c["region"] == region]
    if accessible_only:
        c = c[c["accessibility_friendly"] == True]  # noqa: E712 (NaN = unknown -> excluded)
    c = c[~c["name_en"].fillna("").str.startswith("Unnamed")]
    if c.empty:
        return c.assign(score=[], zone=[]), 0
    c = c.copy()
    c["score"] = importance(c, cfg.weights)
    n_before = len(c)
    c = dedupe(c, cfg.dedupe_monastery_km)
    # Zones are built from the IMPORTANT sites only. Clustering every local mosque makes HDBSCAN call the famous
    # monuments "noise" inside a sea of neighbourhood mosques and Islamic Cairo falls apart.
    seeds = c[c["score"] >= cfg.zone_min_score]
    if len(seeds) < cfg.min_zone_size:
        seeds = c.sort_values(SORT_BY, ascending=SORT_ASC).head(max(cfg.min_zone_size, 5))
    c["zone"] = -1
    c.loc[seeds.index, "zone"] = zones(seeds, cfg)
    return c, n_before - len(c)


def recommend(sites: pd.DataFrame, religion: str, budget_egp: float, visitor: str = "foreign", region: str = None,
              days: int = 1, accessible_only: bool = False, cfg: RecommenderConfig = None) -> TripPlan:
    assert religion in ("Islam", "Christianity"), "religion must be 'Islam' or 'Christianity'"
    assert visitor in ("foreign", "egyptian")
    cfg = cfg or RecommenderConfig()
    notes = ["Importance score is a hand-weighted heuristic, not a learned model.",
             f"Transport cost uses an ASSUMED {cfg.transport_egp_per_km:g} EGP/km - change it in RecommenderConfig."]

    c, merged = prepare(sites, religion, region, accessible_only, cfg)
    if c.empty:
        return TripPlan([], budget_egp, notes + ["No sites match these filters."])
    if uses_ml(c):
        notes[0] = "Importance for these sites comes from a trained machine-learning model (weakly supervised; see model_report.md)."
    c = site_cost(c, visitor, cfg)
    if merged:
        notes.append(f"{merged} duplicate listings of the same monastery/location were merged.")

    plans, used, remaining = [], set(), budget_egp
    for _day in range(days):
        left = c[~c.index.isin(used)]
        if left.empty:
            break
        seeds_left = left[left["zone"] >= 0]
        if seeds_left.empty:  # no important sites left: every remaining site becomes its own zone
            seeds_left = left.assign(zone=np.arange(len(left)))
        zv = sorted(((zid, round(float(g.sort_values(SORT_BY, ascending=SORT_ASC).head(cfg.max_stops_per_day)["score"].sum()), 6))
                      for zid, g in seeds_left.groupby("zone")), key=lambda kv: (-kv[1], kv[0]))

        day_plan = None
        for zid, _value in zv:
            z = seeds_left[seeds_left["zone"] == zid].sort_values(SORT_BY, ascending=SORT_ASC)
            anchor = z.iloc[0]
            # fill candidates: any unused site (important or local) around the zone's best site
            around = left[hav_km(anchor.latitude, anchor.longitude, left.latitude.values, left.longitude.values)
                          <= cfg.max_zone_radius_km].sort_values(SORT_BY, ascending=SORT_ASC)
            around = pd.concat([z.head(cfg.max_stops_per_day), around]).loc[lambda x: ~x.index.duplicated()]
            cands = around.head(cfg.max_stops_per_day * 4)
            # greedy fill: add a site only if the whole day (bundled tickets once + transport of the re-ordered
            # route) still fits the remaining budget
            chosen = []
            for idx in cands.index:
                trial = order_stops(cands.loc[chosen + [idx]])
                if day_cost(trial, cfg) <= remaining:
                    chosen.append(idx)
                if len(chosen) == cfg.max_stops_per_day:
                    break
            if not chosen:
                continue  # nothing affordable around this zone; try the next best zone
            stops = order_stops(cands.loc[chosen])
            km = route_km(stops) if len(stops) > 1 else 0.0
            fees, trans = day_fees(stops, cfg), km * cfg.transport_egp_per_km
            top = stops.loc[stops["score"].idxmax()]
            day_plan = DayPlan(len(plans) + 1, f"{top['name_en']} area ({top['region']})", stops, km, fees, trans)
            used.update(stops.index)
            remaining -= fees + trans
            break
        if day_plan is None:
            break
        plans.append(day_plan)

    if len(plans) < days:
        notes.append(f"Only {len(plans)} of {days} days could be planned with these filters and budget.")
    if any(d.stops["fee_unknown"].any() for d in plans):
        notes.append(f"Some stops have a ticket with unknown price; counted at {cfg.unknown_fee_egp:g} EGP.")
    if any(d.stops["coord_precision"].fillna("").str.startswith("approx").any() for d in plans):
        notes.append("Some stops have approximate coordinates (~2 km), e.g. monasteries.")
    return TripPlan(plans, budget_egp, notes)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--religion", required=True, choices=["Islam", "Christianity"])
    ap.add_argument("--budget", type=float, required=True)
    ap.add_argument("--visitor", default="foreign", choices=["foreign", "egyptian"])
    ap.add_argument("--region", default=None)
    ap.add_argument("--days", type=int, default=1)
    ap.add_argument("--accessible", action="store_true")
    a = ap.parse_args()
    print(recommend(load_sites(a.csv), a.religion, a.budget, a.visitor, a.region, a.days, a.accessible).to_text())
