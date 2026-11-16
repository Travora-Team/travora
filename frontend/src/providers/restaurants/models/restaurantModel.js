export const RESTAURANT_FEATURES = [
  'حجز طاولات كبار الزوار VIP',
  'إطلالة بانورامية / تراس مفتوح',
  'غرف عشاء عائلية خاصة',
  'خدمة التوصيل الفاخر للفنادق',
  'قائمة طعام صحية ونباتية',
  'عروض موسيقية حية',
];

export const INITIAL_RESTAURANT_DETAILS = {
  cuisineAr: 'مأكولات مصرية وبحرية فاخرة',
  seatingCapacity: '120',
  openingHours: 'يومياً من 12:00 ظهراً حتى 1:00 صباحاً',
  avgMealPriceEgp: '850',
  restaurantFeatures: [
    'حجز طاولات كبار الزوار VIP',
    'إطلالة بانورامية / تراس مفتوح',
  ],
};

export function buildRestaurantPayloadDetails(state) {
  return {
    partnerCategoryLabel: 'مطعم وضيافة سياحية',
    cuisineAr: state.cuisineAr || 'مأكولات مصرية وبحرية فاخرة',
    seatingCapacity: Number(state.seatingCapacity) || 80,
    openingHours: state.openingHours || 'يومياً من 12:00 ظهراً حتى 1:00 صباحاً',
    avgMealPriceEgp: Number(state.avgMealPriceEgp) || 600,
    diningFeatures: state.restaurantFeatures || [],
    addressAr: state.addressAr || '',
    descriptionAr: state.descriptionAr || '',
  };
}
