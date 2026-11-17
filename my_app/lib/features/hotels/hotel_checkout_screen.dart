import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/payment_screens.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/transport/transport_service_screens.dart';

class HotelCheckoutScreen extends StatefulWidget {
  final String title; // إقامة فاخرة على ضفاف النيل
  final String subTitle; // ديلوكس - إفطار شامل
  final String image;
  final String dateRange; // 15 - 18 مارس 2027
  final int nights;
  final int travelers;
  final int pricePerNight;

  const HotelCheckoutScreen({
    super.key,
    this.title = 'إقامة فاخرة على ضفاف النيل',
    this.subTitle = 'ديلوكس • إفطار شامل',
    this.image = room1Image,
    this.dateRange = '15 - 18 مارس 2027',
    this.nights = 3,
    this.travelers = 2,
    this.pricePerNight = 6800,
  });

  @override
  State<HotelCheckoutScreen> createState() => _HotelCheckoutScreenState();
}

class _HotelCheckoutScreenState extends State<HotelCheckoutScreen> {
  final firstNameCtrl = TextEditingController(text: 'يوسف');
  final lastNameCtrl = TextEditingController(text: 'محمد');
  final emailCtrl = TextEditingController(text: 'yousif@example.com');
  final phoneCtrl = TextEditingController(text: '+20 10 0000 0000');

  // الدفع - 3 اختيارات زي الفيديو
  String paymentMethod =
      'بطاقة بنكية'; // بطاقة بنكية | محفظة إلكترونية | الدفع عند الوصول
  final cardNameCtrl = TextEditingController(text: 'YOUSIF MOHAMED');
  final cardNumberCtrl = TextEditingController(text: '**** **** **** 4242');
  final expiryCtrl = TextEditingController(text: '08 / 2028');
  final cvvCtrl = TextEditingController(text: '***');
  final walletNumberCtrl = TextEditingController();
  final walletCodeCtrl = TextEditingController();
  bool codeSent = false;

  bool agreed = false;

  int get total => widget.pricePerNight * widget.nights;

  @override
  void dispose() {
    firstNameCtrl.dispose();
    lastNameCtrl.dispose();
    emailCtrl.dispose();
    phoneCtrl.dispose();
    cardNameCtrl.dispose();
    cardNumberCtrl.dispose();
    expiryCtrl.dispose();
    cvvCtrl.dispose();
    walletNumberCtrl.dispose();
    walletCodeCtrl.dispose();
    super.dispose();
  }

  String _formatCard(String v) {
    final d = v.replaceAll(RegExp(r'[^0-9]'), '');
    final l = d.length > 16 ? d.substring(0, 16) : d;
    final b = StringBuffer();
    for (int i = 0; i < l.length; i++) {
      if (i > 0 && i % 4 == 0) b.write(' ');
      b.write(l[i]);
    }
    return b.toString();
  }

  String _formatExpiry(String v) {
    final d = v.replaceAll(RegExp(r'[^0-9]'), '');
    final l = d.length > 6 ? d.substring(0, 6) : d;
    if (l.length <= 2) return l;
    return '${l.substring(0, 2)} / ${l.substring(2)}';
  }

  // ===== شيت سياسة التعديل والإلغاء - فندق =====
  void _showCancelPolicy() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
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
                      child:
                          const Icon(Icons.close, size: 16, color: greyText))),
              const Spacer(),
              const Text('سياسة التعديل والإلغاء',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
            ]),
            const SizedBox(height: 8),
            const Text('راجع شروط الخدمة قبل تأكيد الحجز',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            const Text('قبل الوصول بـ 7 أيام',
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('إلغاء مجاني في هذا المثال',
                style: TextStyle(fontSize: 13, color: greyText, height: 1.6)),
            const SizedBox(height: 14),
            const Text('بعد المهلة',
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('قد تطبق رسوم وفق نوع الغرفة والوحدة.',
                style: TextStyle(fontSize: 13, color: greyText, height: 1.6)),
            const SizedBox(height: 14),
            const Text('الاسترداد',
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text(
                'تظهر طريقة الاسترداد والمدة في تفاصيل الحجز.\nالأسعار والشروط هنا نموذجية.',
                style: TextStyle(fontSize: 13, color: greyText, height: 1.6)),
            const SizedBox(height: 18),
            SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('فهمت'))),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  // ===== شروط الدفع عند الوصول =====
  void _showCashTerms() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: whiteCard,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('شروط الدفع عند الوصول',
            style: TextStyle(fontWeight: FontWeight.bold, color: textColor)),
        content: const Text(
            'الإجمالي مستحق عند الوصول.\nلن يخصم المبلغ الآن.\nمن فضلك أكد الحجز قبل الوصول بفترة كافية، وقد يطلب الفندق بطاقة ضمان.',
            style: TextStyle(fontSize: 13, color: textColor, height: 1.6)),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('فهمت',
                  style: TextStyle(color: navy, fontWeight: FontWeight.bold)))
        ],
      ),
    );
  }

  void _requestWalletCode() {
    if (walletNumberCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اكتب رقم المحفظة الأول')));
      return;
    }
    setState(() => codeSent = true);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('تم إرسال رمز التأكيد على ${walletNumberCtrl.text}')));
  }

  // ===== تأكيد الحجز - تحقق كامل الأول =====
  Future<void> _confirm() async {
    // 1 - بيانات المسافر
    if (firstNameCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('اكتب الاسم الأول')),
      );
      return;
    }
    if (lastNameCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('اكتب اسم العائلة')),
      );
      return;
    }
    if (emailCtrl.text.trim().isEmpty || !emailCtrl.text.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('اكتب بريد إلكتروني صحيح')),
      );
      return;
    }
    if (phoneCtrl.text.trim().length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('اكتب رقم هاتف صحيح')),
      );
      return;
    }

    // 2 - الدفع حسب الاختيار
    if (paymentMethod == 'بطاقة بنكية') {
      final digits = cardNumberCtrl.text.replaceAll(RegExp(r'[^0-9]'), '');
      if (cardNameCtrl.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اكتب اسم حامل البطاقة')),
        );
        return;
      }
      if (digits.length != 16) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('رقم البطاقة لازم يكون 16 رقم')),
        );
        return;
      }
      if (expiryCtrl.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اكتب تاريخ انتهاء البطاقة')),
        );
        return;
      }
      if (cvvCtrl.text.trim().length != 3) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('رمز الأمان لازم يكون 3 أرقام')),
        );
        return;
      }
    }

    if (paymentMethod == 'محفظة إلكترونية') {
      if (walletNumberCtrl.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اكتب رقم المحفظة')),
        );
        return;
      }
      if (!codeSent) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('دوس طلب رمز التأكيد الأول')),
        );
        return;
      }
      if (walletCodeCtrl.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اكتب رمز تأكيد المحفظة')),
        );
        return;
      }
    }

    // 3 - الموافقة
    if (!agreed) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('وافق على الشروط وسياسة الإلغاء أولاً')),
      );
      return;
    }

    // محاكاة تعذر الدفع الإلكتروني، مع إبقاء صفحة إكمال الحجز مفتوحة
    // حتى يستطيع المستخدم إعادة المحاولة أو اختيار وسيلة دفع أخرى.
    if (paymentMethod == 'بطاقة بنكية' || paymentMethod == 'محفظة إلكترونية') {
      final result = await Navigator.push<String>(
        context,
        MaterialPageRoute(
          builder: (_) => PaymentFailedScreen(
            bookingTitle: widget.title,
            bookingSubtitle: 'طلبك محفوظ للمراجعة',
          ),
        ),
      );
      if (!mounted) return;
      if (result == 'محفظة إلكترونية' || result == 'الدفع عند الوصول') {
        setState(() => paymentMethod = result!);
      }
      return;
    }

    // تجهيز بيانات الحجز من البيانات التي أدخلها المستخدم واختارها فعلاً.
    final booking = BookingData(
      title: widget.title,
      subTitle: widget.subTitle,
      image: widget.image,
      dateRange: widget.dateRange,
      nights: widget.nights,
      travelers: widget.travelers,
      pricePerNight: widget.pricePerNight,
      guestName: '${firstNameCtrl.text.trim()} ${lastNameCtrl.text.trim()}',
      email: emailCtrl.text.trim(),
      paymentMethod: paymentMethod,
      bookingRef: 'TRV-2027-1048',
      isPaid: paymentMethod != 'الدفع عند الوصول',
    );

    var confirmationOpen = true;
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      isDismissible: false,
      enableDrag: false,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                InkWell(
                  onTap: () {
                    confirmationOpen = false;
                    Navigator.pop(sheetContext);
                  },
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: lightBlueBg,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(Icons.close, size: 16, color: greyText),
                  ),
                ),
                const Spacer(),
                const Text(
                  'تأكيد حجزك',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFE8F5E9),
                borderRadius: BorderRadius.circular(50),
              ),
              child: const Icon(
                Icons.check,
                color: Color(0xFF2E7D32),
                size: 30,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'راجع بيانات الحجز وطريقة الدفع والتأكيد',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: greyText),
            ),
            const SizedBox(height: 6),
            const Text(
              'لحظات ونؤكد الحجز',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: greyText),
            ),
            const SizedBox(height: 14),
            const LinearProgressIndicator(
              color: navy,
              backgroundColor: lightBlueBg,
            ),
            const SizedBox(height: 14),
          ],
        ),
      ),
    );

    // بعد 3 ثوانٍ ننتقل تلقائياً لشاشة نجاح الحجز، إذا لم يغلق المستخدم الشيت.
    Future.delayed(const Duration(seconds: 3), () {
      if (!mounted || !confirmationOpen) return;
      Navigator.pop(context);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => PaymentSuccessScreen(booking: booking),
        ),
      );
    });
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
            const Text('أكمل حجزك',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('راجع الطلب وبيانات المسافر وطريقة الدفع',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),

            // ===== كارت الفندق - كله متغير من صفحة الغرف =====
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(widget.image,
                            height: 170,
                            width: double.infinity,
                            fit: BoxFit.cover)),
                    const SizedBox(height: 12),
                    Text(widget.title,
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 4),
                    Text(widget.subTitle,
                        style: const TextStyle(
                            fontSize: 13,
                            color: navy,
                            fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    _info(Icons.calendar_today_outlined,
                        '${widget.dateRange} • ${widget.nights} ليالي • ${widget.travelers} مسافران'),
                    _info(Icons.bed_outlined,
                        '${widget.pricePerNight} ج.م / ليلة'),
                    const Divider(height: 24),
                    _row('الخدمة والضرائب', 'مشمولة في السعر'),
                    const SizedBox(height: 8),
                    Row(children: [
                      const Text('الإجمالي',
                          style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      const Spacer(),
                      Text('$total ج.م',
                          style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: navy))
                    ]),
                    const SizedBox(height: 12),
                    SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                            onPressed: _showCancelPolicy,
                            style: OutlinedButton.styleFrom(
                                foregroundColor: navy,
                                side: const BorderSide(color: lightBorder),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12))),
                            child: const Text('مراجعة سياسة الإلغاء'))),
                  ]),
            ),
            const SizedBox(height: 16),

            // ===== المسافر الرئيسي =====
            _title('المسافر الرئيسي'), const SizedBox(height: 10),
            Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: whiteCard, borderRadius: BorderRadius.circular(16)),
                child: Column(children: [
                  _field('الاسم الأول', firstNameCtrl),
                  _field('اسم العائلة', lastNameCtrl),
                  _field('البريد الإلكتروني', emailCtrl,
                      keyboard: TextInputType.emailAddress),
                  _field('رقم الهاتف', phoneCtrl,
                      keyboard: TextInputType.phone, isLast: true)
                ])),
            const SizedBox(height: 16),

            // ===== طريقة الدفع - 3 اختيارات =====
            _title('طريقة الدفع'), const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // الـ 3 زراير فوق بعض زي الفيديو
                    _payOption('بطاقة بنكية', Icons.credit_card),
                    _payOption('محفظة إلكترونية', Icons.account_balance_wallet),
                    _payOption('الدفع عند الوصول', Icons.money),

                    if (paymentMethod == 'بطاقة بنكية') ...[
                      const SizedBox(height: 8),
                      _field('اسم حامل البطاقة', cardNameCtrl),
                      _field('رقم البطاقة', cardNumberCtrl,
                          keyboard: TextInputType.number,
                          hint: '0000 0000 0000 0000', onChanged: (v) {
                        final f = _formatCard(v);
                        if (f != v)
                          cardNumberCtrl.value = TextEditingValue(
                              text: f,
                              selection:
                                  TextSelection.collapsed(offset: f.length));
                      }),
                      Row(children: [
                        Expanded(
                            child: _field('تاريخ الانتهاء', expiryCtrl,
                                keyboard: TextInputType.number,
                                hint: 'MM / YYYY', onChanged: (v) {
                          final f = _formatExpiry(v);
                          if (f != v)
                            expiryCtrl.value = TextEditingValue(
                                text: f,
                                selection:
                                    TextSelection.collapsed(offset: f.length));
                        })),
                        const SizedBox(width: 12),
                        Expanded(
                            child: _field('رمز الأمان', cvvCtrl,
                                keyboard: TextInputType.number,
                                hint: 'CVV',
                                maxLength: 3))
                      ]),
                    ],

                    if (paymentMethod == 'محفظة إلكترونية') ...[
                      const SizedBox(height: 8),
                      _field('رقم المحفظة', walletNumberCtrl,
                          keyboard: TextInputType.phone, hint: '01xxxxxxxxx'),
                      SizedBox(
                          width: double.infinity,
                          child: OutlinedButton(
                              onPressed: _requestWalletCode,
                              style: OutlinedButton.styleFrom(
                                  foregroundColor: navy,
                                  side: const BorderSide(color: lightBorder),
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                              child: const Text('طلب رمز التأكيد'))),
                      const SizedBox(height: 12),
                      _field('رمز تأكيد المحفظة', walletCodeCtrl,
                          keyboard: TextInputType.number,
                          hint: 'اكتب الرمز اللي وصلك',
                          maxLength: 6),
                      if (codeSent)
                        const Padding(
                            padding: EdgeInsets.only(top: 4),
                            child: Text('تم إرسال الرمز - راجع تطبيق المحفظة',
                                style: TextStyle(fontSize: 12, color: navy))),
                    ],

                    if (paymentMethod == 'الدفع عند الوصول') ...[
                      const SizedBox(height: 8),
                      Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                              color: lightBlueBg,
                              borderRadius: BorderRadius.circular(12)),
                          child: const Text(
                              'الدفع عند الوصول\nالإجمالي مستحق عند الوصول • لن يخصم المبلغ الآن',
                              style: TextStyle(
                                  fontSize: 13,
                                  color: textColor,
                                  height: 1.6))),
                      const SizedBox(height: 10),
                      SizedBox(
                          width: double.infinity,
                          child: TextButton(
                              onPressed: _showCashTerms,
                              child: const Text('عرض شروط الدفع عند الوصول',
                                  style: TextStyle(
                                      color: navy,
                                      fontWeight: FontWeight.bold)))),
                    ],
                  ]),
            ),
            const SizedBox(height: 16),

            // ===== إتمام الحجز =====
            _title('إتمام الحجز'), const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: whiteCard, borderRadius: BorderRadius.circular(16)),
              child: Column(children: [
                InkWell(
                    onTap: () => setState(() => agreed = !agreed),
                    child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Checkbox(
                              value: agreed,
                              onChanged: (v) =>
                                  setState(() => agreed = v ?? false),
                              activeColor: navy),
                          const Expanded(
                              child: Padding(
                                  padding: EdgeInsets.only(top: 12),
                                  child: Text(
                                      'أوافق على الشروط وسياسة الإلغاء المعروضة لهذا الطلب',
                                      style: TextStyle(
                                          fontSize: 13, color: textColor))))
                        ])),
                const SizedBox(height: 8),
                SizedBox(
                    width: double.infinity,
                    child: TextButton(
                        onPressed: _showCancelPolicy,
                        child: const Text('شروط الحجز',
                            style: TextStyle(
                                color: navy, fontWeight: FontWeight.bold)))),
                const SizedBox(height: 8),
                SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                        onPressed: _confirm,
                        style: ElevatedButton.styleFrom(
                            backgroundColor: navy,
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14))),
                        child: Text('تأكيد الحجز والدفع • $total ج.م',
                            style: const TextStyle(
                                fontSize: 15, fontWeight: FontWeight.bold)))),
                const SizedBox(height: 10),
                const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.lock_outline, size: 14, color: greyText),
                      SizedBox(width: 4),
                      Text('حجز آمن • تفاصيل الدفع مشفرة',
                          style: TextStyle(fontSize: 12, color: greyText))
                    ]),
              ]),
            ),
            const SizedBox(height: 16),

            // ===== مساعدة =====
            InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const SupportScreen(),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: whiteCard,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: lightBlueBg,
                      child: Icon(Icons.headset_mic_outlined, color: navy),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'مساعدة في الحجز؟',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'راجع التفاصيل أو تواصل معنا في أي وقت',
                            style: TextStyle(fontSize: 12, color: greyText),
                          ),
                        ],
                      ),
                    ),
                    Icon(Icons.arrow_forward_ios, size: 14, color: greyText),
                  ],
                ),
              ),
            ),
          ]),
        ),
      ),
    );
  }

  Widget _title(String t) => Text(t,
      style: const TextStyle(
          fontSize: 16, fontWeight: FontWeight.bold, color: textColor));
  Widget _info(IconData i, String t) => Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(children: [
        Icon(i, size: 16, color: navy),
        const SizedBox(width: 8),
        Expanded(
            child:
                Text(t, style: const TextStyle(fontSize: 13, color: textColor)))
      ]));
  Widget _row(String l, String v) => Row(children: [
        Text(l, style: const TextStyle(fontSize: 13, color: greyText)),
        const Spacer(),
        Text(v, style: const TextStyle(fontSize: 13, color: textColor))
      ]);

  Widget _payOption(String label, IconData icon) {
    final selected = paymentMethod == label;
    return InkWell(
      onTap: () => setState(() => paymentMethod = label),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: double.infinity,
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
            color: selected ? navy : lightBlueBg,
            borderRadius: BorderRadius.circular(12)),
        child: Row(children: [
          Icon(icon, color: selected ? Colors.white : navy, size: 20),
          const SizedBox(width: 10),
          Expanded(
              child: Text(label,
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: selected ? Colors.white : textColor))),
          if (selected)
            const Icon(Icons.check_circle, color: Colors.white, size: 20)
        ]),
      ),
    );
  }

  Widget _field(String label, TextEditingController ctrl,
      {TextInputType keyboard = TextInputType.text,
      String? hint,
      int? maxLength,
      bool isLast = false,
      void Function(String)? onChanged}) {
    return Padding(
      padding: EdgeInsets.only(bottom: isLast ? 0 : 12),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label,
            style: const TextStyle(
                fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 6),
        TextField(
            controller: ctrl,
            keyboardType: keyboard,
            maxLength: maxLength,
            onChanged: onChanged,
            decoration: InputDecoration(
                hintText: hint,
                counterText: '',
                filled: true,
                fillColor: lightBlueBg,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none))),
      ]),
    );
  }
}
