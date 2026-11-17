class BookingData {
  final String title;
  final String subTitle;
  final String image;
  final String dateRange; // 15 - 18 مارس 2027
  final int nights;
  final int travelers;
  final int pricePerNight;
  final String guestName; // من التشيك أوت - مش ثابت
  final String email;
  final String
      paymentMethod; // بطاقة بنكية | محفظة إلكترونية | الدفع عند الوصول
  final String bookingRef; // TRV-2027-1048
  final bool isPaid; // true = بطاقة / محفظة - false = الدفع عند الوصول

  BookingData({
    required this.title,
    required this.subTitle,
    required this.image,
    required this.dateRange,
    required this.nights,
    required this.travelers,
    required this.pricePerNight,
    required this.guestName,
    required this.email,
    required this.paymentMethod,
    required this.bookingRef,
    required this.isPaid,
  });

  int get total => pricePerNight * nights;

  // اللي اتدفع فعلاً - لو دفع عند الوصول = 0
  int get paidAmount => isPaid ? total : 0;

  // اللي لسه مستحق - لو دفع عند الوصول = الإجمالي كله
  int get dueAmount => isPaid ? 0 : total;

  String get paymentStatus => isPaid
      ? 'مدفوع بالكامل'
      : 'الإجمالي مستحق عند الوصول • لا يخصم مبلغ الآن';

  String get bookingStatus => isPaid ? 'مؤكد مدفوع' : 'مؤكد • مستحق السداد';

  BookingData copyWith({
    String? title,
    String? subTitle,
    String? image,
    String? dateRange,
    int? nights,
    int? travelers,
    int? pricePerNight,
  }) {
    return BookingData(
      title: title ?? this.title,
      subTitle: subTitle ?? this.subTitle,
      image: image ?? this.image,
      dateRange: dateRange ?? this.dateRange,
      nights: nights ?? this.nights,
      travelers: travelers ?? this.travelers,
      pricePerNight: pricePerNight ?? this.pricePerNight,
      guestName: guestName,
      email: email,
      paymentMethod: paymentMethod,
      bookingRef: bookingRef,
      isPaid: isPaid,
    );
  }
}

// ==================== 1 - صفحة تم الحجز بنجاح ====================

// ==================== تأكيد حجز التجربة ====================
