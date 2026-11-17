import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/trips/smart_plan_result_screen.dart';
import 'package:my_app/features/trips/widgets/trip_planner_widgets.dart';

class TripPlannerScreen extends StatefulWidget {
  const TripPlannerScreen({super.key});
  @override
  State<TripPlannerScreen> createState() => _TripPlannerScreenState();
}

class _TripPlannerScreenState extends State<TripPlannerScreen> {
  String selectedDestination = 'القاهرة، مصر';
  DateTime selectedDate = DateTime(2027, 3, 15);
  int duration = 5;
  String travelers = '2 بالغ، غرفة واحدة';
  String budget = '6,000 ج.م';
  List<String> interests = ['ثقافة وتاريخ'];
  String pace = 'متوازنة';
  String transport = 'سيارة مع سائق';
  String accommodation = 'فندق 4 نجوم';
  final notesController = TextEditingController();

  @override
  void dispose() {
    notesController.dispose();
    super.dispose();
  }

  void openDestinationSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: whiteCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    'اختر وجهتك',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              SheetOption(
                text: 'القاهرة، مصر',
                selected: selectedDestination == 'القاهرة، مصر',
                onTap: () {
                  setState(() => selectedDestination = 'القاهرة، مصر');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'الأقصر، مصر',
                selected: selectedDestination == 'الأقصر، مصر',
                onTap: () {
                  setState(() => selectedDestination = 'الأقصر، مصر');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'أسوان، مصر',
                selected: selectedDestination == 'أسوان، مصر',
                onTap: () {
                  setState(() => selectedDestination = 'أسوان، مصر');
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void openDateSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: whiteCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Row(
                children: [
                  const Text(
                    'تاريخ السفر',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              CalendarDatePicker(
                initialDate: selectedDate,
                firstDate: DateTime(2026),
                lastDate: DateTime(2028),
                onDateChanged: (d) {
                  setState(() => selectedDate = d);
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void openDurationSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: whiteCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    'مدة الرحلة',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              SheetOption(
                text: '3 أيام',
                selected: duration == 3,
                onTap: () {
                  setState(() => duration = 3);
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: '4 أيام',
                selected: duration == 4,
                onTap: () {
                  setState(() => duration = 4);
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: '5 أيام',
                selected: duration == 5,
                onTap: () {
                  setState(() => duration = 5);
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void openTravelersSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: whiteCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    'المسافرون والغرف',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              SheetOption(
                text: '1 بالغ، غرفة واحدة',
                selected: travelers == '1 بالغ، غرفة واحدة',
                onTap: () {
                  setState(() => travelers = '1 بالغ، غرفة واحدة');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: '2 بالغين، غرفة واحدة',
                selected: travelers == '2 بالغين، غرفة واحدة',
                onTap: () {
                  setState(() => travelers = '2 بالغين، غرفة واحدة');
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void openBudgetSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: whiteCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    'ميزانية الرحلة',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              SheetOption(
                text: '3,000 ج.م',
                selected: budget == '3,000 ج.م',
                onTap: () {
                  setState(() => budget = '3,000 ج.م');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: '6,000 ج.م',
                selected: budget == '6,000 ج.م',
                onTap: () {
                  setState(() => budget = '6,000 ج.م');
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    String dateText = '${selectedDate.day} ${[
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
    ][selectedDate.month - 1]}، ${selectedDate.year}';
    return Scaffold(
      backgroundColor: backgroundColor,
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          children: [
            const Text(
              'خطط رحلتك الذكية',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'أخبرنا عن رحلتك، وسنصمم لك خطة مفصلة بالذكاء الاصطناعي',
              style: TextStyle(fontSize: 12, color: greyText, height: 1.4),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '1. تفاصيل السفر',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 16),
                  PlannerField(
                    label: 'الوجهة',
                    value: selectedDestination,
                    icon: Icons.location_on_outlined,
                    onTap: openDestinationSheet,
                  ),
                  const SizedBox(height: 10),
                  PlannerField(
                    label: 'تاريخ السفر',
                    value: dateText,
                    icon: Icons.calendar_today_outlined,
                    onTap: openDateSheet,
                  ),
                  const SizedBox(height: 10),
                  PlannerField(
                    label: 'مدة الرحلة',
                    value: '$duration أيام',
                    icon: Icons.nights_stay_outlined,
                    onTap: openDurationSheet,
                  ),
                  const SizedBox(height: 10),
                  PlannerField(
                    label: 'المسافرون والغرف',
                    value: travelers,
                    icon: Icons.people_outline,
                    onTap: openTravelersSheet,
                  ),
                  const SizedBox(height: 10),
                  PlannerField(
                    label: 'ميزانية الرحلة',
                    value: budget,
                    icon: Icons.account_balance_wallet_outlined,
                    onTap: openBudgetSheet,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '2. ما الذي تحب اكتشافه؟',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'اختر ما يهمك لنخصص لك التجربة',
                    style: TextStyle(fontSize: 11, color: greyText),
                  ),
                  const SizedBox(height: 14),
                  VerticalCheckBox(
                    text: 'الثقافة والتاريخ',
                    selected: interests.contains('الثقافة والتاريخ'),
                    onTap: () {
                      setState(() {
                        if (interests.contains('الثقافة والتاريخ')) {
                          interests.remove('الثقافة والتاريخ');
                        } else {
                          interests.add('الثقافة والتاريخ');
                        }
                      });
                    },
                  ),
                  VerticalCheckBox(
                    text: 'الطبيعة والمغامرات',
                    selected: interests.contains('الطبيعة والمغامرات'),
                    onTap: () {
                      setState(() {
                        if (interests.contains('الطبيعة والمغامرات')) {
                          interests.remove('الطبيعة والمغامرات');
                        } else {
                          interests.add('الطبيعة والمغامرات');
                        }
                      });
                    },
                  ),
                  VerticalCheckBox(
                    text: 'الاسترخاء والشواطئ',
                    selected: interests.contains('الاسترخاء والشواطئ'),
                    onTap: () {
                      setState(() {
                        if (interests.contains('الاسترخاء والشواطئ')) {
                          interests.remove('الاسترخاء والشواطئ');
                        } else {
                          interests.add('الاسترخاء والشواطئ');
                        }
                      });
                    },
                  ),
                  VerticalCheckBox(
                    text: 'تذوق الطعام',
                    selected: interests.contains('تذوق الطعام'),
                    onTap: () {
                      setState(() {
                        if (interests.contains('تذوق الطعام')) {
                          interests.remove('تذوق الطعام');
                        } else {
                          interests.add('تذوق الطعام');
                        }
                      });
                    },
                  ),
                  VerticalCheckBox(
                    text: 'التسوق',
                    selected: interests.contains('التسوق'),
                    onTap: () {
                      setState(() {
                        if (interests.contains('التسوق')) {
                          interests.remove('التسوق');
                        } else {
                          interests.add('التسوق');
                        }
                      });
                    },
                  ),
                  VerticalCheckBox(
                    text: 'الحياة الليلية',
                    selected: interests.contains('الحياة الليلية'),
                    onTap: () {
                      setState(() {
                        if (interests.contains('الحياة الليلية')) {
                          interests.remove('الحياة الليلية');
                        } else {
                          interests.add('الحياة الليلية');
                        }
                      });
                    },
                  ),
                  VerticalCheckBox(
                    text: 'الفن والعمارة',
                    selected: interests.contains('الفن والعمارة'),
                    onTap: () {
                      setState(() {
                        if (interests.contains('الفن والعمارة')) {
                          interests.remove('الفن والعمارة');
                        } else {
                          interests.add('الفن والعمارة');
                        }
                      });
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '3. طريقة السفر',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'إيقاع الرحلة',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  VerticalCheckBox(
                    text: 'هادئة',
                    selected: pace == 'هادئة',
                    onTap: () => setState(() => pace = 'هادئة'),
                  ),
                  VerticalCheckBox(
                    text: 'متوازنة',
                    selected: pace == 'متوازنة',
                    onTap: () => setState(() => pace = 'متوازنة'),
                  ),
                  VerticalCheckBox(
                    text: 'مكثفة',
                    selected: pace == 'مكثفة',
                    onTap: () => setState(() => pace = 'مكثفة'),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'وسيلة النقل',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  VerticalCheckBox(
                    text: 'مشي',
                    selected: transport == 'مشي',
                    onTap: () => setState(() => transport = 'مشي'),
                  ),
                  VerticalCheckBox(
                    text: 'مواصلات عامة',
                    selected: transport == 'مواصلات عامة',
                    onTap: () => setState(() => transport = 'مواصلات عامة'),
                  ),
                  VerticalCheckBox(
                    text: 'سيارة مع سائق',
                    selected: transport == 'سيارة مع سائق',
                    onTap: () => setState(() => transport = 'سيارة مع سائق'),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'نوع الإقامة',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  VerticalCheckBox(
                    text: 'فندق 3 نجوم',
                    selected: accommodation == 'فندق 3 نجوم',
                    onTap: () => setState(() => accommodation = 'فندق 3 نجوم'),
                  ),
                  VerticalCheckBox(
                    text: 'فندق 4 نجوم',
                    selected: accommodation == 'فندق 4 نجوم',
                    onTap: () => setState(() => accommodation = 'فندق 4 نجوم'),
                  ),
                  VerticalCheckBox(
                    text: 'فندق 5 نجوم',
                    selected: accommodation == 'فندق 5 نجوم',
                    onTap: () => setState(() => accommodation = 'فندق 5 نجوم'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '4. تفاصيل إضافية',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'هل هناك شيء خاص تود إضافته؟',
                    style: TextStyle(fontSize: 11, color: greyText),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: notesController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText: 'مثال: أفضل المطاعم الشعبية، أماكن للتصوير...',
                      hintStyle: const TextStyle(fontSize: 11, color: greyText),
                      filled: true,
                      fillColor: backgroundColor,
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: lightBorder),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: navy),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'وجهتك على الخريطة',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: Image.network(
                      mapImage,
                      height: 180,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: () {
                  if (interests.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                            'اختاري اهتمامًا واحدًا على الأقل لتجهيز خطتك.'),
                      ),
                    );
                    return;
                  }
                  showBuildingPlanDialog(
                    context,
                    destination: selectedDestination,
                    date: dateText,
                    duration: duration,
                    travelers: travelers,
                    budget: budget,
                    interests: List<String>.from(interests),
                    pace: pace,
                    transport: transport,
                    accommodation: accommodation,
                    notes: notesController.text.trim(),
                  );
                },
                icon: const Icon(Icons.auto_awesome, size: 18),
                label: const Text(
                  'جهز لي الخطة الآن',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: navy,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
