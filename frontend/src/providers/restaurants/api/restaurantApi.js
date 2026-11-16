import { adminApi } from '../../../shared/api/adminApi';

export const restaurantProviderApi = {
  submitRestaurantApplication: (payload) =>
    adminApi.submitPartnerApplication({
      ...payload,
      partnerType: 'restaurant',
    }),
  listRestaurants: async () => {
    const res = await fetch('/api/providers/restaurants', { credentials: 'include' });
    return res.json();
  },
  getDashboard: async ({ providerId, userId } = {}) => {
    const qs = new URLSearchParams();
    if (providerId) qs.set('providerId', providerId);
    if (userId) qs.set('userId', userId);
    const res = await fetch(`/api/providers/restaurants/dashboard?${qs.toString()}`, {
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || 'فشل تحميل لوحة تحكم المطعم');
    return json.data;
  },
  addMenuItem: async (payload) => {
    const res = await fetch('/api/providers/restaurants/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || 'فشل إضافة الطبق / الباقة');
    return json;
  },
};
