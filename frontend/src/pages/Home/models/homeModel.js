import cairoImage from '../../../assets/section2/cairo.webp';
import gizaImage from '../../../assets/section2/giza.webp';
import luxorImage from '../../../assets/section2/luxor.webp';
import sharmImage from '../../../assets/section2/sharm.webp';
import { resolveDestinationImage } from '../../../shared/api/adminApi';

export const DEFAULT_DESTINATIONS = [
  {
    id: 'cairo',
    slug: 'cairo',
    title: 'القاهرة',
    nameEn: 'Cairo',
    country: 'مصر',
    image: cairoImage,
    tags: 'ثقافة • تاريخ • حياة عصرية',
    description: 'عاصمة لا تنام تجمع بين عراقة التاريخ وحيوية الحاضر على ضفاف النيل.',
    category: 'معالم',
    visitors: '+12K',
    rating: '4.8',
    cta: 'استكشف الآن',
    hotelsCount: 1,
    activitiesCount: 0,
  },
  {
    id: 'giza',
    slug: 'giza',
    title: 'الجيزة',
    nameEn: 'Giza',
    country: 'مصر',
    image: gizaImage,
    tags: 'آثار • مغامرة • استكشاف',
    description: 'استكشف أهرامات الجيزة العظيمة، إحدى عجائب العالم حيث يلتقي التاريخ بالدهشة.',
    category: 'معالم',
    visitors: '+18K',
    rating: '4.9',
    cta: 'استكشف الآن',
    hotelsCount: 0,
    activitiesCount: 0,
  },
  {
    id: 'luxor',
    slug: 'luxor',
    title: 'الأقصر',
    nameEn: 'Luxor',
    country: 'مصر',
    image: luxorImage,
    tags: 'حضارة • معابد • تاريخ',
    description: 'متحف مفتوح في قلب الصعيد، حيث تعيش الحضارة الفرعونية في كل زاوية.',
    category: 'معالم',
    visitors: '+10K',
    rating: '4.7',
    cta: 'استكشف الآن',
    hotelsCount: 0,
    activitiesCount: 0,
  },
  {
    id: 'sharm-el-sheikh',
    slug: 'sharm-el-sheikh',
    title: 'شرم الشيخ',
    nameEn: 'Sharm El-Sheikh',
    country: 'مصر',
    image: sharmImage,
    tags: 'شاطئ • غوص • استرخاء',
    description: 'البحر الأحمر بتجاربه التي لا تُنسى بين الشعاب المرجانية والمياه الفيروزية.',
    category: 'معالم',
    visitors: '+14K',
    rating: '4.8',
    cta: 'استكشف الآن',
    hotelsCount: 0,
    activitiesCount: 1,
  },
];

export function mapDbDestination(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.name_ar,
    nameEn: row.name_en,
    country: row.country_label_ar || 'مصر',
    image: resolveDestinationImage(row.image_url, row.slug),
    tags: row.tags_ar || 'ثقافة • تاريخ • سياحة',
    description:
      row.description_ar || 'وجهة سياحية مميزة تجمع بين الفخامة والتجارب الاستثنائية.',
    category: row.category_label_ar || 'معالم',
    visitors: row.visitors_text || '+10K',
    rating: Number(row.rating || 4.8).toFixed(1),
    cta: row.cta_label_ar || 'استكشف الآن',
    hotelsCount: Number(row.hotels_count || 0),
    activitiesCount: Number(row.activities_count || 0),
    isFeatured: Boolean(row.is_featured),
  };
}
