import { adminApi } from '../../../shared/api/adminApi';

export const transportProviderApi = {
  submitTransportApplication: (payload) =>
    adminApi.submitPartnerApplication({
      ...payload,
      partnerType: 'transport',
    }),
  listTransportServices: async () => {
    const res = await fetch('/api/providers/transport', { credentials: 'include' });
    return res.json();
  },
  getDashboard: async ({ providerId, userId, subtype } = {}) => {
    const qs = new URLSearchParams();
    if (providerId) qs.set('providerId', providerId);
    if (userId) qs.set('userId', userId);
    if (subtype) qs.set('subtype', subtype);
    const res = await fetch(`/api/providers/transport/dashboard?${qs.toString()}`, {
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || 'فشل تحميل لوحة تحكم النقل والأسطول');
    return json.data;
  },
  addVehicleService: async (payload) => {
    const res = await fetch('/api/providers/transport/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || 'فشل إضافة المركبة / خدمة النقل');
    return json;
  },
};
