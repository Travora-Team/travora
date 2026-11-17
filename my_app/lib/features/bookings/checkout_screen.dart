import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/experiences/experience_booking_screens.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/transport/transport_service_screens.dart';

class CheckoutScreen extends StatefulWidget {
  final String title;
  final String image;
  final String guide;
  final String date;
  final String time;
  final int hours;
  final int pricePerPerson;
  final int travelers;

  const CheckoutScreen({
    super.key,
    this.title = 'جولة الأهرامات وأبو الهول',
    this.image = pyramidsImage,
    this.guide = 'مرشد عربي',
    this.date = '15 مارس 2027',
    this.time = '9:00 صباحاً',
    this.hours = 4,
    this.pricePerPerson = 650,
    this.travelers = 2,
  });

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  // بيانات المسافر - جاية من إنشاء الحساب، وتقدري تغيريها
  final firstNameCtrl = TextEditingController(text: '');
  final lastNameCtrl = TextEditingController(text: '');
  final emailCtrl = TextEditingController(text: '');
  final phoneCtrl = TextEditingController(text: '');

  // الدفع
  String paymentMethod = 'بطاقة بنكية';
  final cardNameCtrl = TextEditingController(text: '');
  final cardNumberCtrl = TextEditingController(text: '');
  final expiryCtrl = TextEditingController(text: ' ');
  final cvvCtrl = TextEditingController(text: '***');

  bool agreed = false;

  int get total => widget.pricePerPerson * widget.travelers;

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
    super.dispose();
  }

  // تنسيق رقم البطاقة: كل 4 أرقام مسافة - 16 رقم
  String _formatCardNumber(String value) {
    final digits = value.replaceAll(RegExp(r'[^0-9]'), '');
    final limited = digits.length > 16 ? digits.substring(0, 16) : digits;
    final buffer = StringBuffer();
    for (int i = 0; i < limited.length; i++) {
      if (i > 0 && i % 4 == 0) buffer.write(' ');
      buffer.write(limited[i]);
    }
    return buffer.toString();
  }

  // تنسيق تاريخ الانتهاء MM / YYYY
  String _formatExpiry(String value) {
    final digits = value.replaceAll(RegExp(r'[^0-9]'), '');
    final limited = digits.length > 6 ? digits.substring(0, 6) : digits;
    if (limited.length <= 2) return limited;
    return '${limited.substring(0, 2)} / ${limited.substring(2)}';
  }

  void _pickPaymentMethod() {
    showModalBottomSheet(
      context: context,
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
            const Text('طريقة الدفع',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 6),
            const Text('خيارات الدفع المتاحة لحجزك',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 16),
            _paymentOption('بطاقة بنكية', Icons.credit_card),
            _paymentOption('الدفع عند الوصول', Icons.money),
            _paymentOption('محفظة إلكترونية', Icons.account_balance_wallet),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  Widget _paymentOption(String label, IconData icon) {
    final selected = paymentMethod == label;
    return InkWell(
      onTap: () {
        setState(() => paymentMethod = label);
        Navigator.pop(context);
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: selected ? lightBlueBg : whiteCard,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? navy : lightBorder),
        ),
        child: Row(
          children: [
            Icon(icon, color: navy, size: 22),
            const SizedBox(width: 12),
            Expanded(
              child: Text(label,
                  style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
            ),
            if (selected) const Icon(Icons.check_circle, color: navy),
          ],
        ),
      ),
    );
  }

  void _showCancelPolicy() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: whiteCard,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('سياسة الإلغاء',
            style: TextStyle(fontWeight: FontWeight.bold, color: textColor)),
        content: const Text(
          'يمكنك إلغاء الحجز مجاناً قبل 48 ساعة من موعد الجولة.\n\nفي حالة الإلغاء قبل 24 ساعة يتم خصم 50% من قيمة الحجز.\n\nلا يمكن استرداد المبلغ في حالة الإلغاء في نفس يوم الجولة.',
          style: TextStyle(fontSize: 13, color: textColor, height: 1.6),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('فهمت',
                style: TextStyle(color: navy, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmBooking() async {
    if (!agreed) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('من فضلك وافق على الشروط وسياسة الإلغاء أولاً')),
      );
      return;
    }
    if (firstNameCtrl.text.trim().isEmpty || emailCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('من فضلك أكمل بيانات المسافر الرئيسي')),
      );
      return;
    }
    if (paymentMethod == 'بطاقة بنكية') {
      final digits = cardNumberCtrl.text.replaceAll(RegExp(r'[^0-9]'), '');
      if (digits.length < 16 || cvvCtrl.text.length != 3) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content:
                  Text('رقم البطاقة لازم يكون 16 رقم، ورمز الأمان 3 أرقام')),
        );
        return;
      }
    }
    // محاكاة تعذر الدفع الإلكتروني: نعرض شاشة الفشل ونسمح بتغيير طريقة الدفع.
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

    final guestName =
        '${firstNameCtrl.text.trim()} ${lastNameCtrl.text.trim()}'.trim();

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => ExperiencePaymentSuccessScreen(
          title: widget.title,
          image: widget.image,
          guide: widget.guide,
          date: widget.date,
          time: widget.time,
          hours: widget.hours,
          pricePerPerson: widget.pricePerPerson,
          travelers: widget.travelers,
          guestName: guestName,
          email: emailCtrl.text.trim(),
          phone: phoneCtrl.text.trim(),
          paymentMethod: paymentMethod,
          bookingRef: 'TRV-EXP-2027-001',
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
              // العنوان
              const Text('أكمل حجزك',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              const Text('راجع الطلب وبيانات المسافر وطريقة الدفع',
                  style: TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 16),

              // ============ ملخص الرحلة ============
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
                          height: 160,
                          width: double.infinity,
                          fit: BoxFit.cover),
                    ),
                    const SizedBox(height: 12),
                    Text(widget.title,
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 8),
                    _infoRow(Icons.person_outline,
                        '${widget.guide} • ${widget.hours} ساعات'),
                    _infoRow(Icons.calendar_today_outlined,
                        '${widget.date} • ${widget.time}'),
                    _infoRow(Icons.group_outlined,
                        '${widget.pricePerPerson} ج.م × ${widget.travelers} مسافرين'),
                    const Divider(height: 24),
                    _priceRow('الخدمة والضرائب', 'مشمولة في السعر'),
                    const SizedBox(height: 8),
                    Row(
                      children: [
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
                                color: navy)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: _showCancelPolicy,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: navy,
                          side: const BorderSide(color: lightBorder),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('مراجعة سياسة الإلغاء'),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ============ المسافر الرئيسي ============
              _sectionTitle('المسافر الرئيسي'),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: whiteCard, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
                    _field('الاسم الأول', firstNameCtrl),
                    _field('اسم العائلة', lastNameCtrl),
                    _field('البريد الإلكتروني', emailCtrl,
                        keyboard: TextInputType.emailAddress),
                    _field('رقم الهاتف', phoneCtrl,
                        keyboard: TextInputType.phone, isLast: true),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ============ طريقة الدفع ============
              _sectionTitle('طريقة الدفع'),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: whiteCard, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('طريقة الدفع المختارة',
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: _pickPaymentMethod,
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(12)),
                        child: Row(
                          children: [
                            const Icon(Icons.credit_card, color: navy),
                            const SizedBox(width: 10),
                            Expanded(
                                child: Text(paymentMethod,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: textColor))),
                            const Icon(Icons.keyboard_arrow_down,
                                color: greyText),
                          ],
                        ),
                      ),
                    ),
                    if (paymentMethod == 'بطاقة بنكية') ...[
                      const SizedBox(height: 14),
                      _field('اسم حامل البطاقة', cardNameCtrl),
                      _field('رقم البطاقة', cardNumberCtrl,
                          keyboard: TextInputType.number,
                          hint: '0000 0000 0000 0000', onChanged: (v) {
                        final formatted = _formatCardNumber(v);
                        if (formatted != v) {
                          cardNumberCtrl.value = TextEditingValue(
                              text: formatted,
                              selection: TextSelection.collapsed(
                                  offset: formatted.length));
                        }
                      }),
                      Row(
                        children: [
                          Expanded(
                            child: _field('تاريخ الانتهاء', expiryCtrl,
                                keyboard: TextInputType.number,
                                hint: 'MM / YYYY', onChanged: (v) {
                              final formatted = _formatExpiry(v);
                              if (formatted != v) {
                                expiryCtrl.value = TextEditingValue(
                                    text: formatted,
                                    selection: TextSelection.collapsed(
                                        offset: formatted.length));
                              }
                            }),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _field('رمز الأمان', cvvCtrl,
                                keyboard: TextInputType.number,
                                hint: 'CVV',
                                maxLength: 3),
                          ),
                        ],
                      ),
                    ] else
                      Padding(
                        padding: const EdgeInsets.only(top: 12),
                        child: Text(
                          paymentMethod == 'الدفع عند الوصول'
                              ? 'هتدفع كاش لما توصل لمكان الجولة.'
                              : 'هتتحول لتطبيق المحفظة لإتمام الدفع.',
                          style: const TextStyle(fontSize: 12, color: greyText),
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ============ إتمام الحجز ============
              _sectionTitle('إتمام الحجز'),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: whiteCard, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
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
                              child: Text('أوافق على الشروط وسياسة الإلغاء',
                                  style: TextStyle(
                                      fontSize: 13, color: textColor)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      child: TextButton(
                        onPressed: _showCancelPolicy,
                        child: const Text('شروط الحجز',
                            style: TextStyle(
                                color: navy, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _confirmBooking,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: navy,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                        ),
                        child: Text('تأكيد الحجز والدفع • $total ج.م',
                            style: const TextStyle(
                                fontSize: 15, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.lock_outline, size: 14, color: greyText),
                        SizedBox(width: 4),
                        Text('حجز آمن • تفاصيل الدفع مشفرة',
                            style: TextStyle(fontSize: 12, color: greyText)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ============ مساعدة ============
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
                              'فريقنا موجود لمساعدتك في أي وقت',
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
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionTitle(String t) => Text(t,
      style: const TextStyle(
          fontSize: 16, fontWeight: FontWeight.bold, color: textColor));

  Widget _infoRow(IconData icon, String text) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Row(
          children: [
            Icon(icon, size: 16, color: navy),
            const SizedBox(width: 8),
            Expanded(
                child: Text(text,
                    style: const TextStyle(fontSize: 13, color: textColor))),
          ],
        ),
      );

  Widget _priceRow(String label, String value) => Row(
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: greyText)),
          const Spacer(),
          Text(value, style: const TextStyle(fontSize: 13, color: textColor)),
        ],
      );

  Widget _field(
    String label,
    TextEditingController ctrl, {
    TextInputType keyboard = TextInputType.text,
    String? hint,
    int? maxLength,
    bool isLast = false,
    void Function(String)? onChanged,
  }) {
    return Padding(
      padding: EdgeInsets.only(bottom: isLast ? 0 : 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
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
                  borderSide: BorderSide.none),
            ),
          ),
        ],
      ),
    );
  }
}

// ==================== LIVE TRIP SCREEN V2 - تم تحديث خطة رحلتك ====================
