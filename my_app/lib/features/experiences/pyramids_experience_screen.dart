import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/checkout_screen.dart';
import 'package:my_app/features/experiences/widgets/pyramids_widgets.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/trips/share_trip_sheet.dart';

class PyramidsExperienceScreen extends StatefulWidget {
  const PyramidsExperienceScreen({super.key});

  @override
  State<PyramidsExperienceScreen> createState() =>
      _PyramidsExperienceScreenState();
}

class _PyramidsExperienceScreenState extends State<PyramidsExperienceScreen> {
  bool isSaved = false;
  DateTime selectedDate = DateTime(2027, 3, 15);
  int participants = 2;

  final List<int> participantsOptions = [1, 2, 3, 4, 5, 6];

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

  int get total => 650 * participants;

  Future<void> _pickDate() async {
    // لا نسمح باختيار تاريخ مضى، ونبدأ من التاريخ المحدد حاليًا
    // أو من تاريخ اليوم إذا كان التاريخ المحدد أقدم من اليوم.
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final initial = selectedDate.isBefore(today) ? today : selectedDate;

    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: today,
      lastDate: DateTime(today.year + 5, 12, 31),
      helpText: 'اختاري تاريخ الجولة',
      cancelText: 'إلغاء',
      confirmText: 'تأكيد',
      builder: (context, child) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: Theme(
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
                todayForegroundColor: WidgetStateProperty.all(navy),
                todayBorder: const BorderSide(color: navy),
                dayForegroundColor: WidgetStateProperty.all(textColor),
                yearForegroundColor: WidgetStateProperty.all(textColor),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
            ),
            child: child!,
          ),
        );
      },
    );

    if (picked != null && mounted) {
      setState(() {
        selectedDate = DateTime(picked.year, picked.month, picked.day);
      });
    }
  }

  void _pickParticipants() {
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
                const Text('المشاركون',
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
            ...participantsOptions.map((n) => InkWell(
                  onTap: () {
                    setState(() => participants = n);
                    Navigator.pop(context);
                  },
                  child: Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: participants == n
                          ? lightBlueBg
                          : const Color(0xFFF8FBFF),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: participants == n ? navy : lightBorder),
                    ),
                    child: Text('$n مشارك',
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: participants == n
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

  void _showPyramidsReviews() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) => DraggableScrollableSheet(
        initialChildSize: 0.75,
        builder: (context, controller) => Container(
          decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: SingleChildScrollView(
            controller: controller,
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'تجارب المسافرين',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(sheetContext),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: backgroundColor,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Column(
                          children: [
                            Text('128',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: textColor,
                                )),
                            Text('المراجعات',
                                style:
                                    TextStyle(color: greyText, fontSize: 12)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: backgroundColor,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Column(
                          children: [
                            Text('4.8 / 5',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: textColor,
                                )),
                            Text('التقييم',
                                style:
                                    TextStyle(color: greyText, fontSize: 12)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _pyramidsReviewCard(
                  'وسام',
                  5,
                  'تجربة رائعة وتنظيم واضح. التوقيت مناسب واستمتعنا بالزيارة. الموقع مميز.',
                ),
                _pyramidsReviewCard(
                  'أحمد',
                  5,
                  'ساعدتنا على اختيار تجربة مناسبة للعائلة.',
                ),
                _pyramidsReviewCard(
                  'أحمد',
                  4,
                  'مناسب لرحلة قصيرة في القاهرة.',
                ),
                _pyramidsReviewCard(
                  'أحمد',
                  4,
                  'التجربة ممتعة والمرشد كان متعاوناً والتنظيم ممتاز.',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _pyramidsReviewCard(String name, int stars, String review) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: navy,
                child:
                    Text(name[0], style: const TextStyle(color: Colors.white)),
              ),
              const SizedBox(width: 10),
              Text(name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  )),
              const Spacer(),
              Row(
                children: List.generate(
                  stars,
                  (_) => const Icon(Icons.star, color: gold, size: 14),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(review,
              style:
                  const TextStyle(color: greyText, fontSize: 13, height: 1.5)),
        ],
      ),
    );
  }

  void _showInfoDialog(String title, String body) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(title,
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 16, color: textColor)),
        content: Text(body,
            style: const TextStyle(fontSize: 13, color: greyText, height: 1.6)),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('تمام',
                  style: TextStyle(color: navy, fontWeight: FontWeight.bold)))
        ],
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
                    const Text('أهرامات الجيزة وأبو الهول',
                        style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 4),
                    const Text('جولة ثقافية بصحبة مرشد - 4 ساعات',
                        style: TextStyle(fontSize: 13, color: greyText)),
                    const SizedBox(height: 14),
                    Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            'https://media1.thrillophilia.com/filestore/q2lvjcedu42fyol0ols7wp2qkcpd_shutterstock_1453404374.jpg',
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                Image.network(
                              'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1200&q=85',
                              height: 200,
                              width: double.infinity,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Container(
                                height: 200,
                                width: double.infinity,
                                color: lightBlueBg,
                                alignment: Alignment.center,
                                child: const Icon(
                                    Icons.image_not_supported_outlined,
                                    color: greyText,
                                    size: 40),
                              ),
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 12,
                          left: 12,
                          child: ElevatedButton(
                            onPressed: () => ScaffoldMessenger.of(context)
                                .showSnackBar(const SnackBar(
                                    content: Text('معرض الصور قريباً'))),
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

                    // ===== 2. اقترب من عجائب مصر القديمة =====
                    const Text('اقترب من عجائب مصر القديمة',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 8),
                    const Text(
                      'اكتشف هضبة الجيزة وأبو الهول مع مرشد يتحدث العربية، تبدأ الجولة من نقطة التجمع وتتضمن وقتاً للتصوير والاستراحة والوصول قبل الموعد بـ 15 دقيقة.',
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
                              Icon(Icons.schedule_outlined,
                                  color: navy, size: 20),
                              SizedBox(height: 6),
                              Text('4 ساعات',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                      color: textColor)),
                              Text('المدة',
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
                              Icon(Icons.star, color: navy, size: 20),
                              SizedBox(height: 6),
                              Text('4.8 / 5',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                      color: textColor)),
                              Text('التقييم',
                                  style:
                                      TextStyle(fontSize: 11, color: greyText)),
                            ]),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // ===== 3. يشمل السعر - زي Figma بالظبط =====
                    const Text('يشمل السعر',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 8),
                    const Text(
                      'مرشد عربي، تذكرة دخول المنطقة الأثرية، مياه للشرب. دخول الهرم من الداخل وركوب الجمال غير مشمولين.',
                      style:
                          TextStyle(fontSize: 13, color: greyText, height: 1.6),
                    ),
                    const SizedBox(height: 16),

                    // ===== برنامج الجولة / التقييمات / سياسة الإلغاء - كلهم بيتضغطوا =====
                    PyramidsLinkCard(
                      icon: Icons.schedule_outlined,
                      title: 'برنامج الجولة',
                      sub:
                          '9:00 ص - التجمع والانطلاق | 10:00 ص - زيارة الأهرامات وأبو الهول | 12:00 م - وقت للتصوير والاستراحة',
                      onTap: () => _showInfoDialog('برنامج الجولة',
                          '9:00 ص - التجمع والانطلاق\n10:00 ص - زيارة الأهرامات وأبو الهول\n12:00 م - وقت للتصوير والاستراحة\n1:00 م - نهاية الجولة والعودة'),
                    ),
                    PyramidsLinkCard(
                      icon: Icons.star_border,
                      title: 'التقييمات',
                      sub: '4.8 من 5 - تقييم الزوار للتجربة والمرشد',
                      onTap: _showPyramidsReviews,
                    ),
                    PyramidsLinkCard(
                      icon: Icons.event_busy_outlined,
                      title: 'سياسة الإلغاء',
                      sub: 'إلغاء مجاني قبل 24 ساعة من موعد الجولة',
                      onTap: () => showTravoraCancellationPolicy(context),
                    ),
                    const SizedBox(height: 20),

                    // ===== نقطة التجمع + الخريطة =====
                    const Text('نقطة التجمع',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 8),
                    const Text('بوابة هضبة الأهرامات الرئيسية - الجيزة',
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: textColor)),
                    const SizedBox(height: 4),
                    const Text('راجع التذكرة بعد التأكيد لمعرفة تعليمات الوصول',
                        style: TextStyle(
                            fontSize: 12, color: greyText, height: 1.5)),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                          'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80',
                          height: 170,
                          width: double.infinity,
                          fit: BoxFit.cover),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      height: 44,
                      child: OutlinedButton(
                          onPressed: () => ScaffoldMessenger.of(context)
                              .showSnackBar(const SnackBar(
                                  content: Text('فتح الخريطة قريباً'))),
                          style: OutlinedButton.styleFrom(
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12))),
                          child: const Text('فتح الخريطة',
                              style: TextStyle(
                                  color: navy, fontWeight: FontWeight.bold))),
                    ),
                    const SizedBox(height: 20),

                    // ===== السعر + تاريخ الجولة + المشاركون + الإجمالي =====
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                          color: whiteCard,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: lightBorder)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('650 ج.م / شخص',
                              style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: navy)),
                          const SizedBox(height: 14),
                          // تاريخ الجولة - بيتضغط وبيفتح التقويم
                          PyramidsSelectField(
                              icon: Icons.calendar_today_outlined,
                              label: 'تاريخ الجولة',
                              value: _formatDate(selectedDate),
                              onTap: _pickDate),
                          const SizedBox(height: 10),
                          // المشاركون - بيتضغط وبيفتح الاختيارات
                          PyramidsSelectField(
                              icon: Icons.group_outlined,
                              label: 'المشاركون',
                              value: '$participants مشارك',
                              onTap: _pickParticipants),
                          const SizedBox(height: 14),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                                color: lightBlueBg,
                                borderRadius: BorderRadius.circular(12)),
                            child: Column(children: [
                              Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('إجمالي التجربة',
                                        style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: textColor)),
                                    Text('$total ج.م',
                                        style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                            color: navy)),
                                  ]),
                              const SizedBox(height: 4),
                              Text(
                                  '650 ج.م × $participants مشارك - جميع الرسوم مشمولة',
                                  style: const TextStyle(
                                      fontSize: 11, color: greyText)),
                            ]),
                          ),
                          const SizedBox(height: 14),
                          // احجز التجربة
                          SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => CheckoutScreen(
                                      title: 'جولة الأهرامات وأبو الهول',
                                      image: pyramidsImage,
                                      guide: 'مرشد عربي',
                                      date: _formatDate(selectedDate),
                                      time: '9:00 صباحاً',
                                      hours: 4,
                                      pricePerPerson: 650,
                                      travelers: participants,
                                    ),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: navy,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                              child: Text('احجز التجربة - $total ج.م',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold)),
                            ),
                          ),
                          const SizedBox(height: 10),
                          // احفظ التجربة
                          SizedBox(
                            width: double.infinity,
                            height: 48,
                            child: OutlinedButton.icon(
                              onPressed: () {
                                setState(() => isSaved = !isSaved);
                                ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                        content: Text(isSaved
                                            ? 'تم حفظ التجربة ✅'
                                            : 'تم إلغاء حفظ التجربة')));
                              },
                              icon: Icon(
                                  isSaved
                                      ? Icons.favorite
                                      : Icons.favorite_border,
                                  size: 18,
                                  color: navy),
                              label: Text(
                                  isSaved ? 'تم حفظ التجربة' : 'احفظ التجربة',
                                  style: const TextStyle(
                                      color: navy,
                                      fontWeight: FontWeight.bold)),
                              style: OutlinedButton.styleFrom(
                                  backgroundColor: whiteCard,
                                  side: const BorderSide(color: lightBorder),
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                            ),
                          ),
                        ],
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
                          onPressed: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const SupportScreen())),
                          child: const Text('دعم على مدار الساعة',
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
