class TransportBookingData {
  String title;
  String type;
  String priceText;
  int priceValue;
  String dateText;
  String firstName;
  String lastName;
  String email;
  String phone;
  String paymentMethod;
  String bookingId;
  bool isCancelled;
  TransportBookingData(
      {required this.title,
      required this.type,
      required this.priceText,
      required this.priceValue,
      required this.dateText,
      required this.firstName,
      required this.lastName,
      required this.email,
      required this.phone,
      required this.paymentMethod,
      this.bookingId = 'TRV-2027-1048',
      this.isCancelled = false});
  String get fullName => '$firstName $lastName';
  int get paid => paymentMethod == 'الدفع لاحقاً' ? 0 : priceValue;
  String get paymentStatus => paymentMethod == 'الدفع لاحقاً'
      ? 'مؤكد - مستحق السداد'
      : 'تم الدفع بنجاح';
  String get paymentNote => paymentMethod == 'الدفع لاحقاً'
      ? 'المبلغ عند موعد الخدمة - لا يخصم مبلغ الآن'
      : 'تم خصم المبلغ من طريقة الدفع المختارة';
}

// ---------- 4: صفحة أكمل حجزك ----------
