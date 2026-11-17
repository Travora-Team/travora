import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

Widget _experienceInfoRow(String label, String value, {Color? valueColor}) =>
    Row(children: [
      Text(label, style: const TextStyle(fontSize: 13, color: greyText)),
      const Spacer(),
      Expanded(
        child: Text(
          value,
          textAlign: TextAlign.end,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: valueColor ?? textColor,
          ),
        ),
      ),
    ]);

class ExperiencePaymentSuccessScreen extends StatelessWidget {
  final String title;
  final String image;
  final String guide;
  final String date;
  final String time;
  final int hours;
  final int pricePerPerson;
  final int travelers;
  final String guestName;
  final String email;
  final String phone;
  final String paymentMethod;
  final String bookingRef;

  const ExperiencePaymentSuccessScreen({
    super.key,
    required this.title,
    required this.image,
    required this.guide,
    required this.date,
    required this.time,
    required this.hours,
    required this.pricePerPerson,
    required this.travelers,
    required this.guestName,
    required this.email,
    required this.phone,
    required this.paymentMethod,
    required this.bookingRef,
  });

  int get total => pricePerPerson * travelers;
  bool get isPaid => paymentMethod != 'الدفع عند الوصول';

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('حجز تجربتك مؤكد',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              const Text('نتمنى لك تجربة سياحية ممتعة',
                  style: TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: whiteCard,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(children: [
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E9),
                      borderRadius: BorderRadius.circular(50),
                    ),
                    child: const Icon(Icons.check,
                        color: Color(0xFF2E7D32), size: 30),
                  ),
                  const SizedBox(height: 12),
                  const Text('تم تأكيد حجز التجربة بنجاح',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                  const SizedBox(height: 6),
                  Text(
                    'تم تسجيل الحجز باسم $guestName\nورقم الحجز $bookingRef',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                        fontSize: 13, color: greyText, height: 1.6),
                  ),
                  const SizedBox(height: 8),
                  Text(bookingRef,
                      style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: navy)),
                ]),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: whiteCard,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(image,
                            height: 170,
                            width: double.infinity,
                            fit: BoxFit.cover),
                      ),
                      const SizedBox(height: 12),
                      Text(title,
                          style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      const SizedBox(height: 10),
                      _experienceInfoRow('التاريخ', date),
                      const SizedBox(height: 8),
                      _experienceInfoRow('موعد التجربة', time),
                      const SizedBox(height: 8),
                      _experienceInfoRow('مدة التجربة', '$hours ساعات'),
                      const SizedBox(height: 8),
                      _experienceInfoRow('المرشد السياحي', guide),
                      const SizedBox(height: 8),
                      _experienceInfoRow('عدد المسافرين', '$travelers'),
                    ]),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: whiteCard,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(children: [
                  _experienceInfoRow('اسم المسافر', guestName),
                  const SizedBox(height: 10),
                  _experienceInfoRow('البريد الإلكتروني', email),
                  if (phone.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    _experienceInfoRow('رقم الهاتف', phone),
                  ],
                  const SizedBox(height: 10),
                  _experienceInfoRow('طريقة الدفع', paymentMethod),
                  const SizedBox(height: 10),
                  _experienceInfoRow('سعر الفرد', '$pricePerPerson ج.م'),
                  const SizedBox(height: 10),
                  _experienceInfoRow('الإجمالي', '$total ج.م',
                      valueColor: navy),
                  const SizedBox(height: 10),
                  _experienceInfoRow(
                      'حالة السداد', isPaid ? 'مدفوع' : 'الدفع عند الوصول',
                      valueColor: isPaid
                          ? const Color(0xFF2E7D32)
                          : const Color(0xFFFF8F00)),
                  const SizedBox(height: 10),
                  _experienceInfoRow('حالة الحجز', 'مؤكد',
                      valueColor: const Color(0xFF2E7D32)),
                ]),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ExperienceBookingDetailsScreen(
                        title: title,
                        image: image,
                        guide: guide,
                        date: date,
                        time: time,
                        hours: hours,
                        pricePerPerson: pricePerPerson,
                        travelers: travelers,
                        guestName: guestName,
                        email: email,
                        phone: phone,
                        paymentMethod: paymentMethod,
                        bookingRef: bookingRef,
                      ),
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: navy,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('عرض تفاصيل الحجز',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ExperienceTicketScreen(
                        title: title,
                        image: image,
                        guide: guide,
                        date: date,
                        time: time,
                        hours: hours,
                        pricePerPerson: pricePerPerson,
                        travelers: travelers,
                        guestName: guestName,
                        email: email,
                        phone: phone,
                        paymentMethod: paymentMethod,
                        bookingRef: bookingRef,
                      ),
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: navy,
                    side: const BorderSide(color: navy),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('عرض التذكرة',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: TextButton(
                  onPressed: () =>
                      Navigator.popUntil(context, (route) => route.isFirst),
                  child: const Text('العودة للرئيسية',
                      style:
                          TextStyle(color: navy, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ==================== تفاصيل حجز التجربة ====================
class ExperienceBookingDetailsScreen extends StatelessWidget {
  final String title;
  final String image;
  final String guide;
  final String date;
  final String time;
  final int hours;
  final int pricePerPerson;
  final int travelers;
  final String guestName;
  final String email;
  final String phone;
  final String paymentMethod;
  final String bookingRef;

  const ExperienceBookingDetailsScreen({
    super.key,
    required this.title,
    required this.image,
    required this.guide,
    required this.date,
    required this.time,
    required this.hours,
    required this.pricePerPerson,
    required this.travelers,
    required this.guestName,
    required this.email,
    required this.phone,
    required this.paymentMethod,
    required this.bookingRef,
  });

  int get total => pricePerPerson * travelers;
  bool get isPaid => paymentMethod != 'الدفع عند الوصول';

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: whiteCard, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(image,
                          width: double.infinity,
                          height: 190,
                          fit: BoxFit.cover),
                    ),
                    const SizedBox(height: 12),
                    Text(title,
                        style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 12),
                    _experienceInfoRow('رقم الحجز', bookingRef),
                    const SizedBox(height: 10),
                    _experienceInfoRow('تاريخ التجربة', date),
                    const SizedBox(height: 10),
                    _experienceInfoRow('موعد التجربة', time),
                    const SizedBox(height: 10),
                    _experienceInfoRow('مدة التجربة', '$hours ساعات'),
                    const SizedBox(height: 10),
                    _experienceInfoRow('المرشد السياحي', guide),
                    const SizedBox(height: 10),
                    _experienceInfoRow('عدد المسافرين', '$travelers'),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: whiteCard, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
                    _experienceInfoRow('اسم المسافر', guestName),
                    const SizedBox(height: 10),
                    _experienceInfoRow('البريد الإلكتروني', email),
                    if (phone.isNotEmpty) ...[
                      const SizedBox(height: 10),
                      _experienceInfoRow('رقم الهاتف', phone),
                    ],
                    const SizedBox(height: 10),
                    _experienceInfoRow('طريقة الدفع', paymentMethod),
                    const SizedBox(height: 10),
                    _experienceInfoRow('سعر الفرد', '$pricePerPerson ج.م'),
                    const SizedBox(height: 10),
                    _experienceInfoRow('الإجمالي', '$total ج.م',
                        valueColor: navy),
                    const SizedBox(height: 10),
                    _experienceInfoRow(
                        'حالة السداد', isPaid ? 'مدفوع' : 'الدفع عند الوصول',
                        valueColor: isPaid
                            ? const Color(0xFF2E7D32)
                            : const Color(0xFFFF8F00)),
                    const SizedBox(height: 10),
                    _experienceInfoRow('حالة الحجز', 'مؤكد',
                        valueColor: const Color(0xFF2E7D32)),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton.icon(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ExperienceTicketScreen(
                        title: title,
                        image: image,
                        guide: guide,
                        date: date,
                        time: time,
                        hours: hours,
                        pricePerPerson: pricePerPerson,
                        travelers: travelers,
                        guestName: guestName,
                        email: email,
                        phone: phone,
                        paymentMethod: paymentMethod,
                        bookingRef: bookingRef,
                      ),
                    ),
                  ),
                  icon: const Icon(Icons.confirmation_number_outlined),
                  label: const Text('عرض التذكرة'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: navy,
                    side: const BorderSide(color: navy),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ==================== تذكرة التجربة ====================
class ExperienceTicketScreen extends StatelessWidget {
  final String title;
  final String image;
  final String guide;
  final String date;
  final String time;
  final int hours;
  final int pricePerPerson;
  final int travelers;
  final String guestName;
  final String email;
  final String phone;
  final String paymentMethod;
  final String bookingRef;

  const ExperienceTicketScreen({
    super.key,
    required this.title,
    required this.image,
    required this.guide,
    required this.date,
    required this.time,
    required this.hours,
    required this.pricePerPerson,
    required this.travelers,
    required this.guestName,
    required this.email,
    required this.phone,
    required this.paymentMethod,
    required this.bookingRef,
  });

  int get total => pricePerPerson * travelers;
  bool get isPaid => paymentMethod != 'الدفع عند الوصول';

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
                color: whiteCard, borderRadius: BorderRadius.circular(18)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  const Icon(Icons.check_circle, color: Color(0xFF2E7D32)),
                  const SizedBox(width: 8),
                  const Text('تذكرة مؤكدة',
                      style: TextStyle(
                          color: Color(0xFF2E7D32),
                          fontWeight: FontWeight.bold)),
                  const Spacer(),
                  const Text('TRAVORA',
                      style:
                          TextStyle(color: navy, fontWeight: FontWeight.bold)),
                ]),
                const SizedBox(height: 14),
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(image,
                      width: double.infinity, height: 180, fit: BoxFit.cover),
                ),
                const SizedBox(height: 14),
                Text(title,
                    style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                const SizedBox(height: 14),
                _experienceInfoRow('اسم المسافر', guestName),
                const SizedBox(height: 10),
                _experienceInfoRow('رقم الحجز', bookingRef),
                const Divider(height: 24, color: lightBorder),
                _experienceInfoRow('التاريخ', date),
                const SizedBox(height: 10),
                _experienceInfoRow('الوقت', time),
                const SizedBox(height: 10),
                _experienceInfoRow('المدة', '$hours ساعات'),
                const SizedBox(height: 10),
                _experienceInfoRow('المرشد', guide),
                const SizedBox(height: 10),
                _experienceInfoRow('عدد المسافرين', '$travelers'),
                const Divider(height: 24, color: lightBorder),
                _experienceInfoRow('البريد الإلكتروني', email),
                if (phone.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  _experienceInfoRow('رقم الهاتف', phone),
                ],
                const SizedBox(height: 10),
                _experienceInfoRow('طريقة الدفع', paymentMethod),
                const SizedBox(height: 10),
                _experienceInfoRow('الإجمالي', '$total ج.م', valueColor: navy),
                const SizedBox(height: 10),
                _experienceInfoRow(
                    'حالة السداد', isPaid ? 'مدفوع' : 'الدفع عند الوصول',
                    valueColor: isPaid
                        ? const Color(0xFF2E7D32)
                        : const Color(0xFFFF8F00)),
                const SizedBox(height: 22),
                Center(
                  child: Column(children: [
                    const Icon(Icons.qr_code_2, size: 76, color: textColor),
                    const SizedBox(height: 4),
                    Text(bookingRef,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, color: textColor)),
                    const SizedBox(height: 4),
                    const Text('احتفظ بهذه التذكرة عند حضور التجربة',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: greyText)),
                  ]),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
