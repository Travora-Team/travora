import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/auth/login_screen.dart';
import 'package:my_app/features/auth/password_recovery_screens.dart';
import 'package:my_app/features/trips/share_trip_sheet.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmController = TextEditingController();

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmController.dispose();
    super.dispose();
  }

  void _register() {
    final name = nameController.text.trim();
    final email = emailController.text.trim();
    final pass = passwordController.text;
    final confirm = confirmController.text;

    final nameRegex = RegExp(r"^[A-Za-zء-ي ]{3,}$");
    final emailRegex = RegExp(
      r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$",
    );
    final hasUppercase = RegExp(r'[A-Z]').hasMatch(pass);
    final hasLowercase = RegExp(r'[a-z]').hasMatch(pass);
    final hasNumber = RegExp(r'[0-9]').hasMatch(pass);

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('اكتب الاسم الكامل')),
      );
      return;
    }
    if (!nameRegex.hasMatch(name)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text(
                'الاسم يجب أن يكون 3 أحرف على الأقل ويحتوي على حروف ومسافات فقط')),
      );
      return;
    }
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
    if (pass.length < 8 || !hasUppercase || !hasLowercase || !hasNumber) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text(
                'كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم')),
      );
      return;
    }
    if (confirm.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('من فضلك أكد كلمة المرور')),
      );
      return;
    }
    if (confirm != pass) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تأكيد كلمة المرور مش زي كلمة المرور')),
      );
      return;
    }

    TravoraUser.name = name;
    TravoraUser.email = email;
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => VerifyCodeScreen(email: email)),
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
              const Text(
                'ابدأ رحلتك معنا',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'أنشئ حساباً واحفظ خطتك وتجاربك',
                style: TextStyle(fontSize: 13, color: greyText),
              ),
              const SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80',
                  height: 150,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 16),
              _field('الاسم الكامل', 'اكتب اسمك الكامل', nameController, false),
              _field('البريد الإلكتروني', 'اكتب بريدك الإلكتروني',
                  emailController, false),
              _field(
                  'كلمة المرور', 'اكتب كلمة المرور', passwordController, true),
              _field('تأكيد كلمة المرور', 'أعد كتابة كلمة المرور',
                  confirmController, true),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _register,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: navy,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text(
                    'إنشاء حساب',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Center(
                child: TextButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                  ),
                  child: const Text(
                    'لديك حساب؟ تسجيل الدخول',
                    style: TextStyle(color: navy, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              const Center(
                child: Text(
                  'بالمتابعة أنت توافق على شروط الاستخدام',
                  style: TextStyle(fontSize: 12, color: greyText),
                ),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextButton(
                    onPressed: () => showTravoraCancellationPolicy(context),
                    child: const Text(
                      'الخصوصية',
                      style: TextStyle(
                        color: navy,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () => showTravoraCancellationPolicy(context),
                    child: const Text(
                      'الشروط',
                      style: TextStyle(
                        color: navy,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(
    String label,
    String hint,
    TextEditingController c,
    bool isPass,
  ) =>
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: greyText)),
          const SizedBox(height: 6),
          TextField(
            controller: c,
            obscureText: isPass,
            keyboardType: label == 'البريد الإلكتروني'
                ? TextInputType.emailAddress
                : label == 'الاسم الكامل'
                    ? TextInputType.name
                    : TextInputType.text,
            decoration: InputDecoration(
              hintText: hint,
              filled: true,
              fillColor: whiteCard,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: lightBorder),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: lightBorder),
              ),
            ),
          ),
          const SizedBox(height: 12),
        ],
      );
}
