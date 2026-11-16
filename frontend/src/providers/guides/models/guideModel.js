export const GUIDE_LANGUAGES = [
  'العربية',
  'الإنجليزية',
  'الفرنسية',
  'الألمانية',
  'الإسبانية',
  'الإيطالية',
  'الروسية',
  'الصينية',
  'اليابانية',
];

export const GUIDE_SPECIALTIES = [
  'علم المصريات والآثار الفرعونية',
  'القاهرة التاريخية والإسلامية',
  'الرحلات النيلية (الأقصر وأسوان)',
  'سفاري الصحراء والواحات',
  'سياحة الغوص والبحر الأحمر',
  'جولات المتاحف الملكية الخاصة',
];

export const INITIAL_GUIDE_DETAILS = {
  yearsExperience: '8',
  dailyRateEgp: '2200',
  guideLanguages: ['العربية', 'الإنجليزية', 'الفرنسية'],
  guideSpecialties: [
    'علم المصريات والآثار الفرعونية',
    'جولات المتاحف الملكية الخاصة',
  ],
};

export function buildGuidePayloadDetails(state) {
  return {
    partnerCategoryLabel: 'مرشد سياحي مرخص',
    yearsExperience: Number(state.yearsExperience) || 5,
    dailyRateEgp: Number(state.dailyRateEgp) || 1800,
    languages: state.guideLanguages || [],
    specialties: state.guideSpecialties || [],
    syndicateLicense: state.registrationReference || '',
    addressAr: state.addressAr || '',
    descriptionAr: state.descriptionAr || '',
  };
}
