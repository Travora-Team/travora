"""Independent bilingual TF-IDF baseline and optional hybrid score adapter (Python 3.10+)."""
import argparse
import csv
import hashlib
import json
import math
import re
import unicodedata
from collections import Counter
from pathlib import Path


def tokens(text):
    text=unicodedata.normalize('NFKC',text).casefold()
    text=re.sub('[\u064b-\u065f\u0670ـ]','',text)
    text=re.sub('[أإآٱ]','ا',text).replace('ى','ي')
    return re.findall(r'[^\W_]{2,}',text,flags=re.UNICODE)


def unit(vector):
    length=math.sqrt(sum(x*x for x in vector.values()))
    return {k:v/length for k,v in vector.items()} if length else {}


def vectorize(text,idf):
    counts=Counter(tokens(text))
    return unit({t:(1+math.log(n))*idf[t] for t,n in counts.items() if t in idf})


def distance_km(lat1,lon1,lat2,lon2):
    a,b=math.radians(lat1),math.radians(lat2)
    z=math.radians(lon2-lon1)
    return 12742*math.asin(min(1,math.sqrt(math.sin((b-a)/2)**2+math.cos(a)*math.cos(b)*math.sin(z/2)**2)))


def valid_location(lat,lon):
    if not all(isinstance(x,(int,float)) and math.isfinite(x) for x in (lat,lon)) or not -90<=lat<=90 or not -180<=lon<=180:
        raise ValueError('Origin must contain finite numeric latitude [-90,90] and longitude [-180,180].')


def train(csv_path,model_path):
    csv_path=Path(csv_path)
    rows=list(csv.DictReader(csv_path.open(encoding='utf-8-sig',newline='')))
    if not rows or len({r['record_id'] for r in rows})!=len(rows):raise ValueError('Nonempty, unique record_id values required.')
    # No label, identifier, citation count, denomination or UNESCO flag enters vectors.
    docs=[' '.join(r.get(k,'') for k in ('name','name_en','site_type','themes','historical_summary')) for r in rows]
    df=Counter(t for doc in docs for t in set(tokens(doc)))
    idf={t:math.log((1+len(rows))/(1+n))+1 for t,n in sorted(df.items())}
    model={'format':'travora_christian_tfidf_v1','algorithm':'sublinear_tf_smoothed_idf_l2_cosine','source_sha256':hashlib.sha256(csv_path.read_bytes()).hexdigest(),'idf':idf,'records':rows,'vectors':{r['record_id']:vectorize(doc,idf) for r,doc in zip(rows,docs)},'supervised':False,'quality_metrics':None}
    Path(model_path).write_text(json.dumps(model,ensure_ascii=False,indent=2),encoding='utf-8')
    return {'records':len(rows),'vocabulary':len(idf),'supervised':False,'status':'content_index_fitted_no_accuracy_claim'}


class ChristianRecommender:
    def __init__(self,model_path):
        self.model=json.loads(Path(model_path).read_text(encoding='utf-8'))
        if self.model.get('format')!='travora_christian_tfidf_v1':raise ValueError('Unsupported model format.')

    def recommend(self,query,*,origin=None,max_distance_km=None,limit=10,collaborative_scores=None,weights=None,discovery=False,require_verified_access=False):
        """Return ranking proposals. Production itinerary planner must verify access and routes.

        collaborative_scores: externally generated per-item calibrated scores in [0,1].
        This module does not train a collaborative model. Missing CF items receive 0
        only when a nonempty CF map exists; absent CF component is globally disabled.
        """
        if not isinstance(query,str):raise ValueError('query must be text.')
        if not isinstance(limit,int) or isinstance(limit,bool) or limit<1:raise ValueError('limit must be a positive integer.')
        if origin is not None:
            if len(origin)!=2:raise ValueError('origin must be (latitude, longitude).')
            valid_location(*origin)
        if max_distance_km is not None:
            if origin is None or not isinstance(max_distance_km,(int,float)) or not math.isfinite(max_distance_km) or max_distance_km<=0:
                raise ValueError('A positive finite radius and an origin are required.')
        weights=weights or {'content':0.60,'distance':0.25,'collaborative':0.15}
        if set(weights)!={'content','distance','collaborative'} or not all(isinstance(x,(int,float)) and math.isfinite(x) and x>=0 for x in weights.values()):raise ValueError('Weights must be finite nonnegative content/distance/collaborative values.')
        cf=collaborative_scores or {}
        ids={r['record_id'] for r in self.model['records']}
        if set(cf)-ids:raise ValueError('Collaborative scores contain IDs outside this catalogue.')
        if not all(isinstance(x,(int,float)) and math.isfinite(x) and 0<=x<=1 for x in cf.values()):raise ValueError('Collaborative scores must be finite and calibrated to [0,1].')
        q=vectorize(query,self.model['idf'])
        enabled={'content':bool(q),'distance':origin is not None,'collaborative':bool(cf)}
        active={k:v for k,v in weights.items() if enabled[k] and v>0}
        total=sum(active.values())
        if not total:raise ValueError('No usable ranking component. Supply a known query, origin, or collaborative scores.')
        active={k:v/total for k,v in active.items()}
        result=[]
        for r in self.model['records']:
            status=r['recommendation_readiness']
            if status.startswith('hold') or status=='excluded_scope' or r['coordinate_status']!='valid_numeric_range':continue
            if not discovery and r['heritage_label']!='documented_significance':continue
            if require_verified_access and r['visit_access_status']!='verified_open':continue
            d=distance_km(*origin,float(r['lat']),float(r['lon'])) if origin is not None else None
            if max_distance_km is not None and d>max_distance_km:continue
            doc=self.model['vectors'][r['record_id']]
            content=min(1.0,max(0.0,sum(v*doc.get(k,0) for k,v in q.items())))
            parts={'content':content,'distance':math.exp(-d/25) if d is not None else 0,'collaborative':cf.get(r['record_id'],0)}
            score=sum(active[k]*parts[k] for k in active)
            result.append({'record_id':r['record_id'],'osm_id':r['osm_id'],'name':r['name'],'score':score,'components':parts,'active_weights':active,'distance_km_straight_line':d,'heritage_label':r['heritage_label'],'evidence_url':r['evidence_url'],'visit_access_status':r['visit_access_status'],'recommendation_status':'offline_proposal_requires_access_and_route_validation'})
        return sorted(result,key=lambda x:(-x['score'],x['record_id']))[:limit]


def main():
    p=argparse.ArgumentParser(description=__doc__);sub=p.add_subparsers(dest='cmd',required=True)
    t=sub.add_parser('train');t.add_argument('--data',default='Christian_Sites_Enriched_Labeled.csv');t.add_argument('--model',default='christian_content_model.json')
    r=sub.add_parser('recommend');r.add_argument('--model',default='christian_content_model.json');r.add_argument('--query',required=True);r.add_argument('--lat',type=float);r.add_argument('--lon',type=float);r.add_argument('--radius-km',type=float);r.add_argument('--limit',type=int,default=5);r.add_argument('--discovery',action='store_true');r.add_argument('--require-verified-access',action='store_true')
    a=p.parse_args()
    if a.cmd=='train':result=train(a.data,a.model)
    else:
        if (a.lat is None)!=(a.lon is None):p.error('--lat and --lon must be supplied together')
        result=ChristianRecommender(a.model).recommend(a.query,origin=(a.lat,a.lon) if a.lat is not None else None,max_distance_km=a.radius_km,limit=a.limit,discovery=a.discovery,require_verified_access=a.require_verified_access)
    print(json.dumps(result,ensure_ascii=False,indent=2))


if __name__=='__main__':main()
