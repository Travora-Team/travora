import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/hotels/rooms_screen.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/trips/my_trips_screen.dart';
import 'package:my_app/features/trips/share_trip_sheet.dart';

class HotelDetailScreen extends StatefulWidget {
  final int durationDays;

  const HotelDetailScreen({super.key, this.durationDays = 4});
  @override
  State<HotelDetailScreen> createState() => _HotelDetailScreenState();
}

class _HotelDetailScreenState extends State<HotelDetailScreen> {
  bool isFav = false;
  DateTime? selectedDate = DateTime(2027, 3, 15);
  String guestsText = '2 بالغين - غرفة واحدة';
  String selectedRoom = '1 غرفة مزدوجة';

  final List<String> hotelImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
  ];

  void _showPhotos() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        builder: (_, ctrl) => Container(
          decoration: const BoxDecoration(
              color: whiteCard,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
          child: Column(
            children: [
              const SizedBox(height: 10),
              Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                      color: lightBorder,
                      borderRadius: BorderRadius.circular(10))),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('صور الفندق',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(context)),
                    ]),
              ),
              Expanded(
                child: ListView.builder(
                  controller: ctrl,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: hotelImages.length,
                  itemBuilder: (_, i) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.network(hotelImages[i],
                            height: 220,
                            width: double.infinity,
                            fit: BoxFit.cover)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showReviews() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _hotelSheet(
        title: 'تجارب المسافرين',
        child: Column(
          children: [
            Row(children: [
              _reviewStat('128', 'المراجعات'),
              const SizedBox(width: 12),
              _reviewStat('4.8 / 5', 'التقييم'),
            ]),
            const SizedBox(height: 16),
            _reviewCard('وسام', 5,
                'تجربة رائعة وتنظيم واضح. التوقيت مناسب واستمتعنا بالزيارة. الموقع مميز.'),
            _reviewCard('أحمد', 5, 'ساعدتنا على اختيار تجربة مناسبة للعائلة.'),
            _reviewCard('أحمد', 4, 'مناسب لرحلة قصيرة في القاهرة.'),
            _reviewCard('أحمد', 4,
                'مناسب لرحلة قصيرة في القاهرة. الفندق نظيف والخدمة ممتازة.'),
          ],
        ),
      ),
    );
  }

  void _showBookingInfo() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _hotelSheet(
        title: 'ما يشمله الحجز',
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('تفاصيل واضحة',
              style: TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 16, color: textColor)),
          const SizedBox(height: 6),
          const Text('يشمل تأكيد الحجز ومعلومات الغرفة المذكورة في التفاصيل.',
              style: TextStyle(color: greyText)),
          const SizedBox(height: 16),
          const Text('خيارات إضافية',
              style: TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 16, color: textColor)),
          const SizedBox(height: 6),
          const Text('راجع الإفطار والانتقالات.',
              style: TextStyle(color: greyText)),
          const SizedBox(height: 16),
          const Text('الدعم',
              style: TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 16, color: textColor)),
          const SizedBox(height: 6),
          const Text('يمكنك فتح صفحة الدعم في أي وقت.',
              style: TextStyle(color: greyText)),
          const SizedBox(height: 20),
          SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                      backgroundColor: navy,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14))),
                  child: const Text('فهمت',
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold)))),
        ]),
      ),
    );
  }

  void _showCancelPolicy() => showTravoraCancellationPolicy(context);

  void _showCalendar() async {
    final picked = await showDatePicker(
        context: context,
        initialDate: selectedDate ?? DateTime.now(),
        firstDate: DateTime.now(),
        lastDate: DateTime(2027, 12, 31));
    if (picked != null) setState(() => selectedDate = picked);
  }

  void _showGuests() {
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
                const Text('الغرف والمسافرون',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context))
              ]),
              const Text('اختر ما يناسب رحلتك',
                  style: TextStyle(color: greyText)),
              const SizedBox(height: 16),
              _guestOption('1 غرفة مزدوجة', '1 غرفة - 2 بالغين'),
              _guestOption('2 غرف - 4 بالغين', '2 غرف - 4 بالغين'),
              _guestOption(
                  '2 بالغين + طفل - غرفة واحدة', '2 بالغين + طفل - غرفة واحدة'),
              _guestOption('عائلة - 2 غرف', 'عائلة - 2 غرف'),
            ]),
      ),
    );
  }

  Widget _guestOption(String title, String value) {
    bool sel = guestsText == value;
    return InkWell(
      onTap: () {
        setState(() {
          guestsText = value;
          selectedRoom = title;
        });
        Navigator.pop(context);
      },
      child: Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
              color: sel ? lightBlueBg : backgroundColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: sel ? navy : lightBorder)),
          child: Row(children: [
            Icon(sel ? Icons.radio_button_checked : Icons.radio_button_off,
                color: navy),
            const SizedBox(width: 10),
            Text(title,
                style: const TextStyle(
                    fontWeight: FontWeight.bold, color: textColor))
          ])),
    );
  }

  void _toggleFav() {
    setState(() => isFav = !isFav);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(isFav ? 'محفوظ في المفضلة' : 'تمت الإزالة من المفضلة'),
        backgroundColor: navy));
    if (isFav) {
      showModalBottomSheet(
          context: context,
          backgroundColor: Colors.transparent,
          builder: (_) => Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                  color: whiteCard,
                  borderRadius:
                      BorderRadius.vertical(top: Radius.circular(20))),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.favorite, color: Colors.red, size: 40),
                const SizedBox(height: 10),
                const Text('محفوظ في المفضلة',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: textColor)),
                const SizedBox(height: 6),
                const Text('هتلاقي الفندق ده في المفضلة عندك في أي وقت.',
                    style: TextStyle(color: greyText)),
                const SizedBox(height: 16),
                Row(children: [
                  Expanded(
                      child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const MyTripsScreen()));
                          },
                          style:
                              ElevatedButton.styleFrom(backgroundColor: navy),
                          child: const Text('عرض المفضلة',
                              style: TextStyle(color: Colors.white)))),
                  const SizedBox(width: 10),
                  Expanded(
                      child: OutlinedButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('إغلاق',
                              style: TextStyle(color: navy))))
                ])
              ])));
    }
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
            const Text('إقامة فاخرة على ضفاف النيل',
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 6),
            const Text('كورنيش النيل، القاهرة - فندق 5 نجوم',
                style: TextStyle(color: greyText, fontSize: 13)),
            const SizedBox(height: 14),
            // الصورة
            ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: Image.network(hotelImages[0],
                    height: 230, width: double.infinity, fit: BoxFit.cover)),
            const SizedBox(height: 12),
            SizedBox(
                width: double.infinity,
                height: 48,
                child: OutlinedButton.icon(
                    onPressed: _showPhotos,
                    icon: const Icon(Icons.photo_library_outlined, color: navy),
                    label: const Text('عرض الصور',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)),
                    style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: lightBorder),
                        backgroundColor: whiteCard,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))))),
            const SizedBox(height: 20),
            // الوصف
            const Text('إقامة تجمع الراحة والموقع',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 8),
            const Text(
                'غرفة واسعة بإطلالة على النيل وإفطار يومي وموقع قريب من وسط القاهرة. اخترنا غرفة وراجع تفاصيل إقامتك.',
                style: TextStyle(color: greyText, height: 1.6)),
            const SizedBox(height: 16),
            // السعر والتقييم جنب بعض
            Row(children: [
              Expanded(
                  child: _infoBox(
                      'السعر / ليلة', '6,800 ج.م', Icons.payments_outlined)),
              const SizedBox(width: 12),
              Expanded(
                  child:
                      _infoBox('التقييم', '4.9 / 5', Icons.star, isStar: true)),
            ]),
            const SizedBox(height: 20),
            // مرافق الإقامة
            const Text('مرافق الإقامة',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 12),
            Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: whiteCard,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: lightBorder)),
                child: Wrap(spacing: 8, runSpacing: 8, children: [
                  _chip('إفطار شامل', Icons.free_breakfast_outlined),
                  _chip('واي فاي', Icons.wifi),
                  _chip('مسبح', Icons.pool_outlined),
                  _chip('مركز لياقة', Icons.fitness_center_outlined),
                  _chip('خدمة غرف', Icons.room_service_outlined),
                  _chip(
                      'استقبال على مدار الساعة', Icons.support_agent_outlined),
                ])),
            const SizedBox(height: 20),
            // 3 كروت قابلة للضغط
            _clickCard(Icons.star_border, 'تقييم النزلاء', 'الراحة والنظافة',
                _showReviews),
            _clickCard(Icons.access_time, 'شروط الإقامة',
                'دخول 3:00 مساءً - مغادرة 12:00 ظهراً', _showBookingInfo),
            _clickCard(Icons.receipt_long_outlined, 'سياسة الإلغاء',
                'راجع الموعد النهائي قبل التأكيد', _showCancelPolicy),
            const SizedBox(height: 20),
            // موقع الفندق - خريطة حقيقية
            const Text('موقع الفندق',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 8),
            const Text('كورنيش النيل، القاهرة - قريب من وسط البلد والمطاعم.',
                style: TextStyle(color: greyText)),
            const SizedBox(height: 12),
            ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Stack(children: [
                  Image.network(mapImage,
                      height: 180, width: double.infinity, fit: BoxFit.cover),
                  Positioned(
                      bottom: 10,
                      right: 10,
                      left: 10,
                      child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 10),
                          decoration: BoxDecoration(
                              color: whiteCard,
                              borderRadius: BorderRadius.circular(12)),
                          child: Row(children: [
                            const Icon(Icons.location_on, color: navy),
                            const SizedBox(width: 8),
                            const Expanded(
                                child: Text('عرض الموقع على الخريطة',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: textColor))),
                            const Icon(Icons.arrow_forward_ios,
                                size: 14, color: greyText)
                          ]))),
                ])),
            const SizedBox(height: 20),
            // الوصول والمغادرة
            const Text('الوصول والمغادرة',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 12),
            _fieldCard(
                Icons.calendar_today_outlined,
                'تاريخ الوصول',
                selectedDate != null
                    ? '${selectedDate!.day} / ${selectedDate!.month} / ${selectedDate!.year}'
                    : 'اختر التاريخ',
                _showCalendar),
            _fieldCard(Icons.group_outlined, 'الغرف والمسافرون', guestsText,
                _showGuests),
            const SizedBox(height: 20),
            // اختيار الغرفة + حفظ
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: () {
                      final date = selectedDate ?? DateTime(2027, 3, 15);
                      const months = [
                        'يناير',
                        'فبراير',
                        'مارس',
                        'أبريل',
                        'مايو',
                        'يونيو',
                        'يوليو',
                        'أغسطس',
                        'سبتمبر',
                        'أكتوبر',
                        'نوفمبر',
                        'ديسمبر'
                      ];
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => RoomsScreen(
                            checkInText:
                                '${date.day} ${months[date.month - 1]} ${date.year}',
                            nights: widget.durationDays > 1
                                ? widget.durationDays - 1
                                : 1,
                            travelersLabel: guestsText,
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: Text('اختيار الغرفة - $selectedRoom',
                        style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold)))),
            const SizedBox(height: 12),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton.icon(
                    onPressed: _toggleFav,
                    icon: Icon(isFav ? Icons.favorite : Icons.favorite_border,
                        color: isFav ? Colors.red : navy),
                    label: Text(isFav ? 'محفوظ في المفضلة' : 'حفظ الفندق',
                        style: const TextStyle(
                            color: navy, fontWeight: FontWeight.bold)),
                    style: OutlinedButton.styleFrom(
                        backgroundColor: whiteCard,
                        side: const BorderSide(color: lightBorder),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))))),
            const SizedBox(height: 20),
            // تحتاج مساعدة
            Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: whiteCard,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: lightBorder)),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('تحتاج مساعدة؟',
                          style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: textColor)),
                      const SizedBox(height: 6),
                      const Text('فريقنا جاهز يساعدك في أي وقت بخصوص حجزك.',
                          style: TextStyle(color: greyText)),
                      const SizedBox(height: 12),
                      SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: OutlinedButton(
                              onPressed: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (_) => const SupportScreen()));
                              },
                              style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: navy),
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                              child: const Text('تواصل مع الدعم',
                                  style: TextStyle(
                                      color: navy,
                                      fontWeight: FontWeight.bold))))
                    ])),
          ]),
        ),
      ),
    );
  }

  Widget _infoBox(String label, String value, IconData icon,
      {bool isStar = false}) {
    return Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: lightBorder)),
        child: Column(children: [
          Icon(icon, color: isStar ? Colors.amber : navy),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(color: greyText, fontSize: 12)),
          const SizedBox(height: 4),
          Text(value,
              style: const TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 16, color: textColor))
        ]));
  }

  Widget _chip(String text, IconData icon) {
    return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
            color: backgroundColor, borderRadius: BorderRadius.circular(20)),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(icon, size: 16, color: navy),
          const SizedBox(width: 5),
          Text(text,
              style: const TextStyle(
                  fontSize: 12, fontWeight: FontWeight.bold, color: textColor))
        ]));
  }

  Widget _clickCard(
      IconData icon, String title, String sub, VoidCallback onTap) {
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
              const Icon(Icons.arrow_forward_ios, size: 14, color: greyText)
            ])));
  }

  Widget _fieldCard(
      IconData icon, String label, String value, VoidCallback onTap) {
    return InkWell(
        onTap: onTap,
        child: Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lightBorder)),
            child: Row(children: [
              Icon(icon, color: navy),
              const SizedBox(width: 12),
              Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                    Text(label,
                        style: const TextStyle(color: greyText, fontSize: 12)),
                    Text(value,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, color: textColor))
                  ])),
              const Icon(Icons.keyboard_arrow_down, color: greyText)
            ])));
  }

  Widget _hotelSheet({required String title, required Widget child}) {
    return DraggableScrollableSheet(
        initialChildSize: 0.75,
        builder: (_, ctrl) => Container(
            decoration: const BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
            child: SingleChildScrollView(
                controller: ctrl,
                padding: const EdgeInsets.all(20),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(title,
                                style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: textColor)),
                            IconButton(
                                icon: const Icon(Icons.close),
                                onPressed: () => Navigator.pop(context))
                          ]),
                      const SizedBox(height: 12),
                      child
                    ]))));
  }

  Widget _reviewStat(String value, String label) {
    return Expanded(
        child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
                color: backgroundColor,
                borderRadius: BorderRadius.circular(14)),
            child: Column(children: [
              Text(value,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: textColor)),
              Text(label, style: const TextStyle(color: greyText, fontSize: 12))
            ])));
  }

  Widget _reviewCard(String name, int stars, String text) {
    return Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
            color: backgroundColor, borderRadius: BorderRadius.circular(14)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            CircleAvatar(
                backgroundColor: navy,
                child:
                    Text(name[0], style: const TextStyle(color: Colors.white))),
            const SizedBox(width: 10),
            Text(name,
                style: const TextStyle(
                    fontWeight: FontWeight.bold, color: textColor)),
            const Spacer(),
            Row(
                children: List.generate(
                    5,
                    (i) => Icon(i < stars ? Icons.star : Icons.star_border,
                        size: 16, color: Colors.amber)))
          ]),
          const SizedBox(height: 8),
          Text(text, style: const TextStyle(color: textColor, height: 1.5))
        ]));
  }
}

// =================== صفحة ميزانية رحلتي - نفس الفيديو بالظبط ===================
