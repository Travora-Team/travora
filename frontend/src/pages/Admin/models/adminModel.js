export const WORKSPACE_GROUPS = [
  {
    groupLabel: 'القيادة والتحليلات',
    items: [
      {
        id: 'overview',
        label: 'نظرة عامة',
        icon: 'overview',
        pageTitle: 'إدارة Travora',
        pageSubtitle: 'مركز القيادة الموحد لمتابعة المنصة والشركاء والعمليات',
      },
      {
        id: 'reports',
        label: 'تقارير المنصة',
        icon: 'reports',
        pageTitle: 'تقارير المنصة والأداء',
        pageSubtitle: 'تحليل الإيرادات والقطاعات السياحية ومؤشرات النمو',
      },
      {
        id: 'catalog',
        label: 'المحتوى والخدمات',
        icon: 'catalog',
        pageTitle: 'المحتوى والخدمات',
        pageSubtitle: 'إدارة قسم "اكتشف أشهر الوجهات" وكتالوج الخدمات المنشورة',
      },
    ],
  },
  {
    groupLabel: 'الشركاء والعمليات',
    items: [
      {
        id: 'providers',
        label: 'مقدمو الخدمات',
        icon: 'providers',
        pageTitle: 'الشركاء ومقدمو الخدمات',
        pageSubtitle: 'إدارة الكيانات السياحية المعتمدة وحالات التشغيل',
      },
      {
        id: 'applications',
        label: 'طلبات الشركاء',
        icon: 'applications',
        pageTitle: 'طلبات انضمام الشركاء',
        pageSubtitle: 'فحص السجل التجاري وتراخيص السياحة واعتماد الشركاء',
      },
      {
        id: 'users',
        label: 'المستخدمون',
        icon: 'users',
        pageTitle: 'المستخدمون والصلاحيات',
        pageSubtitle: 'إدارة حسابات المسافرين والشركاء ومديري النظام',
      },
      {
        id: 'bookings',
        label: 'الحجوزات',
        icon: 'bookings',
        pageTitle: 'الحجوزات والعمليات',
        pageSubtitle: 'متابعة الحجوزات الفورية عبر القطاعات الـ 6',
      },
      {
        id: 'disputes',
        label: 'النزاعات والدعم',
        icon: 'disputes',
        pageTitle: 'النزاعات وتذاكر الدعم',
        pageSubtitle: 'معالجة شكاوى المسافرين والرد الفوري حسب الأولوية',
      },
    ],
  },
  {
    groupLabel: 'المالية والحوكمة',
    items: [
      {
        id: 'commissions',
        label: 'قواعد العمولات',
        icon: 'commissions',
        pageTitle: 'العمولات والتسعير',
        pageSubtitle: 'ضبط نسب عمولة المنصة لكل قطاع سياحي',
      },
      {
        id: 'settlements',
        label: 'التسويات المالية',
        icon: 'settlements',
        pageTitle: 'التسويات المالية',
        pageSubtitle: 'مراجعة واعتماد مستحقات الشركاء الدورية',
      },
      {
        id: 'payouts',
        label: 'التحويلات البنكية',
        icon: 'payouts',
        pageTitle: 'التحويلات البنكية (Payouts)',
        pageSubtitle: 'إصدار وتأكيد أوامر الصرف البنكي للشركاء',
      },
      {
        id: 'audit',
        label: 'سجل التدقيق',
        icon: 'audit',
        pageTitle: 'سجل التدقيق الأمني',
        pageSubtitle: 'توثيق غير قابل للتعديل لكافة العمليات الإدارية والمالية',
      },
      {
        id: 'settings',
        label: 'إعدادات المنصة',
        icon: 'settings',
        pageTitle: 'إعدادات المنصة',
        pageSubtitle: 'إدارة العملات، الدول، الأسئلة الشائعة، وبوابات الإشعارات',
      },
    ],
  },
];

export const WORKSPACE_LINKS = WORKSPACE_GROUPS.flatMap((g) => g.items);

export const INITIAL_PROVIDER_FORM = {
  publicNameAr: '',
  publicNameEn: '',
  legalName: '',
  organizationKind: 'business',
  category: 'hotel',
  supportEmail: '',
  supportPhone: '+2010',
};

export const INITIAL_DESTINATION_FORM = {
  nameAr: '',
  nameEn: '',
  countryLabelAr: 'مصر',
  tagsAr: 'ثقافة • تاريخ • سياحة',
  descriptionAr: '',
  categoryLabelAr: 'معالم',
  visitorsText: '+12K',
  rating: '4.8',
  ctaLabelAr: 'استكشف الآن',
  imageUrl: 'cairo',
  displayOrder: 5,
  isFeatured: true,
  status: 'active',
  kind: 'city',
};

export function getNavBadge(id, kpis = {}, destinationsCount = 0) {
  switch (id) {
    case 'applications':
      return kpis.pending_applications ? { text: kpis.pending_applications, tone: 'orange' } : null;
    case 'disputes':
      return kpis.open_disputes ? { text: kpis.open_disputes, tone: 'rose' } : null;
    case 'catalog':
      return destinationsCount ? { text: destinationsCount, tone: 'blue' } : null;
    case 'providers':
      return kpis.total_providers ? { text: kpis.total_providers, tone: 'teal' } : null;
    case 'bookings':
      return kpis.total_bookings ? { text: kpis.total_bookings, tone: 'blue' } : null;
    default:
      return null;
  }
}

export function buildCatalogTabsMeta(catalog, allDestinationsCount, featuredCount) {
  return [
    {
      id: 'destinations',
      label: 'أشهر الوجهات (الرئيسية)',
      count: allDestinationsCount,
      sub: `${featuredCount} بالرئيسية`,
      tone: 'from-[#0099FF] to-[#00C8A8]',
    },
    {
      id: 'hotels',
      label: 'الفنادق والمنتجعات',
      count: catalog?.hotels?.length || 0,
      sub: 'فئة 5 نجوم',
      tone: 'from-[#0099FF] to-[#38BDF8]',
    },
    {
      id: 'activities',
      label: 'الأنشطة والتجارب',
      count: catalog?.activities?.length || 0,
      sub: 'رحلات بحرية وثقافية',
      tone: 'from-[#00C8A8] to-[#14B8A6]',
    },
    {
      id: 'transport',
      label: 'النقل الفاخر VIP',
      count: catalog?.transportServices?.length || 0,
      sub: 'ليموزين ومطارات',
      tone: 'from-[#2563EB] to-[#60A5FA]',
    },
    {
      id: 'restaurants',
      label: 'المطاعم الراقية',
      count: catalog?.restaurants?.length || 0,
      sub: 'Fine Dining',
      tone: 'from-[#FF8A00] to-[#FBBF24]',
    },
    {
      id: 'guides',
      label: 'المرشدون السياحيون',
      count: catalog?.guides?.length || 0,
      sub: 'مرخصون دولياً',
      tone: 'from-[#0D9488] to-[#2DD4BF]',
    },
  ];
}
