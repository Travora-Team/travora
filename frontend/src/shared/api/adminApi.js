import cairoImage from '../../assets/section2/cairo.webp';
import gizaImage from '../../assets/section2/giza.webp';
import luxorImage from '../../assets/section2/luxor.webp';
import sharmImage from '../../assets/section2/sharm.webp';
import nileImage from '../../assets/section3/nile.webp';
import pyramidsImage from '../../assets/section3/pyramids.webp';
import khanImage from '../../assets/section3/khan-el-khalili.webp';
import museumImage from '../../assets/section3/egyptian-museum.webp';

const API_BASE = '/api/admin';

export const DESTINATION_IMAGE_PRESETS = [
  { key: 'cairo', label: 'القاهرة ونهر النيل', src: cairoImage },
  { key: 'giza', label: 'أهرامات الجيزة', src: gizaImage },
  { key: 'luxor', label: 'معابد الأقصر', src: luxorImage },
  { key: 'sharm', label: 'شرم الشيخ والبحر الأحمر', src: sharmImage },
  { key: 'nile', label: 'ضفاف النيل الساحرة', src: nileImage },
  { key: 'pyramids', label: 'بانوراما الأهرامات', src: pyramidsImage },
  { key: 'khan', label: 'خان الخليلي التاريخي', src: khanImage },
  { key: 'museum', label: 'المتحف المصري الكبير', src: museumImage },
];

const PRESET_MAP = Object.fromEntries(DESTINATION_IMAGE_PRESETS.map((item) => [item.key, item.src]));

export function resolveDestinationImage(imageUrl, slug = '') {
  const raw = String(imageUrl || '').trim();
  if (raw && PRESET_MAP[raw]) {
    return PRESET_MAP[raw];
  }
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:image/') || raw.startsWith('/')) {
    return raw;
  }
  const cleanSlug = String(slug || '').toLowerCase();
  if (cleanSlug.includes('giza') || cleanSlug.includes('siwa')) return gizaImage;
  if (cleanSlug.includes('luxor') || cleanSlug.includes('aswan')) return luxorImage;
  if (cleanSlug.includes('sharm') || cleanSlug.includes('gouna')) return sharmImage;
  return cairoImage;
}

async function request(path, { method = 'GET', body, params } = {}) {
  let url = `${API_BASE}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        searchParams.set(k, v);
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.error?.message || payload?.message || 'حدث خطأ غير متوقع في الخادم.');
    error.status = response.status;
    error.code = payload?.error?.code;
    throw error;
  }

  return payload;
}

export const adminApi = {
  getOverview: () => request('/overview'),
  seedDemo: () => request('/seed', { method: 'POST', body: {} }),

  // Partners & Applications
  getProviders: (params) => request('/providers', { params }),
  createProvider: (body) => request('/providers', { method: 'POST', body }),
  updateProvider: (id, body) => request(`/providers/${id}`, { method: 'PATCH', body }),

  getApplications: (params) => request('/applications', { params }),
  reviewApplication: (id, body) => request(`/applications/${id}/review`, { method: 'PATCH', body }),
  submitPartnerApplication: (body) => request('/public/partner-applications', { method: 'POST', body }),

  // Users & Roles
  getUsers: (params) => request('/users', { params }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PATCH', body }),

  // Bookings & Disputes
  getBookings: (params) => request('/bookings', { params }),
  getDisputes: (params) => request('/disputes', { params }),
  updateDispute: (id, body) => request(`/disputes/${id}`, { method: 'PATCH', body }),

  // Finance
  getFinance: () => request('/finance'),
  createCommissionRule: (body) => request('/commissions', { method: 'POST', body }),
  toggleCommissionRule: (id, body) => request(`/commissions/${id}`, { method: 'PATCH', body }),
  updateSettlementStatus: (id, body) => request(`/settlements/${id}`, { method: 'PATCH', body }),
  createPayout: (body) => request('/payouts', { method: 'POST', body }),
  updatePayoutStatus: (id, body) => request(`/payouts/${id}`, { method: 'PATCH', body }),

  // Catalog, Public Destinations, Audit, Settings
  getPublicDestinations: () => request('/public/destinations'),
  getCatalog: () => request('/catalog'),
  createDestination: (body) => request('/catalog/destinations', { method: 'POST', body }),
  updateDestination: (id, body) => request(`/catalog/destinations/${id}`, { method: 'PATCH', body }),
  deleteDestination: (id) => request(`/catalog/destinations/${id}`, { method: 'DELETE' }),
  updateCatalogItemStatus: (entityType, id, body) =>
    request(`/catalog/${entityType}/${id}`, { method: 'PATCH', body }),

  getAuditLogs: (params) => request('/audit', { params }),
  getSettings: () => request('/settings'),
  createFaqEntry: (body) => request('/settings/faqs', { method: 'POST', body }),
};
