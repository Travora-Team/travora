import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/auth/login_screen.dart';
import 'package:my_app/features/auth/password_recovery_screens.dart';
import 'package:my_app/features/info/policy_screens.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String language = 'العربية';
  String currency = 'الجنيه المصري EGP';
  bool bookingUpdates = true;
  bool tripAlerts = true;
  bool ideas = true;
  bool offers = false;

  // بيانات البروفايل - فاضية زي الفيديو، انتي اللي هتدخليها
  String profileName = '';
  String profileCity = '';
  String profileEmail = '';
  String profilePhone = '';

  // ---------- شيت: اللغة ----------
  void _pickLanguage() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
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
                        color: backgroundColor,
                        borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.close, size: 18, color: textColor),
                  ),
                ),
                const Spacer(),
                const Text('لغة الواجهة',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ],
            ),
            const SizedBox(height: 6),
            const Text('اختر اللغة المفضلة',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            _sheetOption('العربية', language == 'العربية', () {
              setState(() => language = 'العربية');
              Navigator.pop(context);
            }),
            _sheetOption('English', language == 'English', () {
              setState(() => language = 'English');
              Navigator.pop(context);
            }),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  // ---------- شيت: العملة ----------
  void _pickCurrency() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
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
                        color: backgroundColor,
                        borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.close, size: 18, color: textColor),
                  ),
                ),
                const Spacer(),
                const Text('عملة العرض',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ],
            ),
            const SizedBox(height: 6),
            const Text('اختر العملة التي تراجع بها الأسعار',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            _sheetOption('الجنيه المصري EGP', currency == 'الجنيه المصري EGP',
                () {
              setState(() => currency = 'الجنيه المصري EGP');
              Navigator.pop(context);
            }),
            _sheetOption(
                'الدولار الأمريكي USD', currency == 'الدولار الأمريكي USD', () {
              setState(() => currency = 'الدولار الأمريكي USD');
              Navigator.pop(context);
            }),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  // ---------- شيت: تنبيهات السفر ----------
  void _pickNotifications() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => StatefulBuilder(
        builder: (ctx, setSheet) => Padding(
          padding: const EdgeInsets.all(16),
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
                          color: backgroundColor,
                          borderRadius: BorderRadius.circular(20)),
                      child:
                          const Icon(Icons.close, size: 18, color: textColor),
                    ),
                  ),
                  const Spacer(),
                  const Text('تفضيلات الإشعارات',
                      style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                ],
              ),
              const SizedBox(height: 6),
              const Text('اختر التحديثات التي تساعدك في رحلتك',
                  style: TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 14),
              _notifRow('تحديثات الحجوزات', bookingUpdates,
                  (v) => setSheet(() => bookingUpdates = v)),
              _notifRow('تنبيهات الرحلة', tripAlerts,
                  (v) => setSheet(() => tripAlerts = v)),
              _notifRow('أفكار ووجهات جديدة', ideas,
                  (v) => setSheet(() => ideas = v)),
              _notifRow(
                  'عروض وخصومات', offers, (v) => setSheet(() => offers = v)),
              const SizedBox(height: 14),
              TravoraButton(
                text: 'حفظ التعديلات',
                onPressed: () {
                  Navigator.pop(context);
                  _showSavedSheet();
                },
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  // ---------- شيت: حفظنا تفضيلاتك ----------
  void _showSavedSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: lightBlueBg, borderRadius: BorderRadius.circular(50)),
              child: const Icon(Icons.check, color: navy, size: 28),
            ),
            const SizedBox(height: 12),
            const Text('حفظنا تفضيلاتك',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 6),
            const Text('إعداداتك الجديدة جاهزة',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            TravoraButton(
              text: 'متابعة',
              onPressed: () => Navigator.pop(context),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  // ---------- صفحة: كلمة مرور جديدة ----------
  void _openPassword() {
    Navigator.push(
        context, MaterialPageRoute(builder: (_) => const NewPasswordScreen()));
  }

  // ---------- شيت: تعديل الملف الشخصي - فاضي زي الفيديو ----------
  void _editProfile() {
    final nameCtrl = TextEditingController(text: profileName);
    final cityCtrl = TextEditingController(text: profileCity);
    final emailCtrl = TextEditingController(text: profileEmail);
    final phoneCtrl = TextEditingController(text: profilePhone);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => Padding(
        padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 16,
            bottom: MediaQuery.of(context).viewInsets.bottom + 16),
        child: SingleChildScrollView(
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
                          color: backgroundColor,
                          borderRadius: BorderRadius.circular(20)),
                      child:
                          const Icon(Icons.close, size: 18, color: textColor),
                    ),
                  ),
                  const Spacer(),
                  const Text('تعديل الملف الشخصي',
                      style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                ],
              ),
              const SizedBox(height: 16),
              _profileField('الاسم الكامل', 'اكتب اسمك الكامل', nameCtrl),
              const SizedBox(height: 12),
              _profileField('المدينة', 'اكتب مدينتك', cityCtrl),
              const SizedBox(height: 12),
              _profileField(
                  'البريد الإلكتروني', 'اكتب بريدك الإلكتروني', emailCtrl),
              const SizedBox(height: 12),
              _profileField('رقم الهاتف', 'اكتب رقم هاتفك', phoneCtrl),
              const SizedBox(height: 16),
              TravoraButton(
                text: 'حفظ التعديلات',
                onPressed: () {
                  setState(() {
                    profileName = nameCtrl.text;
                    profileCity = cityCtrl.text;
                    profileEmail = emailCtrl.text;
                    profilePhone = phoneCtrl.text;
                  });
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                      content: Text('تم حفظ التعديلات في ملفك الشخصي')));
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------- صفحة: سياسة الخصوصية ----------
  void _openPrivacy() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const PrivacyPolicyScreen()),
    );
  }

  Widget _sheetOption(String label, bool selected, VoidCallback onTap) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: selected ? navy : lightBlueBg,
          foregroundColor: selected ? Colors.white : textColor,
          elevation: 0,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 14),
        ),
        child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _notifRow(String title, bool value, ValueChanged<bool> onChanged) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
          color: lightBlueBg, borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          Expanded(
              child: Text(title,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, color: textColor))),
          Text(value ? 'مفعلة' : 'معطلة',
              style: TextStyle(
                  fontSize: 12,
                  color: value ? navy : greyText,
                  fontWeight: FontWeight.bold)),
          const SizedBox(width: 8),
          Switch(value: value, onChanged: onChanged, activeColor: navy),
        ],
      ),
    );
  }

  Widget _profileField(String label, String hint, TextEditingController ctrl) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontWeight: FontWeight.bold, color: textColor, fontSize: 13)),
        const SizedBox(height: 6),
        TextField(
          controller: ctrl,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: greyText, fontSize: 13),
            filled: true,
            fillColor: lightBlueBg,
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          ),
        ),
      ],
    );
  }

  Widget _row(String title, String sub, IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: lightBorder)),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                  color: lightBlueBg, borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: navy, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, color: textColor)),
                  const SizedBox(height: 2),
                  Text(sub,
                      style: const TextStyle(fontSize: 12, color: greyText)),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, size: 14, color: greyText),
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
              const Text('إعدادات الحساب',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              const Text('خصص تجربتك وحافظ على أمان حسابك',
                  style: TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 20),

              // سيكشن 1: تفضيلات العرض
              const Text('تفضيلات العرض',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 12),
              _row('اللغة', language, Icons.language_outlined, _pickLanguage),
              const SizedBox(height: 10),
              _row('العملة', currency, Icons.attach_money_outlined,
                  _pickCurrency),
              const SizedBox(height: 10),
              _row('تنبيهات السفر', 'الإشعارات والبريد الإلكتروني',
                  Icons.notifications_none_outlined, _pickNotifications),
              const SizedBox(height: 22),

              // سيكشن 2: الأمان والخصوصية
              const Text('الأمان والخصوصية',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 12),
              _row('كلمة المرور', 'آخر تحديث منذ شهر', Icons.lock_outline,
                  _openPassword),
              const SizedBox(height: 10),
              _row('بيانات الشخصية', 'الاسم والبريد ورقم الهاتف',
                  Icons.person_outline, _editProfile),
              const SizedBox(height: 10),
              _row('سياسة الخصوصية', 'تعرف على كيفية استخدام البيانات',
                  Icons.shield_outlined, _openPrivacy),
              const SizedBox(height: 22),

              // سيكشن 3: حفظ + خروج
              TravoraButton(
                text: 'حفظ التغييرات',
                onPressed: () => _showSavedSheet(),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: TextButton(
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (route) => false,
                    );
                  },
                  child: const Text('تسجيل الخروج',
                      style: TextStyle(
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                          fontSize: 15)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
