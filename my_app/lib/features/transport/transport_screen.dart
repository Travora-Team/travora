import 'package:flutter/material.dart';
import 'package:my_app/features/transport/transport_booking_screen.dart';

class TransportScreen extends StatefulWidget {
  const TransportScreen({super.key});
  @override
  State<TransportScreen> createState() => _TransportScreenState();
}

class _TransportScreenState extends State<TransportScreen> {
  final Color navy = const Color(0xFF1E88FF);
  final Color bg = const Color(0xFFEEF5FF);
  final Color card = Colors.white;
  final Color lightBg = const Color(0xFFE3F0FF);
  final Color border = const Color(0xFFD6E6FF);
  final Color txt = const Color(0xFF0A2A5E);
  final Color grey = const Color(0xFF8A9BB5);

  String transportType = 'سيارة مع سائق';
  String fromCity = 'القاهرة مصر';
  String toCity = 'القاهرة مصر';
  String dateText = '15 مارس 2027';
  int selectedDay = 15;

  final List<String> cities = [
    'القاهرة مصر',
    'الجيزة مصر',
    'القاهرة القديمة مصر',
    'الأقصر مصر',
    'شرم الشيخ مصر',
  ];

  final List<String> transportTypes = [
    'سيارة مع سائق',
    'سيارة خاصة',
    'وسائل عامة',
  ];

  void _pickTransportType() {
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
            Row(
              children: [
                InkWell(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                            color: bg, borderRadius: BorderRadius.circular(20)),
                        child: Icon(Icons.close, size: 18, color: txt))),
                const Spacer(),
                Text('وسيلة التنقل',
                    style: TextStyle(
                        fontSize: 17, fontWeight: FontWeight.bold, color: txt)),
              ],
            ),
            const SizedBox(height: 6),
            Text('اختر طريقة التنقل بين أماكن الرحلة',
                style: TextStyle(fontSize: 13, color: grey)),
            const SizedBox(height: 14),
            ...transportTypes.map((t) => Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() => transportType = t);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                        backgroundColor: transportType == t ? navy : lightBg,
                        foregroundColor:
                            transportType == t ? Colors.white : txt,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 14)),
                    child: Text(t,
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                )),
          ],
        ),
      ),
    );
  }

  void _pickCity(String title, String current, ValueChanged<String> onPick) {
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
            Row(
              children: [
                InkWell(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                            color: bg, borderRadius: BorderRadius.circular(20)),
                        child: Icon(Icons.close, size: 18, color: txt))),
                const Spacer(),
                Text(title,
                    style: TextStyle(
                        fontSize: 17, fontWeight: FontWeight.bold, color: txt)),
              ],
            ),
            const SizedBox(height: 6),
            Text('اختر المدينة التي تبدأ منها رحلتك',
                style: TextStyle(fontSize: 13, color: grey)),
            const SizedBox(height: 14),
            ...cities.map((c) => Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ElevatedButton(
                    onPressed: () {
                      onPick(c);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                        backgroundColor: current == c ? navy : lightBg,
                        foregroundColor: current == c ? Colors.white : txt,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 14)),
                    child: Text(c,
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                )),
          ],
        ),
      ),
    );
  }

  void _pickDate() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (_) => StatefulBuilder(
        builder: (ctx, setSheet) => Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  InkWell(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                              color: bg,
                              borderRadius: BorderRadius.circular(20)),
                          child: Icon(Icons.close, size: 18, color: txt))),
                  const Spacer(),
                  Text('تاريخ السفر',
                      style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: txt)),
                ],
              ),
              const SizedBox(height: 6),
              Text('اختر تاريخ الرحلة من الكالندر',
                  style: TextStyle(fontSize: 13, color: grey)),
              const SizedBox(height: 12),
              Center(
                  child: Text('مارس 2027',
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: txt))),
              const SizedBox(height: 12),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7),
                itemCount: 31,
                itemBuilder: (_, i) {
                  final day = i + 1;
                  final isSel = selectedDay == day;
                  return InkWell(
                    onTap: () {
                      setSheet(() => selectedDay = day);
                      setState(() => dateText = '$day مارس 2027');
                      Navigator.pop(context);
                    },
                    child: Container(
                        margin: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                            color: isSel ? navy : Colors.transparent,
                            borderRadius: BorderRadius.circular(10)),
                        child: Center(
                            child: Text('$day',
                                style: TextStyle(
                                    color: isSel ? Colors.white : txt,
                                    fontWeight: FontWeight.bold)))),
                  );
                },
              ),
              const SizedBox(height: 10),
              Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                      color: lightBg, borderRadius: BorderRadius.circular(12)),
                  child: Text('الموعد المختار: $dateText',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: txt))),
              const SizedBox(height: 4),
              Text('يمكنك اختيار أي يوم من الكالندر',
                  style: TextStyle(fontSize: 12, color: grey)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(String label, String value, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
            color: card,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: border)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: TextStyle(fontSize: 12, color: grey)),
          const SizedBox(height: 2),
          Text(value,
              style: TextStyle(fontWeight: FontWeight.bold, color: txt)),
        ]),
      ),
    );
  }

  Widget _carCard({
    required String title,
    required String details,
    required String price,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: card,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                      color: lightBg, borderRadius: BorderRadius.circular(12)),
                  child: Icon(Icons.send, color: navy, size: 22)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title,
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: txt)),
                      const SizedBox(height: 4),
                      Text(details,
                          style: TextStyle(
                              fontSize: 12, color: grey, height: 1.6)),
                    ]),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(price,
              style: TextStyle(
                  fontSize: 18, fontWeight: FontWeight.bold, color: navy)),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: () => showTransportReviewSheet(
                context,
                title: title,
                type: transportType,
                price: price,
                dateText: dateText,
              ),
              style: ElevatedButton.styleFrom(
                  backgroundColor: navy,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12))),
              child: const Text('اختر هذا الانتقال',
                  style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: bg,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('تنقل على طريقتك',
                  style: TextStyle(
                      fontSize: 24, fontWeight: FontWeight.bold, color: txt)),
              const SizedBox(height: 4),
              Text('من الوصول إلى المطار حتى آخر جولة',
                  style: TextStyle(fontSize: 13, color: grey)),
              const SizedBox(height: 16),
              _field('نوع الانتقال', transportType, _pickTransportType),
              const SizedBox(height: 12),
              _field(
                  'الانطلاق',
                  fromCity,
                  () => _pickCity('اختر وجهتك', fromCity,
                      (v) => setState(() => fromCity = v))),
              const SizedBox(height: 12),
              _field(
                  'الوصول',
                  toCity,
                  () => _pickCity(
                      'اختر وجهتك', toCity, (v) => setState(() => toCity = v))),
              const SizedBox(height: 12),
              _field('الموعد والمسافرون', dateText, _pickDate),
              const SizedBox(height: 22),
              Text('اختر سيارتك',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold, color: txt)),
              const SizedBox(height: 4),
              Text('الأسعار تشمل الانتقال المعروض في هذه النسخة التجريبية',
                  style: TextStyle(fontSize: 13, color: grey)),
              const SizedBox(height: 12),
              _carCard(
                title: 'سيارة مريحة',
                details: '3 ركاب - حقيبتين - تكييف - سائق خاص',
                price: '850 ج.م',
              ),
              const SizedBox(height: 12),
              _carCard(
                title: 'سيارة عائلية',
                details: '6 ركاب - 4 حقائب - مساحة أكبر',
                price: '1,250 ج.م',
              ),
              const SizedBox(height: 12),
              _carCard(
                title: 'استقبال من المطار',
                details: 'انتظار عند الوصول - 45 دقيقة',
                price: '650 ج.م',
              ),
              const SizedBox(height: 22),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: lightBg, borderRadius: BorderRadius.circular(14)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('راجع نقطة الالتقاء',
                        style:
                            TextStyle(fontWeight: FontWeight.bold, color: txt)),
                    const SizedBox(height: 4),
                    Text(
                        'ستظهر تفاصيل السائق ونقطة اللقاء داخل تأكيد الانتقال بعد الحجز',
                        style:
                            TextStyle(fontSize: 13, color: grey, height: 1.6)),
                  ],
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

// ================= صفحة عن Travora =================
