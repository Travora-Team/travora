import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:my_app/core/core.dart';

void showShareTripSheet(
  BuildContext context, {
  required String destination,
  required int duration,
}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => ShareTripSheet(
      destination: destination,
      duration: duration,
    ),
  );
}

class ShareTripSheet extends StatefulWidget {
  final String destination;
  final int duration;

  const ShareTripSheet({
    super.key,
    required this.destination,
    required this.duration,
  });

  @override
  State<ShareTripSheet> createState() => _ShareTripSheetState();
}

class _ShareTripSheetState extends State<ShareTripSheet> {
  late final String tripLink;
  bool copied = false;

  @override
  void initState() {
    super.initState();
    final code = 1000 + DateTime.now().millisecondsSinceEpoch % 9000;
    final slug = widget.destination
        .replaceAll(' ', '')
        .replaceAll('القاهرة', 'cairo')
        .replaceAll('الجيزة', 'giza');
    tripLink = 'travora.example/trip/$slug-$code';
  }

  Future<void> _copyLink() async {
    await Clipboard.setData(ClipboardData(text: 'https://$tripLink'));
    if (!mounted) return;
    setState(() => copied = true);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('تم نسخ الرابط'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 12,
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        ),
        decoration: const BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 45,
                height: 5,
                decoration: BoxDecoration(
                  color: lightBorder,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'شارك رحلتك',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                ),
                InkWell(
                  onTap: () => Navigator.pop(context),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: lightBlueBg,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(Icons.close, size: 18, color: textColor),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Center(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: lightBlueBg,
                  borderRadius: BorderRadius.circular(50),
                ),
                child: const Icon(Icons.send, color: navy, size: 32),
              ),
            ),
            const SizedBox(height: 14),
            Center(
              child: Text(
                '${widget.destination} • ${widget.duration} أيام',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
            ),
            const SizedBox(height: 6),
            const Center(
              child: Text(
                'أرسل رابط خطتك لمن يسافر معك',
                style: TextStyle(fontSize: 13, color: greyText),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'رابط الرحلة',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
              decoration: BoxDecoration(
                color: lightBlueBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                tripLink,
                textDirection: TextDirection.ltr,
                textAlign: TextAlign.left,
                style: const TextStyle(
                  fontSize: 13,
                  color: navy,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _copyLink,
                style: ElevatedButton.styleFrom(
                  backgroundColor: navy,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: Text(
                  copied ? 'تم النسخ ✓' : 'نسخ الرابط',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Shared cancellation policy used by hotel and pyramids screens.
void showTravoraCancellationPolicy(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => _sharedCancellationSheet(
      context,
      title: 'سياسة الإلغاء والتعديل',
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('راجع الشروط قبل الوصول بـ 7 أيام',
            style: TextStyle(
                fontWeight: FontWeight.bold, fontSize: 16, color: textColor)),
        const SizedBox(height: 10),
        const Text('إلغاء مجاني',
            style: TextStyle(fontWeight: FontWeight.bold, color: navy)),
        const Text('إلغاء مجاني في هذا المسار قبل المهلة.',
            style: TextStyle(color: greyText)),
        const SizedBox(height: 12),
        const Text('بعد المهلة',
            style: TextStyle(fontWeight: FontWeight.bold, color: navy)),
        const Text('قد تُطبق رسوم وفق نوع الغرفة والخدمة.',
            style: TextStyle(color: greyText)),
        const SizedBox(height: 12),
        const Text('الاسترداد',
            style: TextStyle(fontWeight: FontWeight.bold, color: navy)),
        const Text('تظهر طريقة الاسترداد والمهلة في تفاصيل الحجز والأسعار.',
            style: TextStyle(color: greyText)),
        const SizedBox(height: 20),
        SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                    backgroundColor: navy,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14))),
                child: const Text('فهمت',
                    style: TextStyle(
                        color: Colors.white, fontWeight: FontWeight.bold)))),
      ]),
    ),
  );
}

Widget _sharedCancellationSheet(
  BuildContext context, {
  required String title,
  required Widget child,
}) {
  return DraggableScrollableSheet(
    initialChildSize: 0.75,
    builder: (_, ctrl) => Container(
      decoration: const BoxDecoration(
        color: whiteCard,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: SingleChildScrollView(
        controller: ctrl,
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context)),
              ],
            ),
            const SizedBox(height: 12),
            child,
          ],
        ),
      ),
    ),
  );
}

// ==================== CHECKOUT SCREEN - أكمل حجزك ====================

