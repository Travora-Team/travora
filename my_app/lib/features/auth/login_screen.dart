import 'package:flutter/material.dart';

import 'package:my_app/core/core.dart';
import 'package:my_app/features/account/account_screen.dart';
import 'package:my_app/features/auth/password_recovery_screens.dart';
import 'package:my_app/features/auth/register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool hidePassword = true;
  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void login() {
    final email = emailController.text.trim();
    final password = passwordController.text;

    final emailRegex = RegExp(
      r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$",
    );

    if (email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('من فضلك أدخل البريد الإلكتروني')),
      );
      return;
    }
    if (!emailRegex.hasMatch(email)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text(
                'صيغة البريد الإلكتروني غير صحيحة، مثال: name@example.com')),
      );
      return;
    }
    if (password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('من فضلك أدخل كلمة المرور')),
      );
      return;
    }

    TravoraUser.email = email;
    if (TravoraUser.name.isEmpty) {
      TravoraUser.name = TravoraUser.email.split('@').first;
    }
    TravoraUser.isLoggedIn = true;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const AccountScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(22, 10, 22, 24),
          children: [
            const Text(
              'أهلاً بعودتك',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'سجّل دخولك واكتشف رحلتك القادمة',
              style: TextStyle(color: greyText),
            ),
            const SizedBox(height: 22),
            const TravelImage(url: cairoImage, height: 175, radius: 20),
            const SizedBox(height: 25),
            const Text(
              'البريد الإلكتروني',
              style: TextStyle(fontWeight: FontWeight.w600, color: textColor),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                hintText: 'example@email.com',
                prefixIcon: Icon(Icons.email_outlined),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'كلمة المرور',
              style: TextStyle(fontWeight: FontWeight.w600, color: textColor),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: passwordController,
              obscureText: hidePassword,
              decoration: InputDecoration(
                hintText: 'أدخل كلمة المرور',
                prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  onPressed: () {
                    setState(() => hidePassword = !hidePassword);
                  },
                  icon: Icon(
                    hidePassword
                        ? Icons.visibility_outlined
                        : Icons.visibility_off_outlined,
                  ),
                ),
              ),
            ),
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ForgotPasswordScreen(),
                    ),
                  );
                },
                child: const Text(
                  'نسيت كلمة المرور؟',
                  style: TextStyle(color: navy),
                ),
              ),
            ),
            const SizedBox(height: 8),
            TravoraButton(
              text: 'تسجيل الدخول',
              onPressed: login,
              icon: Icons.login,
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                      'تسجيل الدخول بـ Google يحتاج إعداد Google Sign-In.',
                    ),
                  ),
                );
              },
              icon: const Icon(Icons.g_mobiledata, size: 30),
              label: const Text('المتابعة باستخدام Google'),
              style: OutlinedButton.styleFrom(
                foregroundColor: textColor,
                minimumSize: const Size(double.infinity, 50),
                side: const BorderSide(color: lightBorder),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),
            const SizedBox(height: 14),
            Center(
              child: Wrap(
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  const Text(
                    'ليس لديك حساب؟',
                    style: TextStyle(color: textColor),
                  ),
                  TextButton(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const RegisterScreen())),
                    child: const Text(
                      'أنشئ حسابًا',
                      style: TextStyle(
                        color: navy,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ==================== 2 - صفحة إنشاء حساب ====================
