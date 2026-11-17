import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/hotels/rooms_screen.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/trips/live_trip_replanned_screen.dart';
import 'package:my_app/features/trips/share_trip_sheet.dart';

class PaymentSuccessScreen extends StatelessWidget {
  final BookingData booking;
  const PaymentSuccessScreen({super.key, required this.booking});

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
            const Text('حجزك مؤكد',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('رحلة جميلة تنتظرك',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(children: [
                Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                        color: const Color(0xFFE8F5E9),
                        borderRadius: BorderRadius.circular(50)),
                    child: const Icon(Icons.check,
                        color: Color(0xFF2E7D32), size: 30)),
                const SizedBox(height: 12),
                const Text('تم الحجز بنجاح',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                const SizedBox(height: 6),
                Text(
                    'أرسلنا تفاصيل الحجز إلى بريدك ${booking.email}\nيمكن عرض التذكرة في أي وقت',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                        fontSize: 13, color: greyText, height: 1.6)),
                const SizedBox(height: 8),
                Text(booking.bookingRef,
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
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(booking.image,
                            height: 170,
                            width: double.infinity,
                            fit: BoxFit.cover)),
                    const SizedBox(height: 12),
                    Text(booking.title,
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 4),
                    Text(
                        '${booking.dateRange} • ${booking.nights} ليالي • ${booking.travelers} مسافران',
                        style: const TextStyle(fontSize: 13, color: greyText)),
                  ]),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(children: [
                _bRow('المدفوع', '${booking.paidAmount} ج.م'),
                const SizedBox(height: 10),
                _bRow('حالة السداد', booking.paymentStatus,
                    valueColor: booking.isPaid
                        ? const Color(0xFF2E7D32)
                        : const Color(0xFFFF8F00)),
                const SizedBox(height: 10),
                _bRow('حالة الحجز', booking.bookingStatus,
                    valueColor: const Color(0xFF2E7D32)),
                if (!booking.isPaid) ...[
                  const SizedBox(height: 10),
                  _bRow('المستحق عند الوصول', '${booking.dueAmount} ج.م',
                      valueColor: navy),
                ],
              ]),
            ),
            const SizedBox(height: 16),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) =>
                                BookingDetailsScreen(booking: booking))),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('عرض تفاصيل الحجز'))),
            const SizedBox(height: 10),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => TicketScreen(booking: booking))),
                    style: OutlinedButton.styleFrom(
                        foregroundColor: navy,
                        side: const BorderSide(color: lightBorder),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('عرض التذكرة'))),
            const SizedBox(height: 10),
            Center(
                child: TextButton(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const LiveTripReplannedScreen(
                                destination: 'القاهرة',
                                date: '15 مارس 2027',
                                budget: 1500,
                                spent: 880))),
                    child: const Text('الانتقال إلى رحلاتي',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _bRow(String l, String v, {Color? valueColor}) => Row(children: [
        Text(l, style: const TextStyle(fontSize: 13, color: greyText)),
        const Spacer(),
        Expanded(
            child: Text(v,
                textAlign: TextAlign.end,
                style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: valueColor ?? textColor)))
      ]);
}

// ==================== 2 - صفحة تفاصيل الحجز - النسخة الكاملة ====================

class BookingDetailsScreen extends StatefulWidget {
  final BookingData booking;
  const BookingDetailsScreen({super.key, required this.booking});
  @override
  State<BookingDetailsScreen> createState() => _BookingDetailsScreenState();
}

class _BookingDetailsScreenState extends State<BookingDetailsScreen> {
  late BookingData b;
  late String status;
  int selectedDay = 15;

  @override
  void initState() {
    super.initState();
    b = widget.booking;
    status = b.bookingStatus;
  }

  // سياسة الإلغاء الموجودة عندك أصلاً
  void _showCancelPolicy() => showTravoraCancellationPolicy(context);

  // ===== شيت تعديل حجزك =====
  void _showEditSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
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
                          color: lightBlueBg,
                          borderRadius: BorderRadius.circular(20)),
                      child:
                          const Icon(Icons.close, size: 16, color: greyText))),
              const Spacer(),
              const Text('تعديل حجزك',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
            ]),
            const SizedBox(height: 8),
            const Text('اختر ما تريد تغييره ثم راجع السعر والشروط',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            _editOption('تغيير تواريخ الإقامة', () {
              Navigator.pop(context);
              _showDatePicker();
            }),
            _editOption('اختيار غرفة أخرى', () {
              Navigator.pop(context);
              _showChangeRoom();
            }),
            // صفحة الدعم الموجودة عندك - من غير باراميتر
            _editOption('مساعدة في تعديل الحجز', () {
              Navigator.pop(context);
              Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const SupportScreen()));
            }),
            const SizedBox(height: 8),
            Center(
                child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('العودة للحجز',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
          ],
        ),
      ),
    );
  }

  Widget _editOption(String label, VoidCallback onTap) => InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
                color: lightBlueBg, borderRadius: BorderRadius.circular(12)),
            child: Text(label,
                textAlign: TextAlign.center,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, color: navy))),
      );

  // ===== تغيير التاريخ - بيسمع فوق في التفاصيل =====
  void _showDatePicker() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(
        builder: (ctx, setSheet) => Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
              color: whiteCard,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(children: [
                InkWell(
                    onTap: () => Navigator.pop(ctx),
                    child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.close,
                            size: 16, color: greyText))),
                const Spacer(),
                const Text('تاريخ السفر',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ]),
              const SizedBox(height: 8),
              const Text('مارس 2027',
                  style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              const Text('اختر تاريخ الوصول لتحديد موعد إقامتك',
                  style: TextStyle(fontSize: 12, color: greyText)),
              const SizedBox(height: 14),
              Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: const [
                    Text('س', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('ح', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('خ', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('أ', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('ث', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('ا', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('ج', style: TextStyle(color: greyText, fontSize: 12))
                  ]),
              const SizedBox(height: 8),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7),
                itemCount: 31,
                itemBuilder: (_, i) {
                  final day = i + 1;
                  final sel = day == selectedDay;
                  return InkWell(
                    onTap: () => setSheet(() => selectedDay = day),
                    child: Container(
                        margin: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                            color: sel ? navy : Colors.transparent,
                            borderRadius: BorderRadius.circular(20)),
                        child: Center(
                            child: Text('$day',
                                style: TextStyle(
                                    color: sel ? Colors.white : textColor,
                                    fontWeight: sel
                                        ? FontWeight.bold
                                        : FontWeight.normal)))),
                  );
                },
              ),
              const SizedBox(height: 14),
              Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                      color: lightBlueBg,
                      borderRadius: BorderRadius.circular(12)),
                  child: Text(
                      'الموعد المختار\n$selectedDay مارس 2027 - يمكنك التعديل في أي وقت',
                      style: const TextStyle(
                          fontSize: 12, color: textColor, height: 1.5))),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    final newRange =
                        '$selectedDay - ${selectedDay + b.nights} مارس 2027';
                    setState(() => b = b.copyWith(dateRange: newRange));
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text('تم تغيير التاريخ إلى $newRange')));
                  },
                  style: ElevatedButton.styleFrom(
                      backgroundColor: navy,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14))),
                  child: const Text('تأكيد التاريخ'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ===== اختيار غرفة أخرى =====
  void _showChangeRoom() {
    final rooms = [
      RoomItem(
          title: 'ديلوكس - سرير كبير',
          image: room1Image,
          size: '42 م²',
          bed: 'سرير كبير',
          view: 'إطلالة على النيل',
          facilities: 'إفطار شامل • واي فاي',
          pricePerNight: 6800),
      RoomItem(
          title: 'ديلوكس - سريران منفصلان',
          image: room2Image,
          size: '42 م²',
          bed: 'سريران منفصلان',
          view: 'إطلالة على النيل',
          facilities: 'إفطار شامل • واي فاي',
          pricePerNight: 6800),
      RoomItem(
          title: 'جناح تنفيذي مع شرفة',
          image: room3Image,
          size: '65 م²',
          bed: 'غرفة نوم وصالة',
          view: 'شرفة خاصة',
          facilities: 'إفطار شامل • واي فاي',
          pricePerNight: 9200),
    ];
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
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
                          color: lightBlueBg,
                          borderRadius: BorderRadius.circular(20)),
                      child:
                          const Icon(Icons.close, size: 16, color: greyText))),
              const Spacer(),
              const Text('اختر غرفتك',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
            ]),
            const SizedBox(height: 8),
            Text('${b.dateRange} • ${b.nights} ليالي • ${b.travelers} مسافران',
                style: const TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            ...rooms.map((room) => InkWell(
                  onTap: () {
                    setState(() => b = b.copyWith(
                          title: room.title == 'ديلوكس - سرير كبير'
                              ? 'إقامة فاخرة على ضفاف النيل'
                              : room.title,
                          subTitle: '${room.title} • إفطار شامل',
                          image: room.image,
                          pricePerNight: room.pricePerNight,
                        ));
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text(
                            'تم تغيير الغرفة إلى ${room.title} - الإجمالي الجديد ${room.pricePerNight * b.nights} ج.م')));
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                        color: lightBlueBg,
                        borderRadius: BorderRadius.circular(14)),
                    child: Row(children: [
                      ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.network(room.image,
                              width: 70, height: 70, fit: BoxFit.cover)),
                      const SizedBox(width: 12),
                      Expanded(
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                            Text(room.title,
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: textColor)),
                            const SizedBox(height: 4),
                            Text('${room.pricePerNight} ج.م / ليلة',
                                style: const TextStyle(
                                    color: navy, fontWeight: FontWeight.bold))
                          ])),
                    ]),
                  ),
                )),
          ],
        ),
      ),
    );
  }

  // ===== مشاركة الحجز - الشيت الموجود عندك أصلاً =====
  void _share() =>
      showShareTripSheet(context, destination: 'القاهرة والجيزة', duration: 4);

  // ===== شيت إلغاء الحجز =====
  void _showCancelSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
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
                          color: lightBlueBg,
                          borderRadius: BorderRadius.circular(20)),
                      child:
                          const Icon(Icons.close, size: 16, color: greyText))),
              const Spacer(),
              const Text('إلغاء الحجز؟',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
            ]),
            const SizedBox(height: 12),
            Text(b.title,
                style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 6),
            const Text('راجع سياسة الإلغاء والاسترداد قبل متابعة الطلب',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      _showCancelPolicy();
                    },
                    style: OutlinedButton.styleFrom(
                        foregroundColor: navy,
                        side: const BorderSide(color: lightBorder),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12))),
                    child: const Text('مراجعة سياسة الإلغاء'))),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) =>
                              CancelledBookingDetailsScreen(booking: b)));
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFC62828),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14))),
                child: const Text('تأكيد إلغاء الحجز'),
              ),
            ),
            const SizedBox(height: 10),
            Center(
                child: TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('تم الاحتفاظ بالحجز')));
                    },
                    child: const Text('الاحتفاظ بالحجز',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
            const SizedBox(height: 12),
            const Text('تفاصيل الحجز',
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 8),
            _dRow('موعد الخدمة', '${b.dateRange} • ${b.nights} ليالي'),
            _dRow('إجمالي الحجز', '${b.total} ج.م'),
            _dRow('المدفوع', '${b.paidAmount} ج.م'),
          ],
        ),
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
          padding: const EdgeInsets.all(16),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('تفاصيل الحجز',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('معلومات الخدمة المحجوزة وحالة الطلب',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(b.image,
                            height: 170,
                            width: double.infinity,
                            fit: BoxFit.cover)),
                    const SizedBox(height: 12),
                    Text(b.title,
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 10),
                    _dRow('رقم الحجز', b.bookingRef),
                    _dRow('الحالة', status, isStatus: true),
                    _dRow('موعد الخدمة', '${b.dateRange} • ${b.nights} ليالي'),
                    _dRow(
                        'المسافرون', '${b.travelers} مسافران • ${b.guestName}'),
                    const Divider(height: 24),
                    const Text('تفاصيل الخدمة',
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 6),
                    Text(b.subTitle,
                        style: const TextStyle(fontSize: 13, color: textColor)),
                    const SizedBox(height: 10),
                    _dRow('الإجمالي', '${b.total} ج.م'),
                    _dRow('المدفوع', '${b.paidAmount} ج.م'),
                    _dRow('حالة السداد', b.paymentStatus),
                    if (!b.isPaid)
                      _dRow('المستحق عند الوصول', '${b.dueAmount} ج.م'),
                  ]),
            ),
            const SizedBox(height: 16),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => TicketScreen(booking: b))),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('عرض التذكرة'))),
            const SizedBox(height: 10),
            Row(children: [
              Expanded(
                  child: OutlinedButton(
                      onPressed: _showEditSheet,
                      style: OutlinedButton.styleFrom(
                          foregroundColor: navy,
                          side: const BorderSide(color: lightBorder),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12))),
                      child: const Text('تعديل الحجز'))),
              const SizedBox(width: 10),
              Expanded(
                  child: OutlinedButton(
                      onPressed: _share,
                      style: OutlinedButton.styleFrom(
                          foregroundColor: navy,
                          side: const BorderSide(color: lightBorder),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12))),
                      child: const Text('مشاركة الحجز'))),
            ]),
            const SizedBox(height: 10),
            SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                    onPressed: _showCancelSheet,
                    style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFFC62828),
                        side: const BorderSide(color: Color(0xFFFFCDD2)),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12))),
                    child: const Text('إلغاء الحجز'))),
            const SizedBox(height: 10),
            Center(
                child: TextButton(
                    onPressed: _showCancelPolicy,
                    child: const Text('سياسة الإلغاء',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _dRow(String l, String v, {bool isStatus = false}) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Row(children: [
          Text(l, style: const TextStyle(fontSize: 13, color: greyText)),
          const Spacer(),
          Expanded(
              child: Text(v,
                  textAlign: TextAlign.end,
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: isStatus ? const Color(0xFF2E7D32) : textColor))),
        ]),
      );
}

// ==================== صفحة تفاصيل الحجز الملغي - جديدة ====================

class CancelledBookingDetailsScreen extends StatelessWidget {
  final BookingData booking;
  const CancelledBookingDetailsScreen({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final b = booking;
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('تفاصيل الحجز الملغي',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('معلومات الخدمة المحجوزة وحالة الطلب',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(b.image,
                            height: 170,
                            width: double.infinity,
                            fit: BoxFit.cover)),
                    const SizedBox(height: 12),
                    Text(b.title,
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 10),
                    _cRow('رقم الحجز', b.bookingRef),
                    _cRow('الحالة', 'ملغي', isRed: true),
                    _cRow('موعد الخدمة', '${b.dateRange} • ${b.nights} ليالي'),
                    _cRow(
                        'المسافرون', '${b.travelers} مسافران • ${b.guestName}'),
                    const Divider(height: 24),
                    const Text('تفاصيل الخدمة',
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 6),
                    Text(b.subTitle,
                        style: const TextStyle(fontSize: 13, color: textColor)),
                    const SizedBox(height: 10),
                    _cRow('الإجمالي', '${b.total} ج.م'),
                    _cRow('المدفوع', '${b.paidAmount} ج.م'),
                    _cRow('حالة السداد', 'راجع شروط الإلغاء'),
                  ]),
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: const Color(0xFFFFEBEE),
                  borderRadius: BorderRadius.circular(16)),
              child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('تم إلغاء الحجز',
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFC62828))),
                    SizedBox(height: 6),
                    Text(
                        'يراجع الاسترداد وفق شروط الخدمة وحالة الدفع\nسياسة الإلغاء',
                        style: TextStyle(
                            fontSize: 13, color: textColor, height: 1.6)),
                  ]),
            ),
            const SizedBox(height: 10),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: lightBlueBg, borderRadius: BorderRadius.circular(16)),
              child: const Text(
                  'تم إلغاء الحجز\nإرجاع الاسترداد وفق شروط الخدمة وحالة الدفع',
                  style:
                      TextStyle(fontSize: 13, color: textColor, height: 1.6)),
            ),
            const SizedBox(height: 16),
            SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                    onPressed: () => showTravoraCancellationPolicy(context),
                    style: OutlinedButton.styleFrom(
                        foregroundColor: navy,
                        side: const BorderSide(color: lightBorder),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12))),
                    child: const Text('سياسة الإلغاء'))),
            const SizedBox(height: 10),
            SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const SupportScreen())),
                    style: OutlinedButton.styleFrom(
                        foregroundColor: navy,
                        side: const BorderSide(color: lightBorder),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12))),
                    child: const Text('تواصل مع الدعم'))),
            const SizedBox(height: 10),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const RoomsScreen(
                                checkInText: '15 مارس 2027',
                                nights: 3,
                                travelersLabel: '2 بالغين • غرفة واحدة'))),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('احجز إقامة جديدة'))),
          ]),
        ),
      ),
    );
  }

  Widget _cRow(String l, String v, {bool isRed = false}) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Row(children: [
          Text(l, style: const TextStyle(fontSize: 13, color: greyText)),
          const Spacer(),
          Expanded(
              child: Text(v,
                  textAlign: TextAlign.end,
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: isRed ? const Color(0xFFC62828) : textColor))),
        ]),
      );
}

// ==================== 3 - صفحة التذكرة ====================

class TicketScreen extends StatelessWidget {
  final BookingData booking;
  const TicketScreen({super.key, required this.booking});

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
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                              color: const Color(0xFFE8F5E9),
                              borderRadius: BorderRadius.circular(20)),
                          child: Text(booking.bookingStatus,
                              style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF2E7D32)))),
                      const Spacer(),
                      const Text('تذكرة نموذجية للمعاينة',
                          style: TextStyle(fontSize: 12, color: greyText))
                    ]),
                    const SizedBox(height: 14),
                    ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(booking.image,
                            height: 170,
                            width: double.infinity,
                            fit: BoxFit.cover)),
                    const SizedBox(height: 14),
                    Text(booking.guestName,
                        style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 6),
                    Text(booking.title,
                        style: const TextStyle(fontSize: 14, color: textColor)),
                    const SizedBox(height: 4),
                    Text(
                        '${booking.dateRange} • ${booking.nights} ليالي • ${booking.travelers} مسافران',
                        style: const TextStyle(fontSize: 13, color: greyText)),
                    const SizedBox(height: 10),
                    Row(children: [
                      Text('${booking.total} ج.م',
                          style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: navy)),
                      const Spacer(),
                      Text('رقم الحجز: ${booking.bookingRef}',
                          style: const TextStyle(fontSize: 12, color: greyText))
                    ]),
                    const SizedBox(height: 6),
                    Row(children: [
                      Text('المدفوع: ${booking.paidAmount} ج.م',
                          style:
                              const TextStyle(fontSize: 13, color: greyText)),
                      const Spacer(),
                      Text(booking.paymentStatus,
                          style: const TextStyle(fontSize: 12, color: greyText))
                    ]),
                    const SizedBox(height: 12),
                    SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                            onPressed: () => ScaffoldMessenger.of(context)
                                .showSnackBar(SnackBar(
                                    content: Text(
                                        'مرجع الحجز: ${booking.bookingRef}'))),
                            style: OutlinedButton.styleFrom(
                                foregroundColor: navy,
                                side: const BorderSide(color: lightBorder),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12))),
                            child: const Text('عرض مرجع الحجز'))),
                  ]),
            ),
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
                    child: const Text('العودة للحجز'))),
            const SizedBox(height: 10),
            Center(
                child: TextButton(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const LiveTripReplannedScreen(
                                destination: 'القاهرة',
                                date: '15 مارس 2027',
                                budget: 1500,
                                spent: 880))),
                    child: const Text('الانتقال إلى رحلاتي',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }
}

// ==================== HOTEL CHECKOUT - أكمل حجزك (فندق) ====================
