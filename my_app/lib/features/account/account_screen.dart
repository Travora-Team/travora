import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/auth/login_screen.dart';
import 'package:my_app/features/bookings/my_bookings_screen.dart';
import 'package:my_app/features/favorites/favorites_screen.dart';
import 'package:my_app/features/info/about_screen.dart';
import 'package:my_app/features/notifications/notifications_screen.dart';
import 'package:my_app/features/settings/settings_screen.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/trips/my_trips_screen.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key});
  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  void _editProfile() {
    final nameCtrl = TextEditingController(text: TravoraUser.name);
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: whiteCard,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('تعديل الملف الشخصي',
            style: TextStyle(fontWeight: FontWeight.bold, color: textColor)),
        content: TextField(
            controller: nameCtrl,
            decoration: InputDecoration(
                labelText: 'الاسم الكامل',
                filled: true,
                fillColor: lightBlueBg,
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none))),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('إلغاء')),
          ElevatedButton(
              onPressed: () {
                if (nameCtrl.text.trim().isEmpty) return;
                setState(() => TravoraUser.name = nameCtrl.text.trim());
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                  backgroundColor: navy, foregroundColor: Colors.white),
              child: const Text('حفظ')),
        ],
      ),
    );
  }

  void _showLogoutSheet() {
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
              Row(children: [
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
                const Text('تسجيل الخروج؟',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor))
              ]),
              const SizedBox(height: 12),
              const Text('يمكنك تسجيل الدخول مجدداً ومتابعة رحلاتك وحجوزاتك',
                  style: TextStyle(fontSize: 13, color: greyText, height: 1.6)),
              const SizedBox(height: 16),
              SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                      onPressed: () {
                        TravoraUser.isLoggedIn = false;
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                              builder: (_) => const LoginScreen()),
                          (r) => false,
                        );
                      },
                      style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFC62828),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14))),
                      child: const Text('تسجيل الخروج',
                          style: TextStyle(fontWeight: FontWeight.bold)))),
              const SizedBox(height: 10),
              SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                          foregroundColor: navy,
                          side: const BorderSide(color: lightBorder),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14))),
                      child: const Text('البقاء في الحساب',
                          style: TextStyle(fontWeight: FontWeight.bold)))),
            ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final name = TravoraUser.name.isEmpty ? 'ضيفنا العزيز' : TravoraUser.name;
    final email = TravoraUser.email.isEmpty ? '—' : TravoraUser.email;
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('حسابي',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('كل تفاصيل رحلتك في مكان واحد',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(children: [
                Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                        color: lightBlueBg,
                        borderRadius: BorderRadius.circular(50)),
                    child: const Icon(Icons.person, color: navy, size: 36)),
                const SizedBox(height: 12),
                Text(name,
                    style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                const SizedBox(height: 4),
                Text(email,
                    style: const TextStyle(fontSize: 13, color: greyText)),
                const SizedBox(height: 12),
                Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                        color: navy, borderRadius: BorderRadius.circular(20)),
                    child: const Text('عضوية المستكشف',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12))),
                const SizedBox(height: 12),
                SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                        onPressed: _editProfile,
                        style: OutlinedButton.styleFrom(
                            foregroundColor: navy,
                            side: const BorderSide(color: lightBorder),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12))),
                        child: const Text('تعديل الملف الشخصي'))),
              ]),
            ),
            const SizedBox(height: 16),
            ValueListenableBuilder<List<FavItem>>(
              valueListenable: TravoraFavorites.items,
              builder: (_, favs, __) => Row(children: [
                Expanded(child: _stat('${TravoraUser.bookings}', 'حجوزات')),
                const SizedBox(width: 10),
                Expanded(child: _stat('${favs.length}', 'أماكن محفوظة')),
                const SizedBox(width: 10),
                Expanded(child: _stat('${TravoraUser.trips}', 'رحلات')),
              ]),
            ),
            const SizedBox(height: 16),
            _linkCard(
                context,
                Icons.send,
                'رحلاتي',
                'خططك ورحلاتك القادمة',
                () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const MyTripsScreen()))),
            _linkCard(
                context,
                Icons.check_circle_outline,
                'حجوزاتي',
                'القادمة والملغاة',
                () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const MyBookingsScreen()))),
            _linkCard(
                context,
                Icons.favorite_border,
                'المفضلة',
                'الأماكن اللي حبيتها',
                () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const FavoritesScreen()))),
            _linkCard(
                context,
                Icons.notifications_none,
                'الإشعارات',
                'التنبيهات والتحديثات',
                () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const NotificationsScreen()))),
            _linkCard(
                context,
                Icons.settings_outlined,
                'الإعدادات',
                'اللغة ومان الحساب',
                () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const SettingsScreen()))),
            const SizedBox(height: 20),
            const Text('الدعم والمساعدة',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 12),
            _linkCard(
                context,
                Icons.headset_mic_outlined,
                'الدعم والمساعدة',
                'تواصل معنا',
                () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const SupportScreen()))),
            _linkCard(
                context,
                Icons.info_outline,
                'عن Travora',
                'منصة لحجز رحلة كاملة',
                () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AboutScreen()),
                    )),
            const SizedBox(height: 16),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                    onPressed: _showLogoutSheet,
                    style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFFC62828),
                        side: const BorderSide(color: Color(0xFFFFCDD2)),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('تسجيل الخروج',
                        style: TextStyle(fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _stat(String value, String label) => Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: lightBorder)),
      child: Column(children: [
        Text(value,
            style: const TextStyle(
                fontSize: 18, fontWeight: FontWeight.bold, color: navy)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: greyText))
      ]));

  Widget _linkCard(BuildContext context, IconData icon, String title,
          String sub, VoidCallback onTap) =>
      InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
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
                  child: Icon(icon, color: navy, size: 20)),
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
                        style: const TextStyle(fontSize: 12, color: greyText))
                  ])),
              const Icon(Icons.arrow_back_ios, size: 14, color: greyText)
            ])),
      );
}
