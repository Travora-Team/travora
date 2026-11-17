import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/hotels/hotel_checkout_screen.dart';

class RoomsScreen extends StatefulWidget {
  final String checkInText;
  final int nights;
  final String travelersLabel;

  const RoomsScreen({
    super.key,
    this.checkInText = '15 مارس 2027',
    this.nights = 3,
    this.travelersLabel = '2 بالغين • غرفة واحدة',
  });

  @override
  State<RoomsScreen> createState() => _RoomsScreenState();
}

class _RoomsScreenState extends State<RoomsScreen> {
  late String checkIn;
  late int nights;
  late String travelers;
  int selectedDay = 15;

  @override
  void initState() {
    super.initState();
    checkIn = widget.checkInText;
    nights = widget.nights;
    travelers = widget.travelersLabel;
  }

  String get checkOutText {
    // 15 + 3 = 18 مارس - لو غيرتي التاريخ الإجمالي هيتحسب لوحده
    final day = selectedDay + nights;
    return '$day مارس 2027';
  }

  List<RoomItem> get rooms => [
        RoomItem(
          title: 'ديلوكس - سرير كبير',
          image: room1Image,
          size: '42 م²',
          bed: 'سرير كبير',
          view: 'إطلالة على النيل',
          facilities: 'إفطار شامل • واي فاي • تكييف • خدمة غرف',
          pricePerNight: 6800,
        ),
        RoomItem(
          title: 'ديلوكس - سريران منفصلان',
          image: room2Image,
          size: '42 م²',
          bed: 'سريران منفصلان',
          view: 'إطلالة على النيل',
          facilities: 'إفطار شامل • واي فاي • تكييف • خدمة غرف',
          pricePerNight: 6800,
        ),
        RoomItem(
          title: 'جناح تنفيذي مع شرفة',
          image: room3Image,
          size: '65 م²',
          bed: 'غرفة نوم وصالة',
          view: 'شرفة خاصة',
          facilities: 'إفطار شامل • واي فاي • تكييف • خدمة غرف',
          pricePerNight: 9200,
          buttonLabel: 'احجز الجناح',
        ),
      ];

  // ===== شيت التاريخ =====
  void _pickDate() {
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  InkWell(
                    onTap: () => Navigator.pop(ctx),
                    child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(20)),
                        child:
                            const Icon(Icons.close, size: 16, color: greyText)),
                  ),
                  const Spacer(),
                  const Text('تاريخ السفر',
                      style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                ],
              ),
              const SizedBox(height: 8),
              const Center(
                  child: Text('مارس 2027',
                      style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: textColor))),
              const SizedBox(height: 4),
              const Center(
                  child: Text('اختر تاريخ الوصول لتحديد موعد إقامتك',
                      style: TextStyle(fontSize: 12, color: greyText))),
              const SizedBox(height: 14),
              // أيام الأسبوع
              Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: const [
                    Text('س', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('ح', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('خ', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('أ', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('ث', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('ا', style: TextStyle(color: greyText, fontSize: 12)),
                    Text('ج', style: TextStyle(color: greyText, fontSize: 12)),
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
                  final selected = day == selectedDay;
                  return InkWell(
                    onTap: () => setSheet(() => selectedDay = day),
                    child: Container(
                      margin: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                          color: selected ? navy : Colors.transparent,
                          borderRadius: BorderRadius.circular(20)),
                      child: Center(
                          child: Text('$day',
                              style: TextStyle(
                                  color: selected ? Colors.white : textColor,
                                  fontWeight: selected
                                      ? FontWeight.bold
                                      : FontWeight.normal))),
                    ),
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
                        fontSize: 12, color: textColor, height: 1.5)),
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    setState(() => checkIn = '$selectedDay مارس 2027');
                    Navigator.pop(ctx);
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

  // ===== شيت المسافرون =====
  void _pickTravelers() {
    final options = [
      '1 بالغ • غرفة واحدة',
      '2 بالغين • غرفة واحدة',
      '2 بالغين + طفل • غرفة واحدة',
      '4 بالغين • غرفتان',
    ];
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
            Row(
              children: [
                InkWell(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.close,
                            size: 16, color: greyText))),
                const Spacer(),
                const Text('المسافرون والغرف',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ],
            ),
            const SizedBox(height: 8),
            const Text('كم شخصاً يسافر معك؟',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            ...options.map((opt) {
              final selected = opt == travelers;
              return InkWell(
                onTap: () {
                  setState(() => travelers = opt);
                  Navigator.pop(context);
                },
                child: Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                      color: selected ? lightBlueBg : whiteCard,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: selected ? navy : lightBorder)),
                  child: Row(children: [
                    Expanded(
                        child: Text(opt,
                            style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: textColor))),
                    if (selected) const Icon(Icons.check_circle, color: navy)
                  ]),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  // ===== شيت تفاصيل الغرفة =====
  void _showRoomDetails(RoomItem room) {
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
            Row(
              children: [
                InkWell(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.close,
                            size: 16, color: greyText))),
                const Spacer(),
                const Text('تفاصيل الغرفة',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ],
            ),
            const SizedBox(height: 14),
            Text('${room.title} • ${room.size} • 2 مسافران • ${room.view}',
                style: const TextStyle(
                    fontSize: 13, color: textColor, height: 1.6)),
            const SizedBox(height: 14),
            const Text('المرافق',
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 6),
            Text('${room.bed} • تكييف • واي فاي • حمام خاص • خدمة غرف',
                style: const TextStyle(
                    fontSize: 13, color: greyText, height: 1.6)),
            const SizedBox(height: 14),
            const Text('الوجبات',
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 6),
            const Text('الإفطار شامل في هذا الخيار',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            const Text('الوصول والمغادرة',
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 6),
            const Text('الوصول 3:00 م • المغادرة 12:00 ظهراً',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                    backgroundColor: navy,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14))),
                child: const Text('فهمت'),
              ),
            ),
            const SizedBox(height: 8),
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('اختر غرفتك',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              // بيسمع من فوق: التاريخ والليالي والمسافرين
              Text('$checkIn - $checkOutText • $nights ليالي • $travelers',
                  style: const TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 16),

              // ===== الإقامة =====
              InkWell(
                onTap: _pickDate,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                      color: whiteCard,
                      borderRadius: BorderRadius.circular(14)),
                  child: Row(children: [
                    Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.calendar_today_outlined,
                            color: navy, size: 18)),
                    const SizedBox(width: 12),
                    Expanded(
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                          const Text('الإقامة',
                              style: TextStyle(fontSize: 12, color: greyText)),
                          const SizedBox(height: 2),
                          Text(checkIn,
                              style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: textColor))
                        ])),
                    const Icon(Icons.keyboard_arrow_down, color: greyText),
                  ]),
                ),
              ),
              const SizedBox(height: 10),

              // ===== المسافرون =====
              InkWell(
                onTap: _pickTravelers,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                      color: whiteCard,
                      borderRadius: BorderRadius.circular(14)),
                  child: Row(children: [
                    Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.group_outlined,
                            color: navy, size: 18)),
                    const SizedBox(width: 12),
                    Expanded(
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                          const Text('المسافرون',
                              style: TextStyle(fontSize: 12, color: greyText)),
                          const SizedBox(height: 2),
                          Text(travelers,
                              style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: textColor))
                        ])),
                    const Icon(Icons.keyboard_arrow_down, color: greyText),
                  ]),
                ),
              ),
              const SizedBox(height: 14),

              // ===== ملاحظة الأسعار =====
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                    color: lightBlueBg,
                    borderRadius: BorderRadius.circular(12)),
                child: const Text(
                    'الأسعار تشمل الخدمة والضرائب\nراجع مساحة الغرفة، نوع السرير، وسياسة الإلغاء قبل الحجز.',
                    style:
                        TextStyle(fontSize: 12, color: textColor, height: 1.6)),
              ),
              const SizedBox(height: 16),

              // ===== الغرف =====
              ...rooms.map((room) {
                final total = room.pricePerNight * nights;
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                      color: whiteCard,
                      borderRadius: BorderRadius.circular(16)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: Image.network(room.image,
                              height: 170,
                              width: double.infinity,
                              fit: BoxFit.cover)),
                      const SizedBox(height: 12),
                      Text(room.title,
                          style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      const SizedBox(height: 6),
                      Text('${room.size} • ${room.bed} • ${room.view}',
                          style:
                              const TextStyle(fontSize: 13, color: textColor)),
                      const SizedBox(height: 4),
                      Text(room.facilities,
                          style: const TextStyle(fontSize: 12, color: navy)),
                      const SizedBox(height: 10),
                      Row(children: [
                        Text('${room.pricePerNight} ج.م / ليلة',
                            style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: textColor)),
                        const Spacer(),
                        Text('إجمالي $nights ليالي $total ج.م',
                            style:
                                const TextStyle(fontSize: 12, color: greyText)),
                      ]),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: () => _showRoomDetails(room),
                          style: OutlinedButton.styleFrom(
                              foregroundColor: navy,
                              side: const BorderSide(color: lightBorder),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12))),
                          child: const Text('مرافق الغرفة وسياسة الإلغاء'),
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {
                            final travelerCount = travelers.startsWith('1')
                                ? 1
                                : travelers.startsWith('4')
                                    ? 4
                                    : travelers.contains('طفل')
                                        ? 3
                                        : 2;
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => HotelCheckoutScreen(
                                  title: room.title,
                                  subTitle: '${room.bed} • إفطار شامل',
                                  image: room.image,
                                  dateRange: '$checkIn - $checkOutText',
                                  nights: nights,
                                  travelers: travelerCount,
                                  pricePerNight: room.pricePerNight,
                                ),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: navy,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14))),
                          child: Text('${room.buttonLabel} • $total ج.م',
                              style: const TextStyle(
                                  fontSize: 14, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
