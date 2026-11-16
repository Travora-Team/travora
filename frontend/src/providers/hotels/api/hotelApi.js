import { adminApi } from '../../../shared/api/adminApi';

export const hotelProviderApi = {
  submitHotelApplication: (payload) =>
    adminApi.submitPartnerApplication({
      ...payload,
      partnerType: 'hotel',
    }),
  listHotels: async () => {
    const res = await fetch('/api/providers/hotels', { credentials: 'include' });
    return res.json();
  },
  getDashboard: async ({ providerId, userId } = {}) => {
    const qs = new URLSearchParams();
    if (providerId) qs.set('providerId', providerId);
    if (userId) qs.set('userId', userId);
    const res = await fetch(`/api/providers/hotels/dashboard?${qs.toString()}`, {
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || 'فشل تحميل لوحة تحكم الفندق');
    return json.data;
  },
  createRoomType: async (payload) => {
    const res = await fetch('/api/providers/hotels/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || 'فشل إضافة الغرفة');
    return json;
  },
};
