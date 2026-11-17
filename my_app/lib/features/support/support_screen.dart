import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/my_bookings_screen.dart';
import 'package:my_app/features/info/faq_screen.dart';
import 'package:my_app/features/support/widgets/support_widgets.dart';

class SupportScreen extends StatefulWidget {
  const SupportScreen({super.key});

  @override
  State<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends State<SupportScreen> {
  String selectedTopic = 'استفسار عن تعديل الحجز';
  final List<String> topics = [
    'استفسار عن تعديل الحجز',
    'تعديل حجز',
    'استفسار عن الإلغاء',
    'مشكلة في الدفع',
    'استفسار عام',
  ];

  final TextEditingController emailController = TextEditingController();
  final TextEditingController messageController = TextEditingController();

  @override
  void dispose() {
    emailController.dispose();
    messageController.dispose();
    super.dispose();
  }

  void _showTopicSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('موضوع الطلب',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: textColor)),
                IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, size: 20, color: greyText)),
              ],
            ),
            const SizedBox(height: 12),
            ...topics.map((t) => InkWell(
                  onTap: () {
                    setState(() => selectedTopic = t);
                    Navigator.pop(context);
                  },
                  child: Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: selectedTopic == t
                          ? lightBlueBg
                          : const Color(0xFFF8FBFF),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: selectedTopic == t ? navy : lightBorder),
                    ),
                    child: Text(t,
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: selectedTopic == t
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: textColor)),
                  ),
                )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ===== العنوان =====
                    const Text('الدعم والمساعدة',
                        style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 4),
                    const Text('نساعدك في الخطوة التالية',
                        style: TextStyle(fontSize: 13, color: greyText)),
                    const SizedBox(height: 16),

                    // ===== سكشن 1 : الأسئلة الشائعة + إدارة حجزي =====
                    SupportOptionCard(
                      icon: Icons.headset_mic_outlined,
                      title: 'الأسئلة الشائعة',
                      sub: 'إجابات عن الحجز والتخطيط',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const FaqScreen(),
                          ),
                        );
                      },
                    ),
                    SupportOptionCard(
                      icon: Icons.calendar_today_outlined,
                      title: 'إدارة حجزي',
                      sub: 'التعديل والإلغاء ومراجعة التفاصيل',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const MyBookingsScreen(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 20),

                    // ===== سكشن 2 : أرسل طلب مساعدة =====
                    const Text('أرسل طلب مساعدة',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                          color: whiteCard,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: lightBorder)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // موضوع الطلب - مش ثابت، بيتغير
                          const Text('موضوع الطلب',
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: textColor)),
                          const SizedBox(height: 8),
                          InkWell(
                            onTap: _showTopicSheet,
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 14),
                              decoration: BoxDecoration(
                                  color: backgroundColor,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: lightBorder)),
                              child: Row(children: [
                                Expanded(
                                    child: Text(selectedTopic,
                                        style: const TextStyle(
                                            fontSize: 13, color: textColor))),
                                const Icon(Icons.keyboard_arrow_down,
                                    color: greyText, size: 20),
                              ]),
                            ),
                          ),
                          const SizedBox(height: 14),

                          // البريد الإلكتروني - مش ثابت، انتي اللي بتكتبيه
                          const Text('البريد الإلكتروني',
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: textColor)),
                          const SizedBox(height: 8),
                          TextField(
                            controller: emailController,
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              hintText: 'اكتب بريدك الإلكتروني',
                              hintStyle: const TextStyle(
                                  fontSize: 12, color: greyText),
                              filled: true,
                              fillColor: backgroundColor,
                              enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide:
                                      const BorderSide(color: lightBorder)),
                              focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: const BorderSide(color: navy)),
                            ),
                          ),
                          const SizedBox(height: 14),

                          // رسالتك - فاضية، انتي اللي بتكتبيها
                          const Text('رسالتك',
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: textColor)),
                          const SizedBox(height: 8),
                          TextField(
                            controller: messageController,
                            maxLines: 4,
                            decoration: InputDecoration(
                              hintText: 'اكتب رسالتك هنا...',
                              hintStyle: const TextStyle(
                                  fontSize: 12, color: greyText),
                              filled: true,
                              fillColor: backgroundColor,
                              enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide:
                                      const BorderSide(color: lightBorder)),
                              focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: const BorderSide(color: navy)),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // زرار إرسال الطلب
                          SizedBox(
                            width: double.infinity,
                            height: 48,
                            child: ElevatedButton(
                              onPressed: () {
                                if (emailController.text.trim().isEmpty ||
                                    messageController.text.trim().isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                          content: Text(
                                              'من فضلك اكتب البريد الإلكتروني ورسالتك')));
                                  return;
                                }
                                ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                        content: Text(
                                            'تم إرسال طلبك بنجاح ✅ سنتواصل معك قريباً')));
                                emailController.clear();
                                messageController.clear();
                              },
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: navy,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12))),
                              child: const Text('إرسال الطلب',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // ===== سكشن 3 : كل تفاصيل الطلب في مكان واحد =====
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                          color: lightBlueBg,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: lightBorder)),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('كل تفاصيل الطلب في مكان واحد',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: textColor)),
                          SizedBox(height: 6),
                          Text(
                              'أضف رقم الحجز لرسالتك ليسهل الاستفسار ومتابعة طلبك في حسابك',
                              style: TextStyle(
                                  fontSize: 12, color: greyText, height: 1.5)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
