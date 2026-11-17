import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/account/account_screen.dart';
import 'package:my_app/features/auth/login_screen.dart';
import 'package:my_app/features/trips/share_trip_sheet.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});
  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final emailController = TextEditingController();
  @override
  void dispose() {
    emailController.dispose();
    super.dispose();
  }

  void sendCode() {
    if (emailController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('من فضلك أدخل البريد الإلكتروني')),
      );
      return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => VerifyCodeScreen(email: emailController.text.trim()),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
          children: [
            const SizedBox(height: 10),
            const Center(
              child: Text(
                'نسيت كلمة المرور؟',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
            ),
            const SizedBox(height: 10),
            const Center(
              child: Text(
                'أدخل بريدك وسنرسل رمز الاستعادة.',
                style: TextStyle(fontSize: 14, color: greyText),
              ),
            ),
            const SizedBox(height: 28),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: lightBorder),
              ),
              child: Column(
                children: [
                  TextField(
                    controller: emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      labelText: 'البريد الإلكتروني',
                      hintText: 'example@email.com',
                      labelStyle: const TextStyle(
                        color: greyText,
                        fontSize: 12,
                      ),
                      hintStyle: const TextStyle(color: greyText),
                      filled: true,
                      fillColor: whiteCard,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 18,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: lightBorder),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: navy, width: 1.5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: sendCode,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        'إرسال رمز الاستعادة',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text(
                      'العودة لتسجيل الدخول',
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

// ==================== 3 - صفحة تفعيل الحساب ====================

class VerifyCodeScreen extends StatefulWidget {
  final String email;
  const VerifyCodeScreen({super.key, required this.email});
  @override
  State<VerifyCodeScreen> createState() => _VerifyCodeScreenState();
}

class _VerifyCodeScreenState extends State<VerifyCodeScreen> {
  final List<TextEditingController> codeCtrls =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> focuses = List.generate(6, (_) => FocusNode());

  @override
  void dispose() {
    for (final c in codeCtrls) c.dispose();
    for (final f in focuses) f.dispose();
    super.dispose();
  }

  String get code => codeCtrls.map((c) => c.text).join();

  void _activate() {
    if (code.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اكتب الرمز كله - 6 أرقام')));
      return;
    }
    TravoraUser.isLoggedIn = true;
    Navigator.pushAndRemoveUntil(context,
        MaterialPageRoute(builder: (_) => const AccountScreen()), (r) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('خطوة واحدة للانطلاق',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            Text('أرسلنا رمز تفعيل الحساب إلى ${widget.email}',
                style: const TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            Center(
                child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                        color: const Color(0xFFE8F5E9),
                        borderRadius: BorderRadius.circular(50)),
                    child: const Icon(Icons.check,
                        color: Color(0xFF2E7D32), size: 30))),
            const SizedBox(height: 16),
            const Center(
                child: Text('أدخل الرمز المكون من 6 أرقام',
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: textColor))),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                  6,
                  (i) => SizedBox(
                        width: 48,
                        height: 56,
                        child: TextField(
                          controller: codeCtrls[i],
                          focusNode: focuses[i],
                          textAlign: TextAlign.center,
                          keyboardType: TextInputType.number,
                          maxLength: 1,
                          style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: textColor),
                          decoration: InputDecoration(
                              counterText: '',
                              filled: true,
                              fillColor: whiteCard,
                              border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide:
                                      const BorderSide(color: lightBorder))),
                          onChanged: (v) {
                            if (v.isNotEmpty && i < 5)
                              focuses[i + 1].requestFocus();
                            if (v.isEmpty && i > 0)
                              focuses[i - 1].requestFocus();
                          },
                        ),
                      )),
            ),
            const SizedBox(height: 12),
            const Center(
                child: Text('لم تصلك رسالة؟ يمكنك طلب رمز جديد',
                    style: TextStyle(fontSize: 12, color: greyText))),
            const SizedBox(height: 4),
            Center(
                child: TextButton(
                    onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('تم إعادة إرسال الرمز'))),
                    child: const Text('إعادة إرسال الرمز',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
            const SizedBox(height: 16),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: _activate,
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('تفعيل الحساب',
                        style: TextStyle(fontWeight: FontWeight.bold)))),
            const SizedBox(height: 10),
            Center(
                child: TextButton(
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const LoginScreen())),
                    child: const Text('العودة لتسجيل الدخول',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
            const SizedBox(height: 6),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              TextButton(
                  onPressed: () => showTravoraCancellationPolicy(context),
                  child: const Text('الخصوصية',
                      style: TextStyle(
                          color: navy,
                          fontWeight: FontWeight.bold,
                          fontSize: 12))),
              TextButton(
                  onPressed: () => showTravoraCancellationPolicy(context),
                  child: const Text('الشروط',
                      style: TextStyle(
                          color: navy,
                          fontWeight: FontWeight.bold,
                          fontSize: 12))),
            ]),
          ]),
        ),
      ),
    );
  }
}

class NewPasswordScreen extends StatefulWidget {
  const NewPasswordScreen({super.key});
  @override
  State<NewPasswordScreen> createState() => _NewPasswordScreenState();
}

class _NewPasswordScreenState extends State<NewPasswordScreen> {
  final passController = TextEditingController();
  final confirmController = TextEditingController();
  bool hide1 = true;
  bool hide2 = true;
  @override
  void dispose() {
    passController.dispose();
    confirmController.dispose();
    super.dispose();
  }

  void savePassword() {
    if (passController.text.isEmpty || confirmController.text.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('من فضلك أدخل كلمة المرور')));
      return;
    }
    if (passController.text.length < 8) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
        ),
      );
      return;
    }
    if (passController.text != confirmController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('كلمتا المرور غير متطابقتين')),
      );
      return;
    }
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('تم حفظ كلمة المرور بنجاح')));
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (r) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
          children: [
            const Center(
              child: Text(
                'كلمة مرور جديدة',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
            ),
            const SizedBox(height: 10),
            const Center(
              child: Text(
                'أدخل كلمة المرور الجديدة لحسابك',
                style: TextStyle(fontSize: 13, color: greyText),
              ),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: lightBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'كلمة المرور',
                    style: TextStyle(
                      fontSize: 12,
                      color: textColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: passController,
                    obscureText: hide1,
                    decoration: InputDecoration(
                      hintText: '********',
                      filled: true,
                      fillColor: whiteCard,
                      suffixIcon: IconButton(
                        icon: Icon(
                          hide1
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: greyText,
                          size: 20,
                        ),
                        onPressed: () => setState(() => hide1 = !hide1),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: lightBorder),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: navy, width: 1.5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'تأكيد كلمة المرور',
                    style: TextStyle(
                      fontSize: 12,
                      color: textColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: confirmController,
                    obscureText: hide2,
                    decoration: InputDecoration(
                      hintText: '********',
                      filled: true,
                      fillColor: whiteCard,
                      suffixIcon: IconButton(
                        icon: Icon(
                          hide2
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: greyText,
                          size: 20,
                        ),
                        onPressed: () => setState(() => hide2 = !hide2),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: lightBorder),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: navy, width: 1.5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: savePassword,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        'حفظ كلمة المرور',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Center(
                    child: TextButton(
                      onPressed: () => Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                        (r) => false,
                      ),
                      child: const Text(
                        'العودة لتسجيل الدخول',
                        style: TextStyle(
                          color: navy,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
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

// ==================== 4 - صفحة حسابي - الكاملة ====================
