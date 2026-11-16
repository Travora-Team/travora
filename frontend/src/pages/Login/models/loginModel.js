export const LOGIN_CHANNELS = [
  { id: 'EMAIL', label: 'البريد الإلكتروني' },
  { id: 'SMS', label: 'رسالة نصية SMS' },
  { id: 'WHATSAPP', label: 'واتساب WhatsApp' },
];

export const DEMO_ROLE_ACCOUNTS = [
  {
    id: 'admin',
    label: '🛡️ مدير المنصة (الأدمن)',
    subLabel: 'يفتح لوحة تحكم الأدمن الكاملة',
    email: 'admin@travora.eg',
    password: 'Travora@2026!',
    badgeColor: 'bg-[#EEF8FF] border-[#BCE3FF] text-[#0077CC]',
  },
  {
    id: 'hotel',
    label: '🏨 شريك فندق ومنتجع',
    subLabel: 'لوحة تحكم الفنادق والغرف',
    email: 'nile.palace@travora.eg',
    password: 'Travora@2026!',
    badgeColor: 'bg-[#E8FFFB] border-[#99F6E4] text-[#00806B]',
  },
  {
    id: 'restaurant',
    label: '🍽️ شريك مطعم وضيافة',
    subLabel: 'لوحة تحكم المنيو والطاولات',
    email: 'elgouna.dining@travora.eg',
    password: 'Travora@2026!',
    badgeColor: 'bg-[#FFF5EB] border-[#FED7AA] text-[#CC6D00]',
  },
  {
    id: 'guide',
    label: '🧭 مرشد سياحي مرخص',
    subLabel: 'لوحة تحكم الجولات والمسارات',
    email: 'luxor.guides@travora.eg',
    password: 'Travora@2026!',
    badgeColor: 'bg-[#EEF8FF] border-[#BCE3FF] text-[#0077CC]',
  },
  {
    id: 'transport',
    label: '🚘 شريك نقل وسيارات',
    subLabel: 'لوحة تحكم الأسطول والسيارات',
    email: 'cairo.vip.fleet@travora.eg',
    password: 'Travora@2026!',
    badgeColor: 'bg-[#E8FFFB] border-[#99F6E4] text-[#00806B]',
  },
  {
    id: 'traveler',
    label: '✈️ حساب مسافر',
    subLabel: 'تصفح وحجز الوجهات والرحلات',
    email: 'ahmed.mansour@example.com',
    password: 'Travora@2026!',
    badgeColor: 'bg-[#F8FAFC] border-[#DCEBFA] text-[#475569]',
  },
];

export function getPostLoginRoute(loggedUser) {
  if (!loggedUser) return '/';
  if (loggedUser.role === 'admin') {
    return '/admin';
  }
  if (loggedUser.role === 'provider') {
    const pType = loggedUser.providerType || 'hotel';
    return `/provider/${pType}`;
  }
  return '/';
}
