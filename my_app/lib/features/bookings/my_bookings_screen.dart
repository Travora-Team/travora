import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/payment_screens.dart';
import 'package:my_app/features/experiences/experience_booking_screens.dart';
import 'package:my_app/features/hotels/hotel_detail_screen.dart';
import 'package:my_app/features/hotels/hotels_screen.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});
  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  bool showUpcoming = true; // true = القادمة , false = الملغاة

  void _showBookingDetails(
      String title, String date, String status, String statusColorName) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
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
                const Text('تفاصيل الحجز',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context)),
              ]),
              const SizedBox(height: 8),
              Text(title,
                  style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 6),
              Text(date, style: const TextStyle(color: greyText)),
              const SizedBox(height: 10),
              Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                      color: status == 'مؤكد'
                          ? const Color(0xFFE6F7ED)
                          : status == 'قادم'
                              ? lightBlueBg
                              : const Color(0xFFFDECEC),
                      borderRadius: BorderRadius.circular(20)),
                  child: Text(status,
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: status == 'مؤكد'
                              ? Colors.green
                              : status == 'قادم'
                                  ? navy
                                  : Colors.red,
                          fontSize: 13))),
              const SizedBox(height: 20),
              SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);

                        if (status == 'ملغي') {
                          final cancelledBooking = BookingData(
                            title: 'إقامة فاخرة على النيل',
                            subTitle: 'ديلوكس - سرير كبير • إفطار شامل',
                            image:
                                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
                            dateRange: '15 - 18 مارس 2027',
                            nights: 3,
                            travelers: 2,
                            pricePerNight: 6800,
                            guestName: TravoraUser.name.isEmpty
                                ? 'المسافر الرئيسي'
                                : TravoraUser.name,
                            email: TravoraUser.email,
                            paymentMethod: 'بطاقة بنكية',
                            bookingRef: 'TRV-2027-1048',
                            isPaid: true,
                          );

                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CancelledBookingDetailsScreen(
                                booking: cancelledBooking,
                              ),
                            ),
                          );
                        } else if (title == 'جولة أهرامات الجيزة' ||
                            title == 'عطلة شرم الشيخ') {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ExperienceBookingDetailsScreen(
                                title: 'جولة الأهرامات وأبو الهول',
                                image: pyramidsImage,
                                guide: 'مرشد عربي',
                                date: '16 مارس 2027',
                                time: '9:00 صباحاً',
                                hours: 4,
                                pricePerPerson: 650,
                                travelers: 2,
                                guestName: TravoraUser.name.isEmpty
                                    ? 'المسافر الرئيسي'
                                    : TravoraUser.name,
                                email: TravoraUser.email.isEmpty
                                    ? 'غير محدد'
                                    : TravoraUser.email,
                                phone: '',
                                paymentMethod: 'بطاقة بنكية',
                                bookingRef: 'TRV-EXP-2027-001',
                              ),
                            ),
                          );
                        } else if (title == 'إقامة فاخرة على النيل') {
                          final booking = BookingData(
                            title: 'إقامة فاخرة على النيل',
                            subTitle: 'ديلوكس - سرير كبير • إفطار شامل',
                            image:
                                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
                            dateRange: '15 - 18 مارس 2027',
                            nights: 3,
                            travelers: 2,
                            pricePerNight: 6800,
                            guestName: TravoraUser.name,
                            email: TravoraUser.email,
                            paymentMethod: 'بطاقة بنكية',
                            bookingRef: 'TRV-2027-1048',
                            isPaid: true,
                          );

                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) =>
                                  BookingDetailsScreen(booking: booking),
                            ),
                          );
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const HotelDetailScreen(),
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                          backgroundColor: navy,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14))),
                      child: const Text('عرض التفاصيل الكاملة',
                          style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold)))),
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
                child: Text('حجوزاتي',
                    style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: textColor))),
            const SizedBox(height: 6),
            const Center(
                child: Text('تابع حجوزاتك وأدر تفاصيلها بسهولة',
                    style: TextStyle(color: greyText, fontSize: 13))),
            const SizedBox(height: 18),
            // الزرارين جنب بعض - القادمة / الملغاة
            Row(children: [
              Expanded(
                  child: _tabButton('القادمة', showUpcoming,
                      () => setState(() => showUpcoming = true))),
              const SizedBox(width: 10),
              Expanded(
                  child: _tabButton('الملغاة', !showUpcoming,
                      () => setState(() => showUpcoming = false))),
            ]),
            const SizedBox(height: 20),

            if (showUpcoming) ...[
              // 1 - إقامة فاخرة على النيل
              _bookingCard(
                image:
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
                title: 'إقامة فاخرة على النيل',
                date: 'من 15 - 18 مارس 2027 - 3 ليالٍ',
                status: 'مؤكد',
                statusColor: Colors.green,
                onDetails: () => _showBookingDetails('إقامة فاخرة على النيل',
                    'من 15 - 18 مارس 2027 - 3 ليالٍ', 'مؤكد', 'green'),
              ),
              // 2 - جولة أهرامات الجيزة
              _bookingCard(
                image:
                    'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1200&q=85',
                title: 'جولة أهرامات الجيزة',
                date: '16 مارس 2027 - مسافران',
                status: 'مؤكد',
                statusColor: Colors.green,
                onDetails: () => _showBookingDetails('جولة أهرامات الجيزة',
                    '16 مارس 2027 - مسافران', 'مؤكد', 'green'),
              ),
              // 3 - عطلة شرم الشيخ
              _bookingCard(
                image:
                    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
                title: 'عطلة شرم الشيخ',
                date: 'من 8 - 12 يوليو 2027 - 4 ليالٍ',
                status: 'قادم',
                statusColor: navy,
                secondStatus: 'مؤكد',
                onDetails: () => _showBookingDetails('عطلة شرم الشيخ',
                    'من 8 - 12 يوليو 2027 - 4 ليالٍ', 'قادم', 'navy'),
              ),
            ] else ...[
              // الملغاة - كارت واحد
              _bookingCard(
                image:
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
                title: 'إقامة فاخرة على ضفاف النيل',
                date: 'من 15 - 18 مارس 2027 - 3 ليالٍ - مسافران',
                status: 'ملغي',
                statusColor: Colors.red,
                onDetails: () => _showBookingDetails(
                    'إقامة فاخرة على ضفاف النيل',
                    'من 15 - 18 مارس 2027 - 3 ليالٍ - مسافران',
                    'ملغي',
                    'red'),
              ),
              const SizedBox(height: 8),
              // تغيرت خطتك؟
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                    color: whiteCard,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: lightBorder)),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('تغيرت خطتك؟',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      const SizedBox(height: 8),
                      const Text(
                          'اكتشف إقامة أخرى أو ابدأ رحلة جديدة تناسب وقتك.',
                          style: TextStyle(color: greyText, height: 1.6)),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const HotelsScreen()));
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: navy,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14))),
                          child: const Text('اكتشاف الفنادق',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ]),
              ),
            ],
          ]),
        ),
      ),
    );
  }

  Widget _tabButton(String text, bool selected, VoidCallback onTap) {
    return SizedBox(
      height: 48,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: selected ? navy : whiteCard,
          foregroundColor: selected ? Colors.white : textColor,
          elevation: 0,
          side: BorderSide(color: selected ? navy : lightBorder),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
        child: Text(text, style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _bookingCard(
      {required String image,
      required String title,
      required String date,
      required String status,
      required Color statusColor,
      String? secondStatus,
      required VoidCallback onDetails}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: lightBorder)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
            child: Image.network(image,
                height: 180,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (c, e, s) => Container(
                    height: 180,
                    color: lightBorder,
                    child: const Icon(Icons.image, color: navy, size: 40)))),
        Padding(
          padding: const EdgeInsets.all(16),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Expanded(
                  child: Text(title,
                      style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: textColor))),
              Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                      color: status == 'مؤكد'
                          ? const Color(0xFFE6F7ED)
                          : status == 'قادم'
                              ? lightBlueBg
                              : const Color(0xFFFDECEC),
                      borderRadius: BorderRadius.circular(20)),
                  child: Text(status,
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: statusColor,
                          fontSize: 12))),
            ]),
            if (secondStatus != null) ...[
              const SizedBox(height: 6),
              Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                      color: const Color(0xFFE6F7ED),
                      borderRadius: BorderRadius.circular(20)),
                  child: Text(secondStatus,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                          fontSize: 12))),
            ],
            const SizedBox(height: 8),
            Text(date, style: const TextStyle(color: greyText, fontSize: 13)),
            const SizedBox(height: 14),
            SizedBox(
                width: double.infinity,
                height: 48,
                child: OutlinedButton(
                    onPressed: onDetails,
                    style: OutlinedButton.styleFrom(
                        backgroundColor: const Color(0xFFF8FBFF),
                        side: const BorderSide(color: lightBorder),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12))),
                    child: const Text('تفاصيل الحجز',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
          ]),
        ),
      ]),
    );
  }
}

// =================== صفحة مستندات الرحلة - نفس الفيديو بالظبط ===================
