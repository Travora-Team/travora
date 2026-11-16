export const HOTEL_AMENITIES = [
  'إطلالة نيلية أو بحرية مباشرة',
  'مسبح خارجي مدفأ',
  'مركز سبا وعافية عالمي',
  'استقبال وتوصيل مطار VIP',
  'شاطئ رملي خاص',
  'إفطار ملكي مفتوح',
  'أجنحة ملكية خاصة',
  'واي فاي فائق السرعة مجاني',
];

export const INITIAL_HOTEL_DETAILS = {
  starRating: 5,
  roomsCount: '45',
  nightlyPriceEgp: '4500',
  checkInOut: 'الدخول 14:00 • المغادرة 12:00',
  hotelAmenities: [
    'إطلالة نيلية أو بحرية مباشرة',
    'استقبال وتوصيل مطار VIP',
    'إفطار ملكي مفتوح',
  ],
};

export function buildHotelPayloadDetails(state) {
  return {
    partnerCategoryLabel: 'فندق / منتجع سياحي',
    starRating: Number(state.starRating) || 5,
    roomsCount: Number(state.roomsCount) || 20,
    nightlyPriceEgp: Number(state.nightlyPriceEgp) || 3500,
    checkInOut: state.checkInOut || 'الدخول 14:00 • المغادرة 12:00',
    amenities: state.hotelAmenities || [],
    addressAr: state.addressAr || '',
    descriptionAr: state.descriptionAr || '',
  };
}
