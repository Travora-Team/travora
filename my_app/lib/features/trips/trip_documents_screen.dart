import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/my_bookings_screen.dart';
import 'package:my_app/features/bookings/payment_screens.dart';
import 'package:my_app/features/experiences/experience_booking_screens.dart';
import 'package:my_app/features/transport/transport_screen.dart';
import 'package:my_app/features/trips/smart_plan_result_screen.dart';

class TripDocumentsScreen extends StatefulWidget {
  const TripDocumentsScreen({super.key});
  @override
  State<TripDocumentsScreen> createState() => _TripDocumentsScreenState();
}

class _TripDocumentsScreenState extends State<TripDocumentsScreen> {
  // الاسم ده مش ثابت - بيجي من إنشاء الحساب / تسجيل الدخول
  // غيريه من هنا وهيتغير في تذكرة الطيران لوحده
  String travelerName = 'يوسف محمد';

  List<Map<String, dynamic>> savedDocs = [
    {
      'title': 'تذكرة الطيران',
      'sub': 'ملف PDF - اضيف المستند إلى الرحلة',
      'isPdf': true
    },
  ];

  void _openHotelConfirmation() {
    final booking = BookingData(
      title: 'إقامة فاخرة على النيل',
      subTitle: 'ديلوكس - سرير كبير • إفطار شامل',
      image:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
      dateRange: '15 - 18 مارس 2027',
      nights: 3,
      travelers: 2,
      pricePerNight: 6800,
      guestName: travelerName,
      email:
          TravoraUser.email.isEmpty ? 'yousif@example.com' : TravoraUser.email,
      paymentMethod: 'بطاقة بنكية',
      bookingRef: 'TRV-2027-1048',
      isPaid: true,
    );

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentSuccessScreen(booking: booking),
      ),
    );
  }

  void _openPyramidsTicket() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ExperienceTicketScreen(
          title: 'جولة الأهرامات وأبو الهول',
          image: pyramidsImage,
          guide: 'مرشد عربي',
          date: '16 مارس 2027',
          time: '9:00 صباحاً',
          hours: 4,
          pricePerPerson: 650,
          travelers: 2,
          guestName: travelerName,
          email: TravoraUser.email.isEmpty
              ? 'yousif@example.com'
              : TravoraUser.email,
          phone: '',
          paymentMethod: 'بطاقة بنكية',
          bookingRef: 'TRV-EXP-2027-001',
        ),
      ),
    );
  }

  void _showAddDocument() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
        child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('إضافة مستند',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context)),
              ]),
              const SizedBox(height: 8),
              InkWell(
                onTap: () {
                  Navigator.pop(context);
                  _showSavedConfirm();
                },
                child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                        color: const Color(0xFFEAF3FF),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: lightBorder)),
                    child: Row(children: [
                      Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                              color: whiteCard,
                              borderRadius: BorderRadius.circular(12)),
                          child: const Icon(Icons.picture_as_pdf_outlined,
                              color: navy, size: 28)),
                      const SizedBox(width: 12),
                      const Expanded(
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                            Text('تذكرة الطيران',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: textColor,
                                    fontSize: 16)),
                            SizedBox(height: 3),
                            Text('PDF', style: TextStyle(color: greyText)),
                          ])),
                      const Icon(Icons.check_circle, color: navy),
                    ])),
              ),
              const SizedBox(height: 16),
              SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _showSavedConfirm();
                      },
                      style: ElevatedButton.styleFrom(
                          backgroundColor: navy,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14))),
                      child: const Text('إضافة إلى الرحلة',
                          style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold)))),
            ]),
      ),
    );
  }

  void _showSavedConfirm() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.check_circle, color: navy, size: 48),
          const SizedBox(height: 12),
          const Text('المستند محفوظ',
              style: TextStyle(
                  fontSize: 20, fontWeight: FontWeight.bold, color: textColor)),
          const SizedBox(height: 8),
          const Text('أضيف المستند النموذجي إلى رحلتك.',
              style: TextStyle(color: greyText), textAlign: TextAlign.center),
          const SizedBox(height: 20),
          SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                      backgroundColor: navy,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14))),
                  child: const Text('عرض المستندات',
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold)))),
          const SizedBox(height: 10),
          SizedBox(
              width: double.infinity,
              height: 50,
              child: TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('إغلاق',
                      style: TextStyle(
                          color: greyText, fontWeight: FontWeight.bold)))),
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            // العنوان
            const Center(
                child: Text('مستندات الرحلة',
                    style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: textColor))),
            const SizedBox(height: 6),
            const Center(
                child: Text('تذاكرك وحجوزاتك في مكان واحد',
                    style: TextStyle(color: greyText))),
            const SizedBox(height: 16),
            // جاهز للمراجعة
            Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: const Color(0xFFEAF3FF),
                    borderRadius: BorderRadius.circular(16)),
                child: Row(children: [
                  Container(
                      padding: const EdgeInsets.all(10),
                      decoration: const BoxDecoration(
                          color: whiteCard, shape: BoxShape.circle),
                      child: const Icon(Icons.check_circle, color: navy)),
                  const SizedBox(width: 12),
                  const Expanded(
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                        Text('جاهز للمراجعة',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: textColor)),
                        SizedBox(height: 4),
                        Text(
                            'راجع بيانات المسافرين وتواريخ الحجوزات قبل الانطلاق.',
                            style: TextStyle(color: greyText, height: 1.5)),
                      ])),
                ])),
            const SizedBox(height: 20),
            // 1 - تأكيد حجز الفندق
            _docCard(
                icon: Icons.hotel_outlined,
                title: 'تأكيد حجز الفندق',
                sub: 'TRV-2027-1048 - 15 - 18 مارس 2027 - PDF',
                onTap: _openHotelConfirmation),
            // 2 - تذكرة جولة الأهرامات
            _docCard(
                icon: Icons.confirmation_number_outlined,
                title: 'تذكرة جولة الأهرامات',
                sub: 'مسافران - 16 مارس - 9:00 ص',
                onTap: _openPyramidsTicket),
            // 3 - برنامج الرحلة - بيفتح SmartPlanResultScreen
            _docCard(
              icon: Icons.map_outlined,
              title: 'برنامج الرحلة',
              sub: 'القاهرة والجيزة - 4 أيام',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const SmartPlanResultScreen(
                      destination: 'القاهرة، مصر',
                      date: '15 مارس، 2027',
                      duration: 4,
                      travelers: '2 بالغين، غرفة واحدة',
                      budget: '6,000 ج.م',
                      interests: ['ثقافة وتاريخ'],
                      pace: 'متوازنة',
                      transport: 'سيارة مع سائق',
                      accommodation: 'فندق 4 نجوم',
                      notes: '',
                    ),
                  ),
                );
              },
            ),
            // 4 - بيانات الانتقال
            _docCard(
                icon: Icons.directions_car_outlined,
                title: 'بيانات الانتقال',
                sub: 'الفندق - مطار القاهرة - 18 مارس',
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const TransportScreen(),
                    ),
                  );
                }),
            const SizedBox(height: 16),
            // زرار إضافة مستند
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                    onPressed: _showAddDocument,
                    icon: const Icon(Icons.add, color: Colors.white),
                    label: const Text('+ إضافة مستند',
                        style: TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))))),
            const SizedBox(height: 20),
            // احفظ بنسخة مناسبة للسفر
            Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: whiteCard,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: lightBorder)),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('احفظ بنسخة مناسبة للسفر',
                          style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: textColor)),
                      const SizedBox(height: 6),
                      const Text(
                          'يمكنك فتح التذكرة من تفاصيل الحجز ومراجعة مرجعها دون البحث في بقية الرحلة.',
                          style: TextStyle(color: greyText, height: 1.6)),
                      const SizedBox(height: 14),
                      SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: OutlinedButton(
                              onPressed: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (_) =>
                                            const MyBookingsScreen()));
                              },
                              style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: navy),
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                              child: const Text('راجع حجوزاتي',
                                  style: TextStyle(
                                      color: navy,
                                      fontWeight: FontWeight.bold)))),
                    ])),
            const SizedBox(height: 20),
            // المستندات المحفوظة
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('المستندات المحفوظة',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                      color: lightBlueBg,
                      borderRadius: BorderRadius.circular(20)),
                  child: const Text('4 مستندات',
                      style: TextStyle(
                          color: navy,
                          fontWeight: FontWeight.bold,
                          fontSize: 12))),
            ]),
            const SizedBox(height: 12),
            for (var d in savedDocs) _savedDocCard(d),
          ]),
        ),
      ),
    );
  }

  Widget _docCard(
      {required IconData icon,
      required String title,
      required String sub,
      required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
              color: whiteCard,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: lightBorder)),
          child: Row(children: [
            Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                    color: lightBlueBg,
                    borderRadius: BorderRadius.circular(10)),
                child: Icon(icon, color: navy)),
            const SizedBox(width: 12),
            Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                  Text(title,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, color: textColor)),
                  const SizedBox(height: 3),
                  Text(sub,
                      style: const TextStyle(color: greyText, fontSize: 12))
                ])),
            Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                    color: Color(0xFFE6F7ED), shape: BoxShape.circle),
                child: const Icon(Icons.check, color: Colors.green, size: 16)),
          ])),
    );
  }

  Widget _savedDocCard(Map<String, dynamic> d) {
    return InkWell(
      onTap: () {
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (_) =>
                    FlightTicketDetailScreen(travelerName: travelerName)));
      },
      child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
              color: whiteCard,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: lightBorder)),
          child: Row(children: [
            Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                    color: lightBlueBg,
                    borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.picture_as_pdf_outlined, color: navy)),
            const SizedBox(width: 12),
            Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                  Text(d['title'],
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, color: textColor)),
                  const SizedBox(height: 3),
                  Text(d['sub'],
                      style: const TextStyle(color: greyText, fontSize: 12))
                ])),
            Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                    color: Color(0xFFE6F7ED), shape: BoxShape.circle),
                child: const Icon(Icons.check, color: Colors.green, size: 16)),
          ])),
    );
  }
}

// =================== صفحة تفاصيل تذكرة الطيران ===================
class FlightTicketDetailScreen extends StatelessWidget {
  final String travelerName;
  const FlightTicketDetailScreen({super.key, this.travelerName = 'يوسف محمد'});
  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                    color: whiteCard,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: lightBorder)),
                child: Column(children: [
                  Container(
                      padding: const EdgeInsets.all(14),
                      decoration: const BoxDecoration(
                          color: lightBlueBg, shape: BoxShape.circle),
                      child: const Icon(Icons.flight_takeoff_outlined,
                          color: navy, size: 32)),
                  const SizedBox(height: 14),
                  const Text('تذكرة الطيران',
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                  const Text('PDF', style: TextStyle(color: greyText)),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  _flightRow('الرحلة', 'القاهرة - MS 736'),
                  _flightRow('الموعد', '15 مارس 2027 - 10:30 صباحاً'),
                  _flightRow('المسافر', '$travelerName - مسافران'),
                  _flightRow('مرجع المستند', 'TRV-FLIGHT-2048'),
                  const SizedBox(height: 8),
                  const Text('مستند توضيحي داخل النموذج.',
                      style: TextStyle(color: greyText)),
                ])),
            const SizedBox(height: 20),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('العودة إلى المستندات',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _flightRow(String label, String value) {
    return Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child:
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(label, style: const TextStyle(color: greyText)),
          Flexible(
              child: Text(value,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, color: textColor),
                  textAlign: TextAlign.end))
        ]));
  }
}

// ==================== SHARE TRIP BOTTOM SHEET ====================
