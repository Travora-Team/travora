import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/destinations/cairo_detail_screen.dart';
import 'package:my_app/features/experiences/pyramids_experience_screen.dart';
import 'package:my_app/features/experiences/widgets/explore_widgets.dart';
import 'package:my_app/features/info/faq_screen.dart';
import 'package:my_app/features/trips/trip_planner_screen.dart';

class ExploreActivitiesScreen extends StatefulWidget {
  const ExploreActivitiesScreen({super.key});

  @override
  State<ExploreActivitiesScreen> createState() =>
      _ExploreActivitiesScreenState();
}

class _ExploreActivitiesScreenState extends State<ExploreActivitiesScreen> {
  String selectedDestination = 'القاهرة القديمة';
  DateTime selectedDate = DateTime(2027, 3, 15);
  String selectedTravelers = '2 بالغ - غرفة واحدة';
  String selectedInterest = 'الكل';
  String sortBy = 'الأعلى تقييماً';
  bool isPyramidsFav = false;
  bool isOldCairoFav = false;
  bool isAddedToPlan = false;

  final List<String> destinations = [
    'القاهرة',
    'الجيزة',
    'القاهرة القديمة',
    'الأقصر',
    'شرم الشيخ'
  ];
  final List<String> travelersOptions = [
    '1 بالغ - غرفة واحدة',
    '2 بالغ - غرفة واحدة',
    '2 بالغ + طفل - غرفة واحدة',
    '4 بالغون - غرفتين'
  ];
  final List<String> interests = [
    'الكل',
    'آثار وتاريخ',
    'طعام وتجارب محلية',
    'تسوق',
    'مغامرات',
    'طبيعة واستجمام'
  ];
  final List<String> sortOptions = [
    'الأعلى تقييماً',
    'الأقل سعراً',
    'الأعلى سعراً'
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

  void _pickDestination() {
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
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('اختر وجهتك',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: textColor)),
                IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, size: 20, color: greyText)),
              ]),
              const SizedBox(height: 4),
              const Text('اختر الوجهة التي تريد منها رحلتك',
                  style: TextStyle(fontSize: 12, color: greyText)),
              const SizedBox(height: 12),
              ...destinations.map((d) => InkWell(
                    onTap: () {
                      setState(() => selectedDestination = d);
                      Navigator.pop(context);
                    },
                    child: Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                          color: selectedDestination == d
                              ? lightBlueBg
                              : const Color(0xFFF8FBFF),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                              color: selectedDestination == d
                                  ? navy
                                  : lightBorder)),
                      child: Text(d,
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: selectedDestination == d
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                              color: textColor)),
                    ),
                  )),
            ]),
      ),
    );
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
        context: context,
        initialDate: selectedDate,
        firstDate: DateTime(2025),
        lastDate: DateTime(2030),
        locale: const Locale('ar'));
    if (picked != null) setState(() => selectedDate = picked);
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
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('المسافرون والغرف',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: textColor)),
                IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, size: 20, color: greyText)),
              ]),
              const SizedBox(height: 12),
              ...travelersOptions.map((t) => InkWell(
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
                              color:
                                  selectedTravelers == t ? navy : lightBorder)),
                      child: Text(t,
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: selectedTravelers == t
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                              color: textColor)),
                    ),
                  )),
            ]),
      ),
    );
  }

  void _showSortSheet() {
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
              const Text('ترتيب الأنشطة',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor)),
              const SizedBox(height: 12),
              ...sortOptions.map((s) => InkWell(
                    onTap: () {
                      setState(() => sortBy = s);
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('تم الترتيب حسب: $s')));
                    },
                    child: Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                          color: sortBy == s
                              ? lightBlueBg
                              : const Color(0xFFF8FBFF),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                              color: sortBy == s ? navy : lightBorder)),
                      child: Text(s,
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: sortBy == s
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                              color: textColor)),
                    ),
                  )),
            ]),
      ),
    );
  }

  void _showFilterSheet() {
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
              const Text('تصفية الأنشطة',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor)),
              const SizedBox(height: 4),
              const Text('اختر اهتمامك لتصفية الأنشطة',
                  style: TextStyle(fontSize: 12, color: greyText)),
              const SizedBox(height: 12),
              Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: interests
                      .map((i) => ChoiceChip(
                            label: Text(i,
                                style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: selectedInterest == i
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                    color: selectedInterest == i
                                        ? Colors.white
                                        : textColor)),
                            selected: selectedInterest == i,
                            selectedColor: navy,
                            backgroundColor: const Color(0xFFF8FBFF),
                            onSelected: (_) {
                              setState(() => selectedInterest = i);
                              Navigator.pop(context);
                            },
                          ))
                      .toList()),
            ]),
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
                      // ===== 1. عيش تجربة جديدة =====
                      const Text('عيش تجربة جديدة',
                          style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      const SizedBox(height: 4),
                      const Text('ثقافة، طعم، واكتشاف - اختر ما يناسبك',
                          style: TextStyle(fontSize: 13, color: greyText)),
                      const SizedBox(height: 16),

                      // ===== 2. الوجهة / التاريخ / المشاركون =====
                      ExploreField(
                          icon: Icons.location_on_outlined,
                          label: 'الوجهة',
                          value: selectedDestination,
                          onTap: _pickDestination),
                      const SizedBox(height: 10),
                      ExploreField(
                          icon: Icons.calendar_today_outlined,
                          label: 'التاريخ',
                          value: _formatDate(selectedDate),
                          onTap: _pickDate),
                      const SizedBox(height: 10),
                      ExploreField(
                          icon: Icons.group_outlined,
                          label: 'المشاركون',
                          value: selectedTravelers,
                          onTap: _pickTravelers),
                      const SizedBox(height: 14),

                      // ===== 3. ابحث عن تجربة =====
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () => ScaffoldMessenger.of(context)
                              .showSnackBar(SnackBar(
                                  content: Text(
                                      'جارٍ البحث عن تجارب في $selectedDestination - ${_formatDate(selectedDate)} - $selectedTravelers'))),
                          style: ElevatedButton.styleFrom(
                              backgroundColor: navy,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12))),
                          child: const Text('ابحث عن تجربة',
                              style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(children: [
                        Expanded(
                            child: SizedBox(
                                height: 44,
                                child: OutlinedButton(
                                    onPressed: _showFilterSheet,
                                    style: OutlinedButton.styleFrom(
                                        shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(12))),
                                    child: const Text('تصفية الأنشطة',
                                        style: TextStyle(
                                            color: navy,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 12))))),
                        const SizedBox(width: 10),
                        Expanded(
                            child: SizedBox(
                                height: 44,
                                child: OutlinedButton(
                                    onPressed: _showSortSheet,
                                    style: OutlinedButton.styleFrom(
                                        shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(12))),
                                    child: Text('ترتيب الأنشطة: $sortBy',
                                        style: const TextStyle(
                                            color: navy,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 11))))),
                      ]),
                      const SizedBox(height: 20),

                      // ===== 4. اهتماماتك =====
                      const Text('اهتماماتك',
                          style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      const SizedBox(height: 4),
                      const Text('اختر اهتمامك لتصفية الأنشطة',
                          style: TextStyle(fontSize: 12, color: greyText)),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: interests
                            .map((i) => ChoiceChip(
                                  label: Text(i,
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: selectedInterest == i
                                              ? FontWeight.bold
                                              : FontWeight.normal,
                                          color: selectedInterest == i
                                              ? Colors.white
                                              : textColor)),
                                  selected: selectedInterest == i,
                                  selectedColor: navy,
                                  backgroundColor: whiteCard,
                                  side: const BorderSide(color: lightBorder),
                                  onSelected: (_) =>
                                      setState(() => selectedInterest = i),
                                ))
                            .toList(),
                      ),
                      const SizedBox(height: 20),

                      // ===== 5. تجربة ثقافية مقترحة =====
                      const Text('تجربة ثقافية مقترحة',
                          style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      const SizedBox(height: 12),
                      ActivityCard(
                        img:
                            'https://media1.thrillophilia.com/filestore/q2lvjcedu42fyol0ols7wp2qkcpd_shutterstock_1453404374.jpg',
                        title: 'أهرامات الجيزة وأبو الهول',
                        info: '4.8 ★ - مرشد عربي - جولة 4 ساعات',
                        price: '650 ج.م / شخص',
                        isFav: isPyramidsFav,
                        onFav: () {
                          setState(() => isPyramidsFav = !isPyramidsFav);
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(isPyramidsFav
                                  ? 'تمت الإضافة إلى المفضلة ✅'
                                  : 'تمت الإزالة من المفضلة')));
                        },
                        onDetails: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) =>
                                    const PyramidsExperienceScreen())),
                      ),
                      ActivityCard(
                        img:
                            'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=900&q=80',
                        title: 'القاهرة القديمة وخان الخليلي',
                        info: '4.7 ★ - جولة ثقافية - جولة 3 ساعات',
                        price: '450 ج.م / شخص',
                        isFav: isOldCairoFav,
                        onFav: () {
                          setState(() => isOldCairoFav = !isOldCairoFav);
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(isOldCairoFav
                                  ? 'تمت الإضافة إلى المفضلة ✅'
                                  : 'تمت الإزالة من المفضلة')));
                        },
                        onDetails: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const CairoDetailScreen(),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // ===== 6. القاهرة القديمة على مهل =====
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                            color: whiteCard,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: lightBorder)),
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Image.network(
                                      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=900&q=80',
                                      height: 150,
                                      width: double.infinity,
                                      fit: BoxFit.cover)),
                              const SizedBox(height: 12),
                              const Text('القاهرة القديمة على مهل',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: textColor)),
                              const SizedBox(height: 4),
                              const Text(
                                  'أضف تجارب محلية إلى خطتك واستمتع بوقتك على مهل، بدون استعجال',
                                  style: TextStyle(
                                      fontSize: 12,
                                      color: greyText,
                                      height: 1.5)),
                              const SizedBox(height: 12),
                              SizedBox(
                                width: double.infinity,
                                height: 44,
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) =>
                                            const TripPlannerScreen(),
                                      ),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                      backgroundColor: navy,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(12))),
                                  child: const Text('أضف تجارب محلية إلى خطتي',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13)),
                                ),
                              ),
                            ]),
                      ),
                      const SizedBox(height: 20),

                      // ===== 7. اكتشف الأنشطة القريبة =====
                      const Text('اكتشف الأنشطة القريبة',
                          style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      const SizedBox(height: 4),
                      const Text('أنشطة قريبة من موقعك الحالي',
                          style: TextStyle(fontSize: 12, color: greyText)),
                      const SizedBox(height: 12),
                      ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                              'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80',
                              height: 170,
                              width: double.infinity,
                              fit: BoxFit.cover)),
                      const SizedBox(height: 10),
                      SizedBox(
                          width: double.infinity,
                          height: 44,
                          child: OutlinedButton(
                              onPressed: () => ScaffoldMessenger.of(context)
                                  .showSnackBar(const SnackBar(
                                      content:
                                          Text('فتح خريطة الأنشطة قريباً'))),
                              style: OutlinedButton.styleFrom(
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                              child: const Text('فتح خريطة الأنشطة',
                                  style: TextStyle(
                                      color: navy,
                                      fontWeight: FontWeight.bold)))),
                      const SizedBox(height: 20),

                      // ===== 8. تفاصيل الحجز والمشاركة =====
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: lightBorder)),
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('تفاصيل الحجز والمشاركة',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15,
                                      color: textColor)),
                              const SizedBox(height: 4),
                              const Text('كل تفاصيل حجزك ومشاركتك في مكان واحد',
                                  style:
                                      TextStyle(fontSize: 12, color: greyText)),
                              const SizedBox(height: 12),
                              InkWell(
                                onTap: () => Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (_) => const FaqScreen())),
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                      color: whiteCard,
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(color: lightBorder)),
                                  child: Row(children: [
                                    Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                            color: lightBlueBg,
                                            borderRadius:
                                                BorderRadius.circular(10)),
                                        child: const Icon(Icons.help_outline,
                                            color: navy, size: 20)),
                                    const SizedBox(width: 12),
                                    const Expanded(
                                        child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                          Text('اقرأ الأسئلة الشائعة',
                                              style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 13,
                                                  color: textColor)),
                                          SizedBox(height: 2),
                                          Text('إجابات عن الحجز والتخطيط',
                                              style: TextStyle(
                                                  fontSize: 11,
                                                  color: greyText))
                                        ])),
                                    const Icon(Icons.arrow_back_ios,
                                        size: 14, color: greyText),
                                  ]),
                                ),
                              ),
                            ]),
                      ),
                      const SizedBox(height: 30),
                    ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
