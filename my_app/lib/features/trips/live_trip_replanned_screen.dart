import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/trips/edit_trip_plan_screen.dart';

class LiveTripReplannedScreen extends StatefulWidget {
  final String destination;
  final String date; // جاي من الصفحات اللي قبلها
  final int budget;
  final int spent;

  const LiveTripReplannedScreen({
    super.key,
    this.destination = 'القاهرة',
    this.date = '15 مارس 2027',
    this.budget = 1500,
    this.spent = 880,
  });

  @override
  State<LiveTripReplannedScreen> createState() =>
      _LiveTripReplannedScreenState();
}

class _LiveTripReplannedScreenState extends State<LiveTripReplannedScreen> {
  bool showUpdatedBanner = true;
  bool approved = false;

  int get remaining => widget.budget - widget.spent;
  int get spentPercent => ((widget.spent / widget.budget) * 100).round();

  @override
  void initState() {
    super.initState();
    // البانر يظهر كام ثانية بس زي الفيديو وبعدين يختفي
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) setState(() => showUpdatedBanner = false);
    });
  }

  // ============ شيت حالة المرور الآن ============
  void _showTrafficDetails() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                  width: 45,
                  height: 5,
                  decoration: BoxDecoration(
                      color: lightBorder,
                      borderRadius: BorderRadius.circular(10))),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                const Expanded(
                  child: Text('حالة المرور الآن',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                ),
                InkWell(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                        color: lightBlueBg,
                        borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.close, size: 18, color: textColor),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            const Text('تنبيه مباشر • آخر تحديث 12:05 م',
                style: TextStyle(fontSize: 12, color: greyText)),
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: const Color(0xFFFFEBEE),
                  borderRadius: BorderRadius.circular(14)),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ازدحام شديد على الطريق إلى المتحف',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFC62828),
                          fontSize: 14)),
                  SizedBox(height: 6),
                  Text('الرحلة الآن تستغرق 90 دقيقة بدلاً من 25 دقيقة',
                      style: TextStyle(fontSize: 13, color: textColor)),
                ],
              ),
            ),
            const SizedBox(height: 14),
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.network(mapImage,
                  height: 140, width: double.infinity, fit: BoxFit.cover),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                    child: _trafficStat(
                        'التأخير', '65 دقيقة', const Color(0xFFFF8F00))),
                Expanded(child: _trafficStat('المعتاد', '25 دقيقة', greyText)),
                Expanded(
                    child: _trafficStat(
                        'الآن', '90 دقيقة', const Color(0xFFC62828))),
              ],
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                  color: lightBlueBg, borderRadius: BorderRadius.circular(12)),
              child: const Row(
                children: [
                  Icon(Icons.lightbulb_outline, color: navy, size: 20),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                        'المسار إلى خان الخليلي أسرع الآن.\nزيارة المتحف في 3:00 م تقلل من وقت الانتظار.',
                        style: TextStyle(
                            fontSize: 13, color: textColor, height: 1.5)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  setState(() => approved = true);
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: navy,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14))),
                child: const Text('فهمت، اعتمد الاقتراح'),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  static Widget _trafficStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: greyText)),
        const SizedBox(height: 4),
        Text(value,
            style: TextStyle(
                fontSize: 15, fontWeight: FontWeight.bold, color: color)),
      ],
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
              // ===== بانر تم تحديث خطة رحلتك - بيظهر كام ثانية =====
              if (showUpdatedBanner)
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E9),
                      borderRadius: BorderRadius.circular(14)),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.check,
                            color: Color(0xFF2E7D32), size: 18),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text('تم تحديث خطة رحلتك',
                            style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2E7D32))),
                      ),
                    ],
                  ),
                ),

              // ===== العنوان =====
              const Text('رحلتك تتغير معك',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              Text('رحلة ${widget.destination} • ذكاء الرحلة المباشر',
                  style: const TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 16),

              // ===== 1 - AI Live Trip =====
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: whiteCard, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                              color: lightBlueBg,
                              borderRadius: BorderRadius.circular(10)),
                          child: const Icon(Icons.auto_awesome,
                              color: navy, size: 20),
                        ),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Text('ذكاء الرحلة المباشر - AI Live Trip',
                              style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: textColor)),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                              color: const Color(0xFFE8F5E9),
                              borderRadius: BorderRadius.circular(20)),
                          child: const Text('● مباشر',
                              style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF2E7D32),
                                  fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    const Text(
                        'يتم تحديث خطة اليوم وفقاً للطقس والزحام ومواعيد الأماكن',
                        style: TextStyle(
                            fontSize: 13, color: greyText, height: 1.5)),
                    const SizedBox(height: 4),
                    const Text('آخر تحديث 12:06 م',
                        style: TextStyle(
                            fontSize: 12,
                            color: navy,
                            fontWeight: FontWeight.bold)),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(
                            child: _miniStat(
                                Icons.timer_outlined, 'وقت موفر', '42 دقيقة')),
                        const SizedBox(width: 10),
                        Expanded(
                            child: _miniStat(
                                Icons.traffic_outlined, 'الزحام', 'متوسطة')),
                        const SizedBox(width: 10),
                        Expanded(
                            child: _miniStat(
                                Icons.wb_sunny_outlined, 'الطقس', '27° مشمس')),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ===== 2 - الخريطة الذكية =====
              _sectionTitle('الخريطة الذكية'),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: whiteCard, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                        'ترتيب الرحلة: الأهرامات - خان الخليلي - المتحف - النيل',
                        style: TextStyle(fontSize: 13, color: textColor)),
                    const SizedBox(height: 12),
                    Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: Image.network(mapImage,
                              height: 180,
                              width: double.infinity,
                              fit: BoxFit.cover),
                        ),
                        Positioned(
                            top: 12, right: 12, child: _mapPin('الأهرامات')),
                        Positioned(
                            top: 60, left: 20, child: _mapPin('خان الخليلي')),
                        Positioned(
                            bottom: 50, right: 40, child: _mapPin('المتحف')),
                        Positioned(
                            bottom: 12, left: 40, child: _mapPin('النيل')),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () => ScaffoldMessenger.of(context)
                            .showSnackBar(const SnackBar(
                                content: Text('عرض الخريطة الكاملة'))),
                        style: OutlinedButton.styleFrom(
                            foregroundColor: navy,
                            side: const BorderSide(color: lightBorder),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12))),
                        child: const Text('عرض الخريطة الكاملة'),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ===== 3 - تنبيه مباشر =====
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: const Color(0xFFFFEBEE),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFFFCDD2))),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.warning_amber_rounded,
                            color: Color(0xFFC62828)),
                        const SizedBox(width: 8),
                        const Expanded(
                          child: Text('تنبيه مباشر',
                              style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFFC62828))),
                        ),
                        const Text('12:05 م',
                            style: TextStyle(fontSize: 12, color: greyText)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    const Text('ازدحام شديد على الطريق إلى المتحف',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 6),
                    const Text(
                        'الرحلة الآن تستغرق 90 دقيقة بدلاً من 25 دقيقة.\nنقترح زيارة خان الخليلي أولاً.',
                        style: TextStyle(
                            fontSize: 13, color: textColor, height: 1.6)),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: _showTrafficDetails,
                        style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFFC62828),
                            side: const BorderSide(color: Color(0xFFFFCDD2)),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12))),
                        child: const Text('عرض تفاصيل الزحام'),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ===== 4 - إعادة ترتيب رحلتك =====
              _sectionTitle('إعادة ترتيب رحلتك'),
              const SizedBox(height: 6),
              const Text(
                  'اعتمدنا المرور الحالي لنقل خان الخليلي إلى 12:30 م، وتأجيل المتحف لـ 3:00 م مع الحفاظ على عشاء النيل.',
                  style: TextStyle(fontSize: 13, color: greyText, height: 1.6)),
              const SizedBox(height: 12),
              const Text('الخطة المقترحة الآن',
                  style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              const Text('نفس الأماكن بترتيب يوفر وقتك',
                  style: TextStyle(fontSize: 12, color: greyText)),
              const SizedBox(height: 10),
              _planItem(
                  '1', pyramidsImage, 'أهرامات الجيزة', '09:00', 'زيارة وآثار'),
              _planItem('2', khanImage, 'خان الخليلي', '12:30',
                  'السوق والثقافة المحلية'),
              _planItem('3', luxorImage, 'المتحف المصري', '15:00',
                  'تاريخ وحضارة • بعد تحسين المرور'),
              _planItem('4', sharmImage, 'عشاء على النيل', '18:30',
                  'غداء وإطلالة مميزة'),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('جارٍ بدء التنقل إلى خان الخليلي...'))),
                  icon: const Icon(Icons.navigation, size: 18),
                  label: const Text('ابدأ التنقل إلى خان الخليلي'),
                  style: ElevatedButton.styleFrom(
                      backgroundColor: navy,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14))),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                  onPressed: () => setState(() => approved = true),
                  style: OutlinedButton.styleFrom(
                      foregroundColor:
                          approved ? const Color(0xFF2E7D32) : navy,
                      side: BorderSide(
                          color:
                              approved ? const Color(0xFF2E7D32) : lightBorder),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14))),
                  child: Text(approved
                      ? 'تم اعتماد الترتيب المقترح ✓'
                      : 'اعتماد الترتيب المقترح'),
                ),
              ),
              const SizedBox(height: 16),

              // ===== 5 - خط سير اليوم الأصلي =====
              _sectionTitle('خط سير اليوم الأصلي'),
              const SizedBox(height: 4),
              Text('${widget.date} • بالمقارنة مع الخطة المقترحة',
                  style: const TextStyle(fontSize: 12, color: greyText)),
              const SizedBox(height: 10),
              _originalItem('الأهرامات', '09:00', 'الوصول والجولة'),
              _originalItem('المتحف المصري', '12:30', 'تاريخ وحضارة'),
              _originalItem('خان الخليلي', '15:00', 'السوق والثقافة'),
              _originalItem('عشاء على النيل', '18:30', 'غداء وإطلالة',
                  isLast: true),
              const SizedBox(height: 16),

              // ===== 6 - ميزانية اليوم =====
              _sectionTitle('ميزانية اليوم'),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                      child: _budgetCard(
                          'المستخدم', '$spentPercent%', '${widget.spent} ج.م')),
                  const SizedBox(width: 10),
                  Expanded(child: _budgetCard('المتبقي', '', '$remaining ج.م')),
                  const SizedBox(width: 10),
                  Expanded(
                      child:
                          _budgetCard('الميزانية', '', '${widget.budget} ج.م')),
                ],
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('راجع المصروفات'))),
                  style: OutlinedButton.styleFrom(
                      foregroundColor: navy,
                      side: const BorderSide(color: lightBorder),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12))),
                  child: const Text('راجع المصروفات'),
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => ScaffoldMessenger.of(context)
                          .showSnackBar(const SnackBar(
                              content: Text('جارٍ إعادة التخطيط الآن...'))),
                      style: OutlinedButton.styleFrom(
                          foregroundColor: navy,
                          side: const BorderSide(color: lightBorder),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12))),
                      child: const Text('إعادة التخطيط الآن'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        showEditDayPlanSheet(
                          context,
                          coverImage: pyramidsImage,
                          stops: [
                            DayStop(
                                title: 'أهرامات الجيزة',
                                time: '9:00 ص',
                                sub: 'زيارة وآثار',
                                image: pyramidsImage),
                            DayStop(
                                title: 'خان الخليلي',
                                time: '12:30 م',
                                sub: 'السوق والثقافة المحلية',
                                image: khanImage),
                            DayStop(
                                title: 'المتحف المصري',
                                time: '3:00 م',
                                sub: 'تاريخ وحضارة',
                                image: luxorImage),
                            DayStop(
                                title: 'عشاء على النيل',
                                time: '6:30 م',
                                sub: 'غداء وإطلالة مميزة',
                                image: sharmImage),
                          ],
                          onSave: (newOrder) =>
                              ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                                content: Text(
                                    'تم حفظ الترتيب: ${newOrder.map((e) => e.title).join(' • ')}')),
                          ),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                          foregroundColor: navy,
                          side: const BorderSide(color: lightBorder),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12))),
                      child: const Text('تعديل الخطة يدوياً'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('تم بدء التنقل الآن'))),
                  style: ElevatedButton.styleFrom(
                      backgroundColor: navy,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14))),
                  child: const Text('ابدأ التنقل الآن'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionTitle(String t) => Text(t,
      style: const TextStyle(
          fontSize: 17, fontWeight: FontWeight.bold, color: textColor));

  Widget _miniStat(IconData icon, String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 6),
      decoration: BoxDecoration(
          color: lightBlueBg, borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Icon(icon, color: navy, size: 20),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(fontSize: 11, color: greyText)),
          const SizedBox(height: 2),
          Text(value,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 13, fontWeight: FontWeight.bold, color: textColor)),
        ],
      ),
    );
  }

  Widget _mapPin(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      decoration: BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.12), blurRadius: 6)
          ]),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.location_on, color: navy, size: 14),
          const SizedBox(width: 3),
          Text(label,
              style: const TextStyle(
                  fontSize: 11, fontWeight: FontWeight.bold, color: textColor)),
        ],
      ),
    );
  }

  Widget _planItem(
      String num, String image, String title, String time, String sub) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
          color: whiteCard, borderRadius: BorderRadius.circular(14)),
      child: Row(
        children: [
          ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(image,
                  width: 60, height: 60, fit: BoxFit.cover)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('$num • $title',
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                const SizedBox(height: 4),
                Text('$time • $sub',
                    style: const TextStyle(fontSize: 12, color: greyText)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _originalItem(String title, String time, String sub,
      {bool isLast = false}) {
    return Container(
      margin: EdgeInsets.only(bottom: isLast ? 0 : 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
          color: whiteCard, borderRadius: BorderRadius.circular(14)),
      child: Row(
        children: [
          Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                  color: lightBlueBg, borderRadius: BorderRadius.circular(20)),
              child: const Icon(Icons.access_time, color: navy, size: 18)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                const SizedBox(height: 2),
                Text(sub,
                    style: const TextStyle(fontSize: 12, color: greyText)),
              ],
            ),
          ),
          Text(time,
              style: const TextStyle(
                  fontSize: 13, fontWeight: FontWeight.bold, color: navy)),
        ],
      ),
    );
  }

  Widget _budgetCard(String label, String percent, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      decoration: BoxDecoration(
          color: whiteCard, borderRadius: BorderRadius.circular(14)),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: greyText)),
          const SizedBox(height: 6),
          if (percent.isNotEmpty)
            Text(percent,
                style: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.bold, color: navy)),
          Text(value,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
        ],
      ),
    );
  }
}

// ==================== ROOMS SCREEN - اختر غرفتك ====================
