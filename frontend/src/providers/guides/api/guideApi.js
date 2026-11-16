import { adminApi } from '../../../shared/api/adminApi';

export const guideProviderApi = {
  submitGuideApplication: (payload) =>
    adminApi.submitPartnerApplication({
      ...payload,
      partnerType: 'guide',
    }),
  listGuides: async () => {
    const res = await fetch('/api/providers/guides', { credentials: 'include' });
    return res.json();
  },
  getDashboard: async ({ providerId, userId } = {}) => {
    const qs = new URLSearchParams();
    if (providerId) qs.set('providerId', providerId);
    if (userId) qs.set('userId', userId);
    const res = await fetch(`/api/providers/guides/dashboard?${qs.toString()}`, {
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || 'فشل تحميل لوحة تحكم المرشد السياحي');
    return json.data;
  },
  addGuidedTour: async (payload) => {
    const res = await fetch('/api/providers/guides/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || 'فشل إضافة البرنامج الإرشادي');
    return json;
  },
};
