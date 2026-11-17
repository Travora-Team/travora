import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/destinations/widgets/destination_widgets.dart';
import 'package:my_app/features/experiences/pyramids_experience_screen.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/trips/trip_planner_screen.dart';

class CairoDetailScreen extends StatefulWidget {
  const CairoDetailScreen({super.key});

  @override
  State<CairoDetailScreen> createState() => _CairoDetailScreenState();
}

class _CairoDetailScreenState extends State<CairoDetailScreen> {
  bool isSaved = false;
  DateTime selectedDate = DateTime.now().add(const Duration(days: 1));
  String selectedTravelers = '2 بالغ - غرفة واحدة';

  final List<String> travelerOptions = [
    '1 بالغ - غرفة واحدة',
    '2 بالغ - غرفة واحدة',
    '2 بالغ + طفل - غرفة واحدة',
  ];

  String _formatDate(DateTime d) {
    const months = [
      '',
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
    return '${d.day} ${months[d.month]} ${d.year}';
  }

  Future<void> _pickDate() async {
    final today = DateUtils.dateOnly(DateTime.now());
    final lastAllowedDate = DateTime(today.year + 5, today.month, today.day);
    final safeInitialDate = selectedDate.isBefore(today)
        ? today
        : selectedDate.isAfter(lastAllowedDate)
            ? lastAllowedDate
            : selectedDate;

    final picked = await showDatePicker(
      context: context,
      initialDate: safeInitialDate,
      firstDate: today,
      lastDate: lastAllowedDate,
      currentDate: today,
      locale: const Locale('ar'),
      helpText: 'اختاري موعد السفر',
      cancelText: 'إلغاء',
      confirmText: 'تأكيد',
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
                  primary: navy,
                  onPrimary: Colors.white,
                  surface: whiteCard,
                  onSurface: textColor,
                ),
            datePickerTheme: DatePickerThemeData(
              backgroundColor: whiteCard,
              headerBackgroundColor: navy,
              headerForegroundColor: Colors.white,
              todayForegroundColor: MaterialStateProperty.all(navy),
              todayBorder: const BorderSide(color: navy),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
          child: child!,
        );
      },
    );

    if (!mounted) return;
    if (picked != null) {
      setState(() => selectedDate = picked);
    }
  }

  void _pickTravelers() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('المسافرون والغرف',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: textColor)),
                IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, size: 20, color: greyText)),
              ],
            ),
            const SizedBox(height: 12),
            ...travelerOptions.map((t) => InkWell(
                  onTap: () {
                    setState(() => selectedTravelers = t);
                    Navigator.pop(context);
                  },
                  child: Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: selectedTravelers == t
                          ? lightBlueBg
                          : const Color(0xFFF8FBFF),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: selectedTravelers == t ? navy : lightBorder),
                    ),
                    child: Text(t,
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: selectedTravelers == t
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: textColor)),
                  ),
                )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ===== 1. العنوان + الصورة =====
                    const Text('القاهرة... حكاية تستحق الزيارة',
                        style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 4),
                    const Text('مصر، ثقافة ونيل',
                        style: TextStyle(fontSize: 13, color: greyText)),
                    const SizedBox(height: 14),
                    Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                              'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80',
                              height: 200,
                              width: double.infinity,
                              fit: BoxFit.cover),
                        ),
                        Positioned(
                          bottom: 12,
                          left: 12,
                          child: ElevatedButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                      content: Text('معرض الصور قريباً')));
                            },
                            style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: navy,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10))),
                            child: const Text('عرض الصور',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // ===== 2. عن القاهرة - كلام ثابت =====
                    const Text('عن القاهرة',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 8),
                    const Text(
                      'من أهرامات الجيزة إلى أسواق القاهرة القديمة، اجمع المعالم التاريخية والتجارب المحلية في رحلة تناسب وقتك وميزانيتك.',
                      style:
                          TextStyle(fontSize: 13, color: greyText, height: 1.6),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                                color: whiteCard,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: lightBorder)),
                            child: const Column(children: [
                              Icon(Icons.calendar_month_outlined,
                                  color: navy, size: 20),
                              SizedBox(height: 6),
                              Text('أكتوبر - أبريل',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                      color: textColor)),
                              Text('وقت مناسب',
                                  style:
                                      TextStyle(fontSize: 11, color: greyText)),
                            ]),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                                color: whiteCard,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: lightBorder)),
                            child: const Column(children: [
                              Icon(Icons.schedule_outlined,
                                  color: navy, size: 20),
                              SizedBox(height: 6),
                              Text('4 أيام',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                      color: textColor)),
                              Text('مدة مقترحة',
                                  style:
                                      TextStyle(fontSize: 11, color: greyText)),
                            ]),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // ===== 3. ما الذي يمكن اكتشافه =====
                    const Text('ما الذي يمكن اكتشافه؟',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 12),
                    CairoPlaceCard(
                      icon: Icons.location_on_outlined,
                      title: 'أهرامات الجيزة',
                      sub: 'جولة ثقافية وتصوير',
                      price: 'من 650 ج.م',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const PyramidsExperienceScreen(),
                          ),
                        );
                      },
                    ),
                    CairoPlaceCard(
                      icon: Icons.museum_outlined,
                      title: 'القاهرة القديمة',
                      sub: 'خان الخليلي وشارع المعز',
                      price: 'جولة ثقافية',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const CairoDetailScreen(),
                          ),
                        );
                      },
                    ),
                    CairoPlaceCard(
                      icon: Icons.hotel_outlined,
                      title: 'إقامة بإطلالة على النيل',
                      sub: 'فندق على النيل بإطلالة مميزة',
                      price: 'إقامة مميزة',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const CairoDetailScreen(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 20),

                    // ===== 4. تجهيز رحلتك - سكشن باللون =====
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                          color: lightBlueBg,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: lightBorder)),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('تجهيز رحلتك',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: textColor)),
                          SizedBox(height: 4),
                          Text('اختار تواريخك والمسافرين',
                              style: TextStyle(fontSize: 12, color: greyText)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // ===== 5. موعد السفر - بيتضغط وبيفتح التقويم =====
                    CairoSelectField(
                      icon: Icons.calendar_today_outlined,
                      label: 'موعد السفر',
                      value: _formatDate(selectedDate),
                      onTap: _pickDate,
                    ),
                    const SizedBox(height: 10),

                    // ===== المسافرون - بيتضغط وبيفتح الاختيارات =====
                    CairoSelectField(
                      icon: Icons.group_outlined,
                      label: 'المسافرون',
                      value: selectedTravelers,
                      onTap: _pickTravelers,
                    ),
                    const SizedBox(height: 14),

                    // ===== زرار خطط رحلتي إلى القاهرة =====
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const TripPlannerScreen()));
                        },
                        icon: const Icon(Icons.auto_awesome, size: 18),
                        label: const Text('خطط رحلتي إلى القاهرة',
                            style: TextStyle(fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                            backgroundColor: navy,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14))),
                      ),
                    ),
                    const SizedBox(height: 10),

                    // ===== زرار احفظ الوجهة =====
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          setState(() => isSaved = !isSaved);
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(isSaved
                                  ? 'تم حفظ الوجهة ✅'
                                  : 'تم إلغاء حفظ الوجهة')));
                        },
                        icon: Icon(
                            isSaved ? Icons.favorite : Icons.favorite_border,
                            size: 18,
                            color: navy),
                        label: Text(isSaved ? 'تم حفظ الوجهة' : 'احفظ الوجهة',
                            style: const TextStyle(
                                color: navy, fontWeight: FontWeight.bold)),
                        style: OutlinedButton.styleFrom(
                            backgroundColor: whiteCard,
                            side: const BorderSide(color: lightBorder),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12))),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // ===== تحتاج مساعدة في الاختيار =====
                    Container(
                      padding: const EdgeInsets.all(16),
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
                            child: const Icon(Icons.support_agent_outlined,
                                color: navy, size: 22)),
                        const SizedBox(width: 12),
                        const Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                              Text('تحتاج مساعدة في الاختيار؟',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                      color: textColor)),
                              SizedBox(height: 2),
                              Text('فريق الدعم يساعدك في تفاصيل رحلتك',
                                  style:
                                      TextStyle(fontSize: 12, color: greyText)),
                            ])),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const SupportScreen()));
                          },
                          child: const Text('تواصل معنا',
                              style: TextStyle(
                                  color: navy,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12)),
                        ),
                      ]),
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ==================== PYRAMIDS EXPERIENCE SCREEN ====================
