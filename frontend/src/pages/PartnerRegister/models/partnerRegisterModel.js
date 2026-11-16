import { buildHotelPayloadDetails } from '../../../providers/hotels';
import { buildRestaurantPayloadDetails } from '../../../providers/restaurants';
import { buildGuidePayloadDetails } from '../../../providers/guides';
import { buildTransportPayloadDetails } from '../../../providers/transport';

export const PARTNER_CATEGORIES = [
  {
    id: 'hotel',
    title: 'الفنادق والمنتجعات',
    subtitle: 'فنادق فاخرة • منتجعات شاطئية • نُزل بيئية وشقق فندقية',
    badge: 'عمولة مرنة 12%',
  },
  {
    id: 'restaurant',
    title: 'المطاعم والضيافة',
    subtitle: 'مطاعم راقية • كافيهات سياحية • تجارب طهي وتوصيل فاخر',
    badge: 'حجز طاولات وقوائم VIP',
  },
  {
    id: 'guide',
    title: 'المرشدون السياحيون',
    subtitle: 'مرشدون مرخصون • خبراء مصريات • مرافقة وفود وجولات خاصة',
    badge: 'حساب فردي معتمد',
  },
  {
    id: 'transport',
    title: 'النقل والسيارات وتأجيرها',
    subtitle: 'شركات نقل سياحي • أصحاب سيارات بسائق • مكاتب استئجار سيارات',
    badge: '3 مسارات تخصصية',
  },
];

export const DEFAULT_CITIES = [
  { slug: 'cairo', name_ar: 'القاهرة' },
  { slug: 'giza', name_ar: 'الجيزة' },
  { slug: 'luxor', name_ar: 'الأقصر' },
  { slug: 'sharm-el-sheikh', name_ar: 'شرم الشيخ' },
  { slug: 'el-gouna', name_ar: 'الجونة' },
  { slug: 'aswan', name_ar: 'أسوان' },
  { slug: 'siwa-oasis', name_ar: 'واحة سيوة' },
];

export function buildPartnerDetailsPayload(partnerType, state) {
  if (partnerType === 'hotel') return buildHotelPayloadDetails(state);
  if (partnerType === 'restaurant') return buildRestaurantPayloadDetails(state);
  if (partnerType === 'guide') return buildGuidePayloadDetails(state);
  return buildTransportPayloadDetails(state);
}
