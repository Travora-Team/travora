export const TRANSPORT_SUBTYPES = [
  {
    id: 'transport_company',
    title: 'شركة نقل سياحي وليموزين',
    desc: 'للشركات المالكة لأسطول سيارات، فان سياحي، أو حافلات نقل الوفود والمطارات.',
    tag: 'شركات وأساطيل',
  },
  {
    id: 'car_owner',
    title: 'صاحب سيارة خاصة بسائق',
    desc: 'لأصحاب السيارات الحديثة الراغبين في تقديم خدمات التوصيل والجولات الخاصة للمسافرين.',
    tag: 'أفراد وملاك سيارات',
  },
  {
    id: 'car_rental',
    title: 'مكتب وشركة استئجار سيارات',
    desc: 'لمكاتب تأجير السيارات اليومية أو الأسبوعية (بدون سائق أو بسائق) وتسليم المطارات.',
    tag: 'تأجير يومي وأسبوعي',
  },
];

export const COMPANY_VEHICLE_CLASSES = [
  'سيدان فاخرة (Mercedes / BMW)',
  'فان عائلي سياحي VIP (7-9 مقاعد)',
  'ميني باص سياحي (Toyota Coaster)',
  'حافلات سياحية كبرى (50 راكب)',
  'سيارات دفع رباعي صحراوية 4x4',
];

export const RENTAL_CAR_CATEGORIES = [
  'سيدان اقتصادية حديثة',
  'سيدان فاخرة ورجال أعمال',
  'دفع رباعي عائلية SUV 4x4',
  'سيارات رياضية وكابورليه',
  'سيارات عائلية 7 مقاعد',
];

export const RENTAL_MODES = [
  'إيجار بدون سائق (Self-Drive)',
  'إيجار بسائق خاص محترف',
  'تسليم واستلام في المطار 24/7',
  'تأمين شامل بدون تحمل',
  'عقود إيجار أسبوعية وشهرية',
];

export function buildTransportPayloadDetails(state) {
  const { transportSubtype } = state;

  if (transportSubtype === 'car_owner') {
    return {
      partnerCategoryLabel: 'صاحب سيارة خاصة بسائق',
      transportSubtypeLabel: 'صاحب سيارة خاصة بسائق',
      carMakeModel: state.carMakeModel,
      carYear: Number(state.carYear) || 2024,
      plateNumber: state.plateNumber,
      seats: Number(state.seatsCount) || 4,
      luggageCapacity: Number(state.luggageCapacity) || 3,
      driverLicenseNumber: state.driverLicenseNumber || state.registrationReference,
      airportTransfer: true,
      startingPriceEgp: Number(state.startingPriceEgp) || 1200,
      addressAr: state.addressAr || '',
      descriptionAr: state.descriptionAr || '',
    };
  }

  if (transportSubtype === 'car_rental') {
    return {
      partnerCategoryLabel: 'مكتب وشركة استئجار سيارات',
      transportSubtypeLabel: 'مكتب استئجار سيارات',
      rentalCarsCount: Number(state.rentalCarsCount) || 20,
      rentalCategories: state.rentalCategories || [],
      rentalModes: state.rentalModes || [],
      depositEgp: Number(state.depositEgp) || 5000,
      startingPriceEgp: Number(state.startingPriceEgp) || 1600,
      addressAr: state.addressAr || '',
      descriptionAr: state.descriptionAr || '',
    };
  }

  return {
    partnerCategoryLabel: 'شركة نقل سياحي وليموزين',
    transportSubtypeLabel: 'شركة نقل سياحي وليموزين',
    fleetSize: Number(state.fleetSize) || 10,
    vehicleClasses: state.companyVehicleClasses || [],
    airportTransfer: true,
    startingPriceEgp: Number(state.startingPriceEgp) || 1500,
    addressAr: state.addressAr || '',
    descriptionAr: state.descriptionAr || '',
  };
}
