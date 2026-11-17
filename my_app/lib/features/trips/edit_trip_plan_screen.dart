import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/experiences/explore_activities_screen.dart';
import 'package:my_app/features/trips/live_trip_replanned_screen.dart';
import 'package:my_app/features/trips/smart_plan_result_screen.dart';
import 'package:my_app/features/trips/trip_details_screen.dart';
import 'package:my_app/features/trips/widgets/edit_trip_widgets.dart';

class EditTripPlanScreen extends StatefulWidget {
  const EditTripPlanScreen({super.key});
  @override
  State<EditTripPlanScreen> createState() => _EditTripPlanScreenState();
}

class _EditTripPlanScreenState extends State<EditTripPlanScreen> {
  String selectedDestination = 'القاهرة، مصر';
  String selectedDate = '15 مارس 2027';
  String selectedBudget = '6,000 ج';
  int selectedDay = 15;
  int expandedDay = -1;

  final List<String> destinations = [
    'القاهرة، مصر',
    'الجيزة، مصر',
    'القاهرة، مصر',
    'الأقصر، مصر',
    'شرم الشيخ، مصر',
  ];

  final List<String> budgets = ['3,000 ج', '6,000 ج', '10,000 ج', '12,000 ج'];

  final List<Map<String, dynamic>> days = [
    {
      'title': 'الأهرامات والمتحف المصري',
      'time': '9:00 ص - 6:00 م',
      'tags': 'تاريخ وآثار • القاهرة والجيزة',
      'img': pyramidsImage,
      'details':
          'زيارة الأهرامات وأبو الهول ثم المتحف المصري، مع وقت حر للتصوير والتسوق.',
    },
    {
      'title': 'القاهرة القديمة وخان الخليلي',
      'time': '9:00 ص - 9:00 م',
      'tags': 'ثقافة وطعام وتسوق',
      'img': khanImage,
      'details':
          'جولة في القاهرة القديمة، خان الخليلي، وتجربة أكلات محلية وقهوة شرقي.',
    },
    {
      'title': 'جولة حرة وعشاء على النيل',
      'time': '10:00 ص - 10:00 م',
      'tags': 'استرخاء وتجربة محلية',
      'img': cairoImage,
      'details': 'يوم حر للاستكشاف على راحتك، وعشاء على النيل في المساء.',
    },
    {
      'title': 'وقت حر والعودة إلى المطار',
      'time': '9:00 ص - 2:00 م',
      'tags': 'زيارة أخيرة وانتقال',
      'img': mapImage,
      'details': 'وقت حر أخير، تجهيز الشنط، والانتقال إلى المطار.',
    },
  ];

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  // ===== Sheet عام =====
  void _showSheet(
      {required String title, required String sub, required Widget child}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        decoration: const BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Directionality(
          textDirection: TextDirection.rtl,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                  IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close, color: textColor)),
                ],
              ),
              Text(sub, style: const TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 14),
              child,
            ],
          ),
        ),
      ),
    );
  }

  void _showDestinationSheet() {
    _showSheet(
      title: 'اختر وجهتك',
      sub: 'اختر المدينة التي تبدأ منها رحلتك',
      child: Column(
        children: destinations.map((d) {
          final isSel = d == selectedDestination;
          return InkWell(
            onTap: () {
              setState(() => selectedDestination = d);
              Navigator.pop(context);
            },
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isSel ? lightBlueBg : whiteCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: isSel ? navy : lightBorder),
              ),
              child: Row(
                children: [
                  Expanded(
                      child: Text(d,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, color: textColor))),
                  if (isSel)
                    const Icon(Icons.check_circle, color: navy, size: 20),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  void _showDateSheet() {
    _showSheet(
      title: 'تواريخ الرحلة',
      sub: 'اختر تاريخ بدء الرحلة - مارس 2027',
      child: Column(
        children: [
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 7, mainAxisSpacing: 6, crossAxisSpacing: 6),
            itemCount: 31,
            itemBuilder: (_, i) {
              final day = i + 1;
              final isSel = day == selectedDay;
              return InkWell(
                onTap: () {
                  setState(() {
                    selectedDay = day;
                    selectedDate = '$day مارس 2027';
                  });
                  Navigator.pop(context);
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: isSel ? navy : lightBlueBg,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Center(
                    child: Text('$day',
                        style: TextStyle(
                            color: isSel ? Colors.white : textColor,
                            fontWeight: FontWeight.bold)),
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 12),
          Text('الموعد المحدد: $selectedDate',
              style: const TextStyle(
                  fontSize: 13, color: navy, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  void _showBudgetSheet() {
    _showSheet(
      title: 'ميزانية الرحلة',
      sub: 'اختر الميزانية المناسبة لك',
      child: Column(
        children: budgets.map((b) {
          final isSel = b == selectedBudget;
          return InkWell(
            onTap: () {
              setState(() => selectedBudget = b);
              Navigator.pop(context);
            },
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isSel ? lightBlueBg : whiteCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: isSel ? navy : lightBorder),
              ),
              child: Row(
                children: [
                  Expanded(
                      child: Text(b,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, color: textColor))),
                  if (isSel)
                    const Icon(Icons.check_circle, color: navy, size: 20),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  void _openDayEditor(int dayIndex) {
    final day = days[dayIndex];
    List<DayStop> stops;

    if (dayIndex == 0) {
      stops = [
        DayStop(
          title: 'أهرامات الجيزة',
          time: '9:00 ص',
          sub: 'زيارة الأهرامات والتصوير',
          image: pyramidsImage,
        ),
        DayStop(
          title: 'أبو الهول',
          time: '11:00 ص',
          sub: 'استكشاف المنطقة الأثرية',
          image: pyramidsImage,
        ),
        DayStop(
          title: 'المتحف المصري',
          time: '2:00 م',
          sub: 'جولة داخل المتحف',
          image: cairoImage,
        ),
      ];
    } else if (dayIndex == 1) {
      stops = [
        DayStop(
          title: 'شارع المعز',
          time: '9:00 ص',
          sub: 'جولة في القاهرة التاريخية',
          image: khanImage,
        ),
        DayStop(
          title: 'مسجد الحسين',
          time: '12:00 م',
          sub: 'زيارة المعالم التاريخية',
          image: khanImage,
        ),
        DayStop(
          title: 'خان الخليلي',
          time: '3:00 م',
          sub: 'التسوق وتجربة المقاهي المحلية',
          image: khanImage,
        ),
      ];
    } else if (dayIndex == 2) {
      stops = [
        DayStop(
          title: 'وقت حر للاستكشاف',
          time: '10:00 ص',
          sub: 'اختيار الأنشطة بحرية',
          image: cairoImage,
        ),
        DayStop(
          title: 'جولة على كورنيش النيل',
          time: '4:00 م',
          sub: 'الاستمتاع بإطلالة النيل',
          image: nileHotelImage,
        ),
        DayStop(
          title: 'عشاء على النيل',
          time: '8:00 م',
          sub: 'عشاء وتجربة مسائية',
          image: nileHotelImage,
        ),
      ];
    } else {
      stops = [
        DayStop(
          title: 'وقت حر أخير',
          time: '9:00 ص',
          sub: 'التسوق أو الاسترخاء',
          image: mapImage,
        ),
        DayStop(
          title: 'تجهيز الأمتعة',
          time: '11:00 ص',
          sub: 'الاستعداد للمغادرة',
          image: mapImage,
        ),
        DayStop(
          title: 'الانتقال إلى المطار',
          time: '1:00 م',
          sub: 'العودة إلى المطار',
          image: mapImage,
        ),
      ];
    }

    showEditDayPlanSheet(
      context,
      stops: stops,
      coverImage: day['img'],
      onSave: (newOrder) {
        setState(() {
          day['details'] = newOrder.map((stop) => stop.title).join(' • ');
        });
        _showSnack('تم حفظ ترتيب ${day['title']}');
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // ===== العنوان =====
            const Text('تعديل خطة الرحلة',
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('تغييرات صغيرة أو رحلة تشبهك أكثر',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),

            // ===== السكشن الأزرق =====
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: lightBlueBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lightBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('القاهرة والجيزة • 4 أيام',
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                  SizedBox(height: 4),
                  Text('التعديل يظهر في خطتك. احفظها وراجعها بعد التوقيت.',
                      style: TextStyle(fontSize: 13, color: textColor)),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // ===== الوجهة / التواريخ / الميزانية =====
            EditField(
              label: 'الوجهة',
              value: selectedDestination,
              icon: Icons.location_on_outlined,
              onTap: _showDestinationSheet,
            ),
            EditField(
              label: 'تواريخ الرحلة',
              value: selectedDate,
              icon: Icons.calendar_today_outlined,
              onTap: _showDateSheet,
            ),
            EditField(
              label: 'ميزانية الرحلة',
              value: selectedBudget,
              icon: Icons.wallet_outlined,
              onTap: _showBudgetSheet,
            ),
            const SizedBox(height: 20),

            // ===== غير تفاصيل يومك =====
            const Text('غير تفاصيل يومك',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('افتح اليوم لتبديل تجربة أو وقت',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 12),

            ...List.generate(days.length, (i) {
              final d = days[i];
              final isOpen = expandedDay == i;
              return InkWell(
                onTap: () => _openDayEditor(i),
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: whiteCard,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: lightBorder),
                  ),
                  child: Column(
                    children: [
                      Row(children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.network(
                            d['img'],
                            width: 70,
                            height: 70,
                            fit: BoxFit.cover,
                            errorBuilder: (c, e, s) => Container(
                                width: 70,
                                height: 70,
                                color: lightBorder,
                                child: const Icon(Icons.landscape_rounded,
                                    color: navy)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${i + 1} - ${d['title']}',
                                  style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      color: textColor)),
                              const SizedBox(height: 4),
                              Text(d['time'],
                                  style: const TextStyle(
                                      fontSize: 12,
                                      color: navy,
                                      fontWeight: FontWeight.bold)),
                              const SizedBox(height: 2),
                              Text(d['tags'],
                                  style: const TextStyle(
                                      fontSize: 12, color: greyText)),
                            ],
                          ),
                        ),
                        Icon(
                            isOpen
                                ? Icons.keyboard_arrow_up
                                : Icons.keyboard_arrow_down,
                            color: greyText),
                      ]),
                      if (isOpen) ...[
                        const SizedBox(height: 10),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                              color: lightBlueBg,
                              borderRadius: BorderRadius.circular(10)),
                          child: Text(d['details'],
                              style: const TextStyle(
                                  fontSize: 13, color: textColor, height: 1.5)),
                        ),
                      ],
                    ],
                  ),
                ),
              );
            }),

            // ===== الزراير =====
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const ExploreActivitiesScreen(),
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: lightBorder),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('إضافة تجربة',
                    style: TextStyle(color: navy, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => LiveTripReplannedScreen(
                      destination: selectedDestination,
                      date: selectedDate,
                    ),
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: lightBorder),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('إعادة اقتراح الخطة',
                    style: TextStyle(color: navy, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  showTripSavedDialog(
                    context,
                    onViewTrip: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => TripDetailsScreen(
                            destination: selectedDestination,
                            date: selectedDate,
                            budget: selectedBudget,
                          ),
                        ),
                      );
                    },
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: navy,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('حفظ التعديلات',
                    style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: TextButton(
                onPressed: () => Navigator.push(
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
                ),
                child: const Text('إلغاء والعودة إلى الخطة',
                    style: TextStyle(
                        color: greyText, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}

// ==================== DIALOG - خطة رحلتك محفوظة ====================
void showTripSavedDialog(
  BuildContext context, {
  required VoidCallback onViewTrip,
}) {
  showDialog(
    context: context,
    barrierDismissible: true,
    builder: (_) => Directionality(
      textDirection: TextDirection.rtl,
      child: AlertDialog(
        backgroundColor: whiteCard,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        contentPadding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                InkWell(
                  onTap: () => Navigator.pop(context),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: lightBlueBg,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(Icons.close, size: 16, color: greyText),
                  ),
                ),
                const Spacer(),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFE8F5E9),
                borderRadius: BorderRadius.circular(50),
              ),
              child: const Icon(
                Icons.check,
                color: Color(0xFF2E7D32),
                size: 30,
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'خطة رحلتك محفوظة',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'تم تجديد التعديلات داخل تفاصيل الرحلة',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: greyText),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  onViewTrip();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: navy,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: const Text(
                  'عرض رحلتي',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

// ==================== EDIT DAY PLAN SHEET - تعديل اليوم ====================
void showEditDayPlanSheet(
  BuildContext context, {
  required List<DayStop> stops,
  required String coverImage,
  required void Function(List<DayStop> newOrder) onSave,
}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => EditDayPlanSheet(
      stops: stops,
      coverImage: coverImage,
      onSave: onSave,
    ),
  );
}

class EditDayPlanSheet extends StatefulWidget {
  final List<DayStop> stops;
  final String coverImage;
  final void Function(List<DayStop> newOrder) onSave;

  const EditDayPlanSheet({
    super.key,
    required this.stops,
    required this.coverImage,
    required this.onSave,
  });

  @override
  State<EditDayPlanSheet> createState() => _EditDayPlanSheetState();
}

class _EditDayPlanSheetState extends State<EditDayPlanSheet> {
  late List<DayStop> order;
  int selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    order = List.from(widget.stops);
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        height: MediaQuery.of(context).size.height * 0.78,
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
        decoration: const BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 45,
                height: 5,
                decoration: BoxDecoration(
                  color: lightBorder,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 14),
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                widget.coverImage,
                height: 170,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'اختر ترتيب أو توقيت يومك بحرية',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'اضغط على أي محطة لاختيارها، واسحب لتغيير ترتيبها، ثم احفظ',
              style: TextStyle(fontSize: 12, color: greyText),
            ),
            const SizedBox(height: 14),
            Expanded(
              child: ReorderableListView.builder(
                itemCount: order.length,
                onReorder: (oldIndex, newIndex) {
                  setState(() {
                    if (newIndex > oldIndex) newIndex -= 1;
                    final item = order.removeAt(oldIndex);
                    order.insert(newIndex, item);
                    if (selectedIndex == oldIndex) {
                      selectedIndex = newIndex;
                    } else if (oldIndex < selectedIndex &&
                        newIndex >= selectedIndex) {
                      selectedIndex -= 1;
                    } else if (oldIndex > selectedIndex &&
                        newIndex <= selectedIndex) {
                      selectedIndex += 1;
                    }
                  });
                },
                itemBuilder: (context, index) {
                  final stop = order[index];
                  final isSelected = index == selectedIndex;
                  return InkWell(
                    key: ValueKey('${stop.title}-$index'),
                    onTap: () => setState(() => selectedIndex = index),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 14),
                      decoration: BoxDecoration(
                        color: isSelected ? lightBlueBg : whiteCard,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? navy : lightBorder,
                          width: isSelected ? 1.5 : 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 26,
                            height: 26,
                            decoration: BoxDecoration(
                              color: isSelected ? navy : lightBlueBg,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Center(
                              child: Text(
                                '${index + 1}',
                                style: TextStyle(
                                  color: isSelected ? Colors.white : navy,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              stop.image,
                              width: 44,
                              height: 44,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Container(
                                width: 44,
                                height: 44,
                                color: lightBorder,
                                child: const Icon(Icons.landscape_rounded,
                                    color: navy),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  stop.title,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: textColor,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(stop.sub,
                                    style: const TextStyle(
                                        fontSize: 11, color: greyText)),
                              ],
                            ),
                          ),
                          Text(
                            stop.time,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: navy,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Icon(Icons.drag_handle,
                              color: greyText, size: 20),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  final savedOrder = List<DayStop>.from(order);
                  Navigator.pop(context);
                  widget.onSave(savedOrder);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: navy,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text(
                  'حفظ تعديل اليوم',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =================== صفحة تفاصيل الفندق - إقامة فاخرة على ضفاف النيل ===================
