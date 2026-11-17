import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/transport/transport_screen.dart';

void showConfirmBookingSheet(BuildContext context,
    {required TransportBookingData data}) {
  final Color navy = const Color(0xFF1E88FF);
  final Color bg = const Color(0xFFEEF5FF);
  final Color txt = const Color(0xFF0A2A5E);
  final Color grey = const Color(0xFF8A9BB5);
  final Color lightBg = const Color(0xFFE3F0FF);
  showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (_) => Padding(
          padding: const EdgeInsets.all(16),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Row(children: [
              InkWell(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                          color: bg, borderRadius: BorderRadius.circular(20)),
                      child: Icon(Icons.close, size: 18, color: txt))),
              const Spacer(),
              Text('نؤكد حجزك',
                  style: TextStyle(
                      fontSize: 17, fontWeight: FontWeight.bold, color: txt))
            ]),
            const SizedBox(height: 16),
            Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: lightBg, borderRadius: BorderRadius.circular(50)),
                child: Icon(Icons.check, color: navy, size: 28)),
            const SizedBox(height: 12),
            Text('راجع بيانات الحجز',
                style: TextStyle(
                    fontSize: 15, fontWeight: FontWeight.bold, color: txt)),
            const SizedBox(height: 6),
            Text(
                '${data.type} - ${data.title} - ${data.priceText} - ${data.dateText} - ${data.fullName}',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: grey, height: 1.6)),
            const SizedBox(height: 16),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) =>
                                  TransportServiceBookingConfirmedScreen(
                                      data: data)));
                    },
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('نؤكد حجزك',
                        style: TextStyle(fontWeight: FontWeight.bold))))
          ])));
}

// ---------- 6: حجزك مؤكد ----------
class TransportServiceBookingConfirmedScreen extends StatelessWidget {
  final TransportBookingData data;
  const TransportServiceBookingConfirmedScreen({super.key, required this.data});
  @override
  Widget build(BuildContext context) {
    final Color navy = const Color(0xFF1E88FF);
    final Color bg = const Color(0xFFEEF5FF);
    final Color card = Colors.white;
    final Color lightBg = const Color(0xFFE3F0FF);
    final Color border = const Color(0xFFD6E6FF);
    final Color txt = const Color(0xFF0A2A5E);
    final Color grey = const Color(0xFF8A9BB5);
    return Directionality(
        textDirection: TextDirection.rtl,
        child: Scaffold(
            backgroundColor: bg,
            appBar: AppBar(
                backgroundColor: card,
                elevation: 0,
                leading: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.arrow_back_ios, size: 18, color: txt)),
                title: Row(children: [
                  Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                          color: navy, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.send,
                          color: Colors.white, size: 16)),
                  const SizedBox(width: 8),
                  Text('Travora',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: txt))
                ])),
            body: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('حجزك مؤكد',
                          style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: txt)),
                      const SizedBox(height: 4),
                      Text('رحلة سعيدة',
                          style: TextStyle(fontSize: 13, color: grey)),
                      const SizedBox(height: 16),
                      Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                              color: card,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: border)),
                          child: Column(children: [
                            Container(
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                    color: lightBg,
                                    borderRadius: BorderRadius.circular(50)),
                                child:
                                    Icon(Icons.check, color: navy, size: 28)),
                            const SizedBox(height: 12),
                            Text('تم الحجز بنجاح',
                                style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: txt)),
                            const SizedBox(height: 6),
                            Text('أرسلنا تفاصيل الحجز على ${data.email}',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    fontSize: 13, color: grey, height: 1.6)),
                            const SizedBox(height: 6),
                            Text(data.bookingId,
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, color: navy))
                          ])),
                      const SizedBox(height: 16),
                      Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                              color: card,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: border)),
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ClipRRect(
                                    borderRadius: const BorderRadius.vertical(
                                        top: Radius.circular(18)),
                                    child: Image.network(
                                        'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80',
                                        height: 160,
                                        width: double.infinity,
                                        fit: BoxFit.cover)),
                                Padding(
                                    padding: const EdgeInsets.all(14),
                                    child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text('${data.type} - ${data.title}',
                                              style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.bold,
                                                  color: txt)),
                                          const SizedBox(height: 4),
                                          Text(
                                              '${data.dateText} - 10:30 ص - رحلة واحدة',
                                              style: TextStyle(
                                                  fontSize: 12, color: grey))
                                        ]))
                              ])),
                      const SizedBox(height: 16),
                      SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                              onPressed: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (_) =>
                                          TransportServiceBookingDetailsScreen(
                                              data: data))),
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: navy,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14))),
                              child: const Text('عرض تفاصيل الحجز',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold)))),
                      const SizedBox(height: 10),
                      SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                              onPressed: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (_) =>
                                          TransportServiceBookingTicketScreen(
                                              data: data))),
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: lightBg,
                                  foregroundColor: navy,
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                              child: const Text('عرض التذكرة',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold))))
                    ]))));
  }
}

// ---------- 7: تفاصيل الحجز / الملغي ----------
class TransportServiceBookingDetailsScreen extends StatefulWidget {
  final TransportBookingData data;
  const TransportServiceBookingDetailsScreen({super.key, required this.data});
  @override
  State<TransportServiceBookingDetailsScreen> createState() =>
      _TransportServiceBookingDetailsScreenState();
}

class _TransportServiceBookingDetailsScreenState
    extends State<TransportServiceBookingDetailsScreen> {
  late TransportBookingData data;
  @override
  void initState() {
    super.initState();
    data = widget.data;
  }

  void _showCancelPolicy() {
    final Color navy = const Color(0xFF1E88FF);
    final Color bg = const Color(0xFFEEF5FF);
    final Color txt = const Color(0xFF0A2A5E);
    final Color grey = const Color(0xFF8A9BB5);
    showModalBottomSheet(
        context: context,
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
        builder: (_) => Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    InkWell(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                                color: bg,
                                borderRadius: BorderRadius.circular(20)),
                            child: Icon(Icons.close, size: 18, color: txt))),
                    const Spacer(),
                    Text('سياسة التعديل والإلغاء',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt))
                  ]),
                  const SizedBox(height: 6),
                  Text('راجع شروط الخدمة قبل تأكيد الحجز',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 14),
                  Text('قبل الوصول بـ 7 أيام',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, color: txt)),
                  const SizedBox(height: 4),
                  Text('إلغاء مجاني في هذا المثال',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 12),
                  Text('بعد المهلة',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, color: txt)),
                  const SizedBox(height: 4),
                  Text('قد تطبق رسوم الإلغاء',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 12),
                  Text('الاسترداد',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, color: txt)),
                  const SizedBox(height: 4),
                  Text('تظهر طريقة الاسترداد والمهلة في تفاصيل الحجز',
                      style: TextStyle(fontSize: 13, color: grey, height: 1.6)),
                  const SizedBox(height: 16),
                  SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                          onPressed: () => Navigator.pop(context),
                          style: ElevatedButton.styleFrom(
                              backgroundColor: navy,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14))),
                          child: const Text('فهمت',
                              style: TextStyle(fontWeight: FontWeight.bold))))
                ])));
  }

  void _showShare() {
    final Color navy = const Color(0xFF1E88FF);
    final Color bg = const Color(0xFFEEF5FF);
    final Color txt = const Color(0xFF0A2A5E);
    final Color grey = const Color(0xFF8A9BB5);
    const link = 'travora.example/trip/cairo-1048';
    showModalBottomSheet(
        context: context,
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
        builder: (_) => Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    InkWell(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                                color: bg,
                                borderRadius: BorderRadius.circular(20)),
                            child: Icon(Icons.close, size: 18, color: txt))),
                    const Spacer(),
                    Text('شارك رحلتك',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt))
                  ]),
                  const SizedBox(height: 12),
                  Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                          color: const Color(0xFFE3F0FF),
                          borderRadius: BorderRadius.circular(12)),
                      child: Row(children: [
                        Icon(Icons.send, color: navy),
                        const SizedBox(width: 10),
                        Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                              Text('القاهرة والجيزة - 4 أيام',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold, color: txt)),
                              const SizedBox(height: 2),
                              Text('أرسل رابط لخطة رحلتك',
                                  style: TextStyle(fontSize: 12, color: grey))
                            ]))
                      ])),
                  const SizedBox(height: 12),
                  Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                          color: bg, borderRadius: BorderRadius.circular(12)),
                      child: Text(link, style: TextStyle(color: txt))),
                  const SizedBox(height: 12),
                  SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('تم نسخ الرابط')));
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: navy,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14))),
                          child: const Text('نسخ الرابط',
                              style: TextStyle(fontWeight: FontWeight.bold))))
                ])));
  }

  void _showCancel() {
    final Color navy = const Color(0xFF1E88FF);
    final Color bg = const Color(0xFFEEF5FF);
    final Color txt = const Color(0xFF0A2A5E);
    final Color grey = const Color(0xFF8A9BB5);
    final Color lightBg = const Color(0xFFE3F0FF);
    showModalBottomSheet(
        context: context,
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
        builder: (_) => Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    InkWell(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                                color: bg,
                                borderRadius: BorderRadius.circular(20)),
                            child: Icon(Icons.close, size: 18, color: txt))),
                    const Spacer(),
                    Text('إلغاء الحجز',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt))
                  ]),
                  const SizedBox(height: 6),
                  Text('${data.type} - ${data.title}',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, color: txt)),
                  const SizedBox(height: 4),
                  Text('راجع سياسة الإلغاء والاسترداد قبل متابعة الطلب',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 12),
                  SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                            _showCancelPolicy();
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: lightBg,
                              foregroundColor: navy,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12))),
                          child: const Text('مراجعة سياسة الإلغاء',
                              style: TextStyle(fontWeight: FontWeight.bold)))),
                  const SizedBox(height: 10),
                  SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                            setState(() => data.isCancelled = true);
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14))),
                          child: const Text('تأكيد إلغاء الحجز',
                              style: TextStyle(fontWeight: FontWeight.bold)))),
                  const SizedBox(height: 8),
                  Center(
                      child: TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: Text('الاحتفاظ بالحجز',
                              style: TextStyle(
                                  color: grey, fontWeight: FontWeight.bold))))
                ])));
  }

  Widget _row(String label, String value, {bool bold = false}) => Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(children: [
        Expanded(
            child: Text(label,
                style:
                    const TextStyle(fontSize: 13, color: Color(0xFF8A9BB5)))),
        Text(value,
            style: TextStyle(
                fontWeight: bold ? FontWeight.bold : FontWeight.normal,
                color: const Color(0xFF0A2A5E)))
      ]));

  @override
  Widget build(BuildContext context) {
    final Color navy = const Color(0xFF1E88FF);
    final Color bg = const Color(0xFFEEF5FF);
    final Color card = Colors.white;
    final Color lightBg = const Color(0xFFE3F0FF);
    final Color border = const Color(0xFFD6E6FF);
    final Color txt = const Color(0xFF0A2A5E);
    final Color grey = const Color(0xFF8A9BB5);
    final statusText = data.isCancelled ? 'ملغي' : 'مؤكد';
    final titleText = data.isCancelled ? 'تفاصيل الحجز الملغي' : 'تفاصيل الحجز';
    return Directionality(
        textDirection: TextDirection.rtl,
        child: Scaffold(
            backgroundColor: bg,
            appBar: AppBar(
                backgroundColor: card,
                elevation: 0,
                leading: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.arrow_back_ios, size: 18, color: txt)),
                title: Row(children: [
                  Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                          color: navy, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.send,
                          color: Colors.white, size: 16)),
                  const SizedBox(width: 8),
                  Text('Travora',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: txt))
                ])),
            body: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(titleText,
                          style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: txt)),
                      const SizedBox(height: 4),
                      Text('معلومات الخدمة المحجوزة وحالة الطلب',
                          style: TextStyle(fontSize: 13, color: grey)),
                      const SizedBox(height: 16),
                      if (data.isCancelled)
                        Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                                color: const Color(0xFFFEEEEE),
                                borderRadius: BorderRadius.circular(12)),
                            child: Text('تم إلغاء الحجز',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red))),
                      if (data.isCancelled) const SizedBox(height: 16),
                      Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                              color: card,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: border)),
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: Image.network(
                                        'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80',
                                        height: 150,
                                        width: double.infinity,
                                        fit: BoxFit.cover)),
                                const SizedBox(height: 12),
                                Text('${data.type} - ${data.title}',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: txt)),
                                const SizedBox(height: 10),
                                _row('رقم الحجز', data.bookingId),
                                _row('حالة الحجز', statusText, bold: true),
                                _row('موعد الخدمة',
                                    '${data.dateText} - 10:30 ص'),
                                _row('المسافرون', data.fullName),
                                _row('تفاصيل الخدمة',
                                    '${data.type} - ${data.title}'),
                                _row('الإجمالي', data.priceText, bold: true),
                                _row('المدفوع', '${data.paid} ج.م', bold: true),
                                _row('حالة السداد', data.paymentStatus),
                                const SizedBox(height: 6),
                                Text(data.paymentNote,
                                    style: TextStyle(
                                        fontSize: 12,
                                        color: grey,
                                        height: 1.6)),
                                const SizedBox(height: 12),
                                SizedBox(
                                    width: double.infinity,
                                    height: 48,
                                    child: ElevatedButton(
                                        onPressed: () => Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (_) =>
                                                    TransportServiceBookingTicketScreen(
                                                        data: data))),
                                        style: ElevatedButton.styleFrom(
                                            backgroundColor: navy,
                                            foregroundColor: Colors.white,
                                            shape: RoundedRectangleBorder(
                                                borderRadius:
                                                    BorderRadius.circular(12))),
                                        child: const Text('عرض التذكرة',
                                            style: TextStyle(
                                                fontWeight: FontWeight.bold))))
                              ])),
                      const SizedBox(height: 16),
                      if (!data.isCancelled) ...[
                        SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                                onPressed: () => Navigator.pop(context),
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: lightBg,
                                    foregroundColor: navy,
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(12))),
                                child: const Text('تعديل الحجز',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold)))),
                        const SizedBox(height: 10),
                        SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                                onPressed: _showShare,
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: lightBg,
                                    foregroundColor: navy,
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(12))),
                                child: const Text('مشاركة الحجز',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold)))),
                        const SizedBox(height: 10),
                        SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                                onPressed: _showCancelPolicy,
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: lightBg,
                                    foregroundColor: navy,
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(12))),
                                child: const Text('سياسة الإلغاء',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold)))),
                        const SizedBox(height: 10),
                        SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                                onPressed: _showCancel,
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFFFEEEEE),
                                    foregroundColor: Colors.red,
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(12))),
                                child: const Text('إلغاء الحجز',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold))))
                      ],
                      if (data.isCancelled) ...[
                        Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                                color: lightBg,
                                borderRadius: BorderRadius.circular(12)),
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('راجع الشروط',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: txt)),
                                  const SizedBox(height: 4),
                                  Text(
                                      'تم الإلغاء وفق سياسة الإلغاء الموضحة في تفاصيل الحجز',
                                      style: TextStyle(
                                          fontSize: 13,
                                          color: grey,
                                          height: 1.6))
                                ])),
                        const SizedBox(height: 10),
                        SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                                onPressed: _showCancelPolicy,
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: lightBg,
                                    foregroundColor: navy,
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(12))),
                                child: const Text('سياسة الإلغاء',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold)))),
                        const SizedBox(height: 10),
                        SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: lightBg,
                                    foregroundColor: navy,
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(12))),
                                child: const Text('تواصل مع الدعم',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold)))),
                        const SizedBox(height: 10),
                        SizedBox(
                            width: double.infinity,
                            height: 52,
                            child: ElevatedButton(
                                onPressed: () => Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (_) =>
                                            const TransportScreen())),
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: navy,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(14))),
                                child: const Text('احجز إقامة جديدة',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold))))
                      ],
                      const SizedBox(height: 16),
                    ]))));
  }
}

// ---------- 8: التذكرة ----------
class TransportServiceBookingTicketScreen extends StatelessWidget {
  final TransportBookingData data;
  const TransportServiceBookingTicketScreen({super.key, required this.data});
  @override
  Widget build(BuildContext context) {
    final Color navy = const Color(0xFF1E88FF);
    final Color bg = const Color(0xFFEEF5FF);
    final Color card = Colors.white;
    final Color border = const Color(0xFFD6E6FF);
    final Color txt = const Color(0xFF0A2A5E);
    final Color grey = const Color(0xFF8A9BB5);
    return Directionality(
        textDirection: TextDirection.rtl,
        child: Scaffold(
            backgroundColor: bg,
            appBar: AppBar(
                backgroundColor: card,
                elevation: 0,
                leading: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.arrow_back_ios, size: 18, color: txt)),
                title: Row(children: [
                  Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                          color: navy, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.send,
                          color: Colors.white, size: 16)),
                  const SizedBox(width: 8),
                  Text('Travora',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: txt))
                ])),
            body: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                              color: const Color(0xFFE3F0FF),
                              borderRadius: BorderRadius.circular(12)),
                          child: Row(children: [
                            Icon(Icons.check_circle, color: navy),
                            const SizedBox(width: 8),
                            Expanded(
                                child: Text(data.paymentStatus,
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: txt))),
                            Text(data.bookingId,
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, color: navy))
                          ])),
                      const SizedBox(height: 16),
                      Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                              color: card,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: border)),
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: Image.network(
                                        'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80',
                                        height: 150,
                                        width: double.infinity,
                                        fit: BoxFit.cover)),
                                const SizedBox(height: 12),
                                Text(data.fullName,
                                    style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: txt)),
                                const SizedBox(height: 4),
                                Text('${data.type} - ${data.title}',
                                    style:
                                        TextStyle(fontSize: 14, color: grey)),
                                const SizedBox(height: 4),
                                Text('${data.dateText} - 10:30 ص - رحلة واحدة',
                                    style:
                                        TextStyle(fontSize: 13, color: grey)),
                                const SizedBox(height: 8),
                                Text(data.priceText,
                                    style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: navy)),
                                const SizedBox(height: 4),
                                Text('رقم الحجز: ${data.bookingId}',
                                    style: TextStyle(fontSize: 12, color: grey))
                              ])),
                      const SizedBox(height: 16),
                      SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                              onPressed: () => Navigator.pop(context),
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: navy,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14))),
                              child: const Text('العودة للحجز',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold))))
                    ]))));
  }
}

// ---------- 9: شروط الاستخدام ----------
class TransportServiceTermsScreen extends StatelessWidget {
  const TransportServiceTermsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final Color bg = const Color(0xFFEEF5FF);
    final Color txt = const Color(0xFF0A2A5E);
    final Color grey = const Color(0xFF8A9BB5);
    return Directionality(
        textDirection: TextDirection.rtl,
        child: Scaffold(
            backgroundColor: bg,
            appBar: AppBar(
                backgroundColor: Colors.white,
                elevation: 0,
                leading: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.arrow_back_ios, size: 18, color: txt)),
                title: Text('شروط الاستخدام',
                    style: TextStyle(fontWeight: FontWeight.bold, color: txt))),
            body: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('شروط الاستخدام',
                          style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: txt)),
                      const SizedBox(height: 6),
                      Text('تعرّف على شروط استخدام Travora قبل تأكيد الحجز',
                          style: TextStyle(fontSize: 13, color: grey)),
                      const SizedBox(height: 16),
                      Text('استخدام الحساب',
                          style: TextStyle(
                              fontWeight: FontWeight.bold, color: txt)),
                      const SizedBox(height: 6),
                      Text(
                          'باستخدامك للتطبيق أنت توافق على تقديم بيانات صحيحة لإتمام الحجز والتواصل معك بخصوص رحلتك.',
                          style: TextStyle(
                              fontSize: 13, color: grey, height: 1.7)),
                      const SizedBox(height: 12),
                      Text('الحجز والدفع',
                          style: TextStyle(
                              fontWeight: FontWeight.bold, color: txt)),
                      const SizedBox(height: 6),
                      Text(
                          'يتم تأكيد الحجز بعد مراجعة البيانات واختيار طريقة الدفع. في حالة الدفع لاحقاً لا يتم خصم أي مبلغ الآن.',
                          style:
                              TextStyle(fontSize: 13, color: grey, height: 1.7))
                    ]))));
  }
}

// ==================== PAYMENT FAILED SCREEN ====================
// شاشة تعذر الدفع الإلكتروني - تعيد المستخدم إلى صفحة إكمال الحجز
// مع نتيجة اختيار طريقة الدفع الجديدة عند الحاجة.
class PaymentFailedScreen extends StatelessWidget {
  final String bookingTitle;
  final String bookingSubtitle;

  const PaymentFailedScreen({
    super.key,
    this.bookingTitle = 'إقامة فاخرة على ضفاف النيل',
    this.bookingSubtitle = 'طلبك محفوظ للمراجعة',
  });

  @override
  Widget build(BuildContext context) {
    const Color navy = Color(0xFF1E88FF);
    const Color bg = Color(0xFFEEF5FF);
    const Color card = Colors.white;
    const Color lightBg = Color(0xFFE3F0FF);
    const Color border = Color(0xFFD6E6FF);
    const Color txt = Color(0xFF0A2A5E);
    const Color grey = Color(0xFF8A9BB5);

    void backToBooking({String? paymentMethod}) {
      Navigator.pop(context, paymentMethod);
    }

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: bg,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'لم تكتمل عملية الدفع',
                style: TextStyle(
                    fontSize: 24, fontWeight: FontWeight.bold, color: txt),
              ),
              const SizedBox(height: 4),
              const Text(
                'يمكنك المحاولة مجدداً أو تغيير طريقة الدفع',
                style: TextStyle(fontSize: 13, color: grey),
              ),
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: card,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                          color: lightBg,
                          borderRadius: BorderRadius.circular(12)),
                      child: const Icon(Icons.account_balance_wallet_outlined,
                          color: navy, size: 28),
                    ),
                    const SizedBox(height: 12),
                    const Text('تعذر تأكيد الدفع',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt)),
                    const SizedBox(height: 6),
                    const Text(
                      'لم يصدر تأكيد لهذا الطلب بعد. راجع بيانات الدفع أو اختر طريقة أخرى ثم حاول إتمام الحجز.',
                      style: TextStyle(fontSize: 13, color: grey, height: 1.7),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: lightBg, borderRadius: BorderRadius.circular(12)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('طلبك محفوظ للمراجعة',
                        style:
                            TextStyle(fontWeight: FontWeight.bold, color: txt)),
                    const SizedBox(height: 2),
                    Text(bookingTitle,
                        style: const TextStyle(fontSize: 13, color: grey)),
                    if (bookingSubtitle.isNotEmpty)
                      Text(bookingSubtitle,
                          style: const TextStyle(fontSize: 12, color: grey)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => backToBooking(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: navy,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('راجع البطاقة وحاول مجدداً',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () =>
                      backToBooking(paymentMethod: 'محفظة إلكترونية'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: lightBg,
                    foregroundColor: navy,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('الدفع بمحفظة إلكترونية',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () =>
                      backToBooking(paymentMethod: 'الدفع عند الوصول'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: lightBg,
                    foregroundColor: navy,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('اختيار الدفع عند الوصول',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: TextButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const SupportScreen()),
                  ),
                  child: const Text('مساعدة من الدعم',
                      style: TextStyle(
                          color: navy,
                          fontWeight: FontWeight.bold,
                          fontSize: 14)),
                ),
              ),
              const SizedBox(height: 8),
              InkWell(
                onTap: () =>
                    Navigator.popUntil(context, (route) => route.isFirst),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: card,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: border),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.arrow_back, size: 18, color: grey),
                      SizedBox(width: 8),
                      Expanded(
                          child: Text('العودة إلى الغرف',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, color: txt))),
                      Text('راجع الاختيارات قبل الدفع',
                          style: TextStyle(fontSize: 12, color: grey)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}