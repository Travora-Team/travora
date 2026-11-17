import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/info/widgets/info_widgets.dart';
import 'package:my_app/features/support/support_screen.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('سياسة الخصوصية',
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('معلومات واضحة عن بيانات حسابك',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: lightBlueBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lightBorder),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('آخر تحديث: أكتوبر 2027',
                      style: TextStyle(
                          fontSize: 12,
                          color: navy,
                          fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('راجع هذه المعلومات قبل استخدام الحساب وإتمام الحجز.',
                      style: TextStyle(fontSize: 13, color: textColor)),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const PrivacySection(
              title: 'البيانات التي تقدمها',
              body:
                  'يضم الحساب بيانات الاسم والبريد ووسيلة التواصل. وتضم خطط الرحلات والوجهات والاهتمامات والمواعيد.',
            ),
            const PrivacySection(
              title: 'استخدام معلومات الرحلة',
              body:
                  'تساعد بيانات التخطيط في عرض خطة ونتائج تناسب وقتك وميزانيتك. ويمكن مراجعة تفاصيل ملفك وتعديلها من الحساب.',
            ),
            const PrivacySection(
              title: 'الحجز وبيانات المسافر',
              body:
                  'راجع بيانات المسافر قبل تأكيد الحجز. تظهر المعلومات المرتبطة بالحجز في صفحة تفاصيل ومستندات.',
            ),
            const PrivacySection(
              title: 'التحكم في التجربة',
              body:
                  'غيّر اللغة والعملة وتبديلات التسهيلات والإعدادات، وراجع الأماكن المحفوظة في المفضلة.',
            ),
            const PrivacySection(
              title: 'التواصل بشأن البيانات',
              body:
                  'إذا كان لديك سؤال عن بيانات الحساب، افتح طلباً من شاشة الدعم وحدد موضوع الاستفسار.',
            ),
            InkWell(
              onTap: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const SupportScreen())),
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: whiteCard,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: lightBorder),
                ),
                child: const Row(children: [
                  Icon(Icons.support_agent_outlined, color: navy),
                  SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('لدي سؤال؟',
                            style: TextStyle(
                                fontWeight: FontWeight.bold, color: textColor)),
                        SizedBox(height: 2),
                        Text('تواصل مع الدعم',
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
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const TermsScreen()),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: lightBorder),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('شروط الاستخدام',
                    style: TextStyle(color: navy, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

// ==================== TERMS SCREEN - شروط الاستخدام ====================
class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('شروط الاستخدام',
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('تعرف على تفاصيل تجربة Travora',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: lightBlueBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lightBorder),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('تحديث 2027',
                      style: TextStyle(
                          fontSize: 12,
                          color: navy,
                          fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('راجع هذه المعلومات قبل استخدام الحساب وإتمام الحجز.',
                      style: TextStyle(fontSize: 13, color: textColor)),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const PrivacySection(
              title: 'استخدام الحساب',
              body:
                  'أدخل بيانات صحيحة عند إنشاء الحساب والحجز، واحتفظ بكلمة المرور بأمان. يمكنك تحديث المعلومات من ملفك الشخصي.',
            ),
            const PrivacySection(
              title: 'خطة الرحلات',
              body:
                  'الخطط تساعدك على ترتيب الأيام والأنشطة. وراجع المواعيد والتفاصيل قبل تثبيت الاختيارات.',
            ),
            const PrivacySection(
              title: 'الأسعار وتأكيد الحجز',
              body:
                  'تعرض تفاصيل الإقامة والتجربة والسعر قبل التأكيد. راجع ملخص الحجز وسياسة الإلغاء في خطوة الدفع.',
            ),
            const PrivacySection(
              title: 'التعديل والإلغاء',
              body:
                  'تختلف خيارات التعديل والإلغاء بحسب الحجز. افتح تفاصيل حجز لعرض الشروط والخيارات المتاحة.',
            ),
            const PrivacySection(
              title: 'المساعدة والاستفسارات',
              body:
                  'يمكنك متابعة الحجوزات من حسابك وإرسال طلب دعم عند الحاجة، مع ذكر رقم الحجز لتسهيل المتابعة.',
            ),
            InkWell(
              onTap: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const SupportScreen())),
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: whiteCard,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: lightBorder),
                ),
                child: const Row(children: [
                  Icon(Icons.support_agent_outlined, color: navy),
                  SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('لدي سؤال؟',
                            style: TextStyle(
                                fontWeight: FontWeight.bold, color: textColor)),
                        SizedBox(height: 2),
                        Text('تواصل مع الدعم',
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
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const PrivacyPolicyScreen())),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: lightBorder),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('سياسة الخصوصية',
                    style: TextStyle(color: navy, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}