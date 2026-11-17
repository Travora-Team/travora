import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/info/widgets/info_widgets.dart';
import 'package:my_app/features/search/search_screen.dart';
import 'package:my_app/features/support/support_screen.dart';

class FaqScreen extends StatelessWidget {
  const FaqScreen({super.key});

  void _showHowToEditSheet(BuildContext context) {
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
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: lightBlueBg,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child:
                        const Icon(Icons.help_outline, color: navy, size: 22),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: textColor),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'كيف أعدل رحلتي؟',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor),
              ),
              const SizedBox(height: 4),
              const Text(
                'خطة مرنة ووقت يناسبك',
                style: TextStyle(fontSize: 13, color: greyText),
              ),
              const SizedBox(height: 16),
              const FaqStep(text: 'افتح رحلتك'),
              const FaqStep(text: 'اختر تعديل الخطة من تفاصيل رحلتك'),
              const FaqStep(
                  text: 'خصص أيامك، بدّل تجربة أو توقيتاً أو طريقة تنقل'),
              const FaqStep(
                  text: 'احفظ التعديل، ستجد النسخة الجديدة داخل تفاصيل الرحلة'),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: navy,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('فهمت',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
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
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('الأسئلة الشائعة',
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('إجابات تساعدك على الانطلاق',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),

            // 1 - ابحث عن إجابة
            FaqCard(
              title: 'ابحث عن إجابة',
              sub: 'اكتب سؤالك أو ابحث عن وجهتك',
              icon: Icons.search,
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => const TravoraSearchScreen())),
            ),

            // 2 - كيف استخدم مخطط الرحلة؟
            FaqCard(
              title: 'كيف أستخدم مخطط الرحلة؟',
              sub:
                  'اختر الوجهة والمدة الزمنية والاهتمامات، أنشئ الخطة ثم عدّل أيامها في صفحة النتائج',
              icon: Icons.map_outlined,
              onTap: () => _showHowToEditSheet(context),
            ),

            // 3 - هل يمكنني تعديل حجز الفندق؟
            FaqCard(
              title: 'هل يمكنني تعديل حجز الفندق؟',
              sub:
                  'افتح حجوزاتي ثم تفاصيل حجز واختر تعديل حجز لمراجعة الخيارات والشروط',
              icon: Icons.hotel_outlined,
              onTap: () => _showHowToEditSheet(context),
            ),

            // 4 - أين أجد التذكرة والمستندات؟
            FaqCard(
              title: 'أين أجد التذكرة والمستندات؟',
              sub: 'افتح الحجز لعرض التذكرة أو التنقل إلى المستندات',
              icon: Icons.confirmation_number_outlined,
              onTap: () => _showHowToEditSheet(context),
            ),

            // 5 - كيف أغير كلمة المرور؟
            FaqCard(
              title: 'كيف أغير كلمة المرور؟',
              sub: 'من حسابك اختر الإعدادات ثم تغيير كلمة المرور واتبع الخطوات',
              icon: Icons.lock_outline,
              onTap: () => _showHowToEditSheet(context),
            ),

            // 6 - هل يمكنني حفظ وجهة لوقت لاحق؟
            FaqCard(
              title: 'هل يمكنني حفظ وجهة لوقت لاحق؟',
              sub:
                  'اضغط على القلب في بطاقة الوجهة أو الفندق وستجدها في المفضلة',
              icon: Icons.favorite_border,
              onTap: () => _showHowToEditSheet(context),
            ),

            const SizedBox(height: 16),

            // زرار تواصل معنا
            InkWell(
              onTap: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const SupportScreen())),
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: lightBlueBg,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: lightBorder),
                ),
                child: Row(children: const [
                  Icon(Icons.support_agent_outlined, color: navy),
                  SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('لم تجد الإجابة؟',
                            style: TextStyle(
                                fontWeight: FontWeight.bold, color: textColor)),
                        Text('تواصل معنا',
                            style: TextStyle(
                                fontSize: 13,
                                color: navy,
                                fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  Icon(Icons.arrow_back_ios, size: 14, color: navy),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
