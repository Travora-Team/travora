import 'package:flutter/material.dart';
import 'package:my_app/features/hotels/hotel_detail_screen.dart';
import 'package:my_app/features/hotels/hotels_screen.dart';
import 'package:my_app/features/support/support_screen.dart';

class HotelsSearchScreen extends StatefulWidget {
  const HotelsSearchScreen({super.key});
  @override
  State<HotelsSearchScreen> createState() => _HotelsSearchScreenState();
}

class _HotelsSearchScreenState extends State<HotelsSearchScreen> {
  final Color navy = const Color(0xFF1E88FF);
  final Color bg = const Color(0xFFEEF5FF);
  final Color card = Colors.white;
  final Color lightBg = const Color(0xFFE3F0FF);
  final Color border = const Color(0xFFD6E6FF);
  final Color txt = const Color(0xFF0A2A5E);
  final Color grey = const Color(0xFF8A9BB5);

  String destination = 'القاهرة مصر';
  String dateText = '15 مارس 2027';
  int selectedDay = 15;
  String guestsText = '2 بالغين - غرفة واحدة';
  String sortBy = 'الأكثر طلبا';
  bool filterActive = true;
  bool isFav = false;

  final List<String> destinations = [
    'القاهرة مصر',
    'الجيزة مصر',
    'القاهرة القديمة مصر',
    'الأقصر مصر',
    'شرم الشيخ مصر'
  ];
  final List<String> guestsOptions = [
    '1 بالغ - غرفة واحدة',
    '2 بالغين - غرفة واحدة',
    '2 بالغين + طفل - غرفة واحدة',
    '4 بالغين - غرفتين'
  ];
  final List<String> sortOptions = [
    'الأكثر طلبا',
    'السعر من الأقل للأعلى',
    'الأعلى تقييما'
  ];

  void _pickDestination() {
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
                    Text('اختر وجهتك',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt))
                  ]),
                  const SizedBox(height: 6),
                  Text('اختر المدينة التي تبدأ منها رحلتك',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 14),
                  ...destinations.map((d) => Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ElevatedButton(
                          onPressed: () {
                            setState(() => destination = d);
                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor:
                                  destination == d ? navy : lightBg,
                              foregroundColor:
                                  destination == d ? Colors.white : txt,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14)),
                          child: Text(d,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold)))))
                ])));
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
                      Row(children: [
                        InkWell(
                            onTap: () => Navigator.pop(context),
                            child: Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                    color: bg,
                                    borderRadius: BorderRadius.circular(20)),
                                child:
                                    Icon(Icons.close, size: 18, color: txt))),
                        const Spacer(),
                        Text('تاريخ السفر',
                            style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                                color: txt))
                      ]),
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
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
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
                                        color:
                                            isSel ? navy : Colors.transparent,
                                        borderRadius:
                                            BorderRadius.circular(10)),
                                    child: Center(
                                        child: Text('$day',
                                            style: TextStyle(
                                                color:
                                                    isSel ? Colors.white : txt,
                                                fontWeight:
                                                    FontWeight.bold)))));
                          }),
                      const SizedBox(height: 10),
                      Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                              color: lightBg,
                              borderRadius: BorderRadius.circular(12)),
                          child: Text('الموعد المختار: $dateText',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: txt))),
                      const SizedBox(height: 4),
                      Text('يمكنك اختيار أي يوم من الكالندر',
                          style: TextStyle(fontSize: 12, color: grey))
                    ]))));
  }

  void _pickGuests() {
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
                    Text('المسافرون والغرف',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt))
                  ]),
                  const SizedBox(height: 6),
                  Text('كم شخصا يسافر معك؟',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 14),
                  ...guestsOptions.map((g) => Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ElevatedButton(
                          onPressed: () {
                            setState(() => guestsText = g);
                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: guestsText == g ? navy : lightBg,
                              foregroundColor:
                                  guestsText == g ? Colors.white : txt,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14)),
                          child: Text(g,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold)))))
                ])));
  }

  void _pickSort() {
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
                    Text('ترتيب النتائج',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt))
                  ]),
                  const SizedBox(height: 6),
                  Text('ما الذي تريد أن يظهر أولا؟',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 14),
                  ...sortOptions.map((o) => Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ElevatedButton(
                          onPressed: () {
                            setState(() => sortBy = o);
                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: sortBy == o ? navy : lightBg,
                              foregroundColor: sortBy == o ? Colors.white : txt,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14)),
                          child: Text(o,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold)))))
                ])));
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
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label, style: TextStyle(fontSize: 12, color: grey)),
              const SizedBox(height: 2),
              Text(value,
                  style: TextStyle(fontWeight: FontWeight.bold, color: txt))
            ])));
  }

  Widget _mapPin(String label, double left, double top) {
    return Positioned(
        left: left,
        top: top,
        child: Column(children: [
          Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
              decoration: BoxDecoration(
                  color: card,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: border)),
              child: Text(label,
                  style: TextStyle(
                      fontSize: 11, fontWeight: FontWeight.bold, color: txt))),
          Icon(Icons.location_on, color: navy, size: 22)
        ]));
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
              Text('فنادق تناسب اختياراتك',
                  style: TextStyle(
                      fontSize: 24, fontWeight: FontWeight.bold, color: txt)),
              const SizedBox(height: 4),
              Text('$destination - إفطار شامل - إلغاء مرن',
                  style: TextStyle(fontSize: 13, color: grey)),
              const SizedBox(height: 16),

              _field('الوجهة', destination, _pickDestination),
              const SizedBox(height: 12),
              _field('الوصول والمغادرة', dateText, _pickDate),
              const SizedBox(height: 12),
              _field('الغرف والمسافرون', guestsText, _pickGuests),
              const SizedBox(height: 14),

              // بحث عن الفنادق - في نفس الصفحة
              SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Text(
                                'تم تحديث النتائج: $destination - $dateText - $guestsText')));
                      },
                      style: ElevatedButton.styleFrom(
                          backgroundColor: navy,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14))),
                      child: const Text('بحث عن الفنادق',
                          style: TextStyle(fontWeight: FontWeight.bold)))),
              const SizedBox(height: 10),

              // الفلتر مفعل إفطار وإلغاء مرن - في نفس الصفحة
              SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                      onPressed: () =>
                          setState(() => filterActive = !filterActive),
                      style: ElevatedButton.styleFrom(
                          backgroundColor: filterActive ? navy : lightBg,
                          foregroundColor: filterActive ? Colors.white : navy,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12))),
                      child: Text(
                          filterActive
                              ? 'الفلتر مفعل إفطار وإلغاء مرن ✓'
                              : 'الفلتر مفعل إفطار وإلغاء مرن',
                          style:
                              const TextStyle(fontWeight: FontWeight.bold)))),
              const SizedBox(height: 10),

              // ترتيب النتائج
              SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                      onPressed: _pickSort,
                      style: ElevatedButton.styleFrom(
                          backgroundColor: lightBg,
                          foregroundColor: navy,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12))),
                      child: Text('ترتيب النتائج: $sortBy',
                          style:
                              const TextStyle(fontWeight: FontWeight.bold)))),
              const SizedBox(height: 22),

              // نتائج التصفية
              Text('نتائج التصفية',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold, color: txt)),
              const SizedBox(height: 12),
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
                    Text('إقامة تشمل الإفطار وتعرض سياسة إلغاء مرنة',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: txt,
                            height: 1.6)),
                    const SizedBox(height: 4),
                    Text('راجع الشروط الخاصة بالغرف قبل التأكيد',
                        style:
                            TextStyle(fontSize: 13, color: grey, height: 1.6)),
                    const SizedBox(height: 12),
                    SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (_) => const HotelsScreen()));
                            },
                            style: ElevatedButton.styleFrom(
                                backgroundColor: lightBg,
                                foregroundColor: navy,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12))),
                            child: const Text('إعادة ضبط التصفية',
                                style:
                                    TextStyle(fontWeight: FontWeight.bold)))),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // إقامة مطابقة لبحثك
              Text('إقامة مطابقة لبحثك',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold, color: txt)),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                    color: card,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: border)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Stack(children: [
                      ClipRRect(
                          borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(18)),
                          child: Image.network(
                              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80',
                              height: 180,
                              width: double.infinity,
                              fit: BoxFit.cover)),
                      Positioned(
                          top: 12,
                          left: 12,
                          child: InkWell(
                              onTap: () => setState(() => isFav = !isFav),
                              child: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20)),
                                  child: Icon(
                                      isFav
                                          ? Icons.favorite
                                          : Icons.favorite_border,
                                      color: isFav ? Colors.red : navy,
                                      size: 20)))),
                    ]),
                    Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('إقامة فاخرة على ضفاف النيل',
                              style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: txt)),
                          const SizedBox(height: 4),
                          Text('4.9 ★ - 5 نجوم - إفطار شامل - كورنيش النيل',
                              style: TextStyle(fontSize: 12, color: grey)),
                          const SizedBox(height: 8),
                          Text('6,800 ج.م / ليلة',
                              style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: navy)),
                          const SizedBox(height: 10),
                          SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                  onPressed: () => Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (_) =>
                                              const HotelDetailScreen())),
                                  style: ElevatedButton.styleFrom(
                                      backgroundColor: navy,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(12))),
                                  child: const Text('عرض التفاصيل',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)))),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // اختر الإقامة حسب الموقع
              Text('اختر الإقامة حسب الموقع',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold, color: txt)),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                    color: card,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: border)),
                child: Column(children: [
                  SizedBox(
                      height: 200,
                      width: double.infinity,
                      child: ClipRRect(
                          borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(18)),
                          child: Stack(children: [
                            Image.network(
                                'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80',
                                height: 200,
                                width: double.infinity,
                                fit: BoxFit.cover),
                            _mapPin('خان الخليلي', 40, 30),
                            _mapPin('النيل', 150, 80),
                            _mapPin('الأهرامات', 30, 130),
                            _mapPin('المتحف', 200, 40)
                          ]))),
                  Padding(
                      padding: const EdgeInsets.all(14),
                      child: SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: lightBg,
                                  foregroundColor: navy,
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                              child: const Text('عرض الفنادق على الخريطة',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold))))),
                ]),
              ),
              const SizedBox(height: 22),

              // مساعدة في اختيار الغرفة
              InkWell(
                borderRadius: BorderRadius.circular(18),
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SupportScreen()),
                ),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                      color: card,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: border)),
                  child: Row(children: [
                    Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                            color: lightBg,
                            borderRadius: BorderRadius.circular(12)),
                        child: Icon(Icons.headset_mic_outlined, color: navy)),
                    const SizedBox(width: 12),
                    Expanded(
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                          Text('مساعدة في اختيار الغرفة',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, color: txt)),
                          const SizedBox(height: 2),
                          Text('المرافق والمواقع وسياسة الحجز',
                              style: TextStyle(fontSize: 12, color: grey))
                        ])),
                    Icon(Icons.arrow_forward_ios, size: 14, color: grey),
                  ]),
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
