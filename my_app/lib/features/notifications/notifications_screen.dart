import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/trips/my_trips_screen.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  void _showMarkedSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Row(children: [
            InkWell(
                onTap: () => Navigator.pop(context),
                child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                        color: lightBlueBg,
                        borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.close, size: 16, color: greyText))),
            const Spacer(),
            const Text('إشعارات محدثة',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: textColor))
          ]),
          const SizedBox(height: 14),
          Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                  color: const Color(0xFFE8F5E9),
                  borderRadius: BorderRadius.circular(50)),
              child:
                  const Icon(Icons.check, color: Color(0xFF2E7D32), size: 30)),
          const SizedBox(height: 12),
          const Text('تم تحديد الإشعارات الظاهرة كمقروءة',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: textColor, height: 1.6)),
          const SizedBox(height: 16),
          SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                      backgroundColor: navy,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14))),
                  child: const Text('العودة للإشعارات',
                      style: TextStyle(fontWeight: FontWeight.bold)))),
          const SizedBox(height: 8),
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('إغلاق',
                  style: TextStyle(color: navy, fontWeight: FontWeight.bold))),
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: ValueListenableBuilder<List<TravoraNotification>>(
          valueListenable: TravoraNotifications.items,
          builder: (_, list, __) => SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('الإشعارات',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              const Text('آخر التحديثات التي تهم رحلتك',
                  style: TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 16),
              if (list.isNotEmpty) ...[
                SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                        onPressed: () {
                          TravoraNotifications.markAllRead();
                          _showMarkedSheet(context);
                        },
                        style: OutlinedButton.styleFrom(
                            foregroundColor: navy,
                            side: const BorderSide(color: lightBorder),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12))),
                        child: const Text('تحديد الكل كمقروء'))),
                const SizedBox(height: 16),
                ...list.map((n) => Container(
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
                            child: const Icon(Icons.notifications_none,
                                color: navy)),
                        const SizedBox(width: 12),
                        Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                              Text(n.title,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: textColor)),
                              const SizedBox(height: 2),
                              Text(n.sub,
                                  style: const TextStyle(
                                      fontSize: 12, color: greyText)),
                              const SizedBox(height: 2),
                              Text(n.time,
                                  style: const TextStyle(
                                      fontSize: 11, color: greyText))
                            ]))
                      ]),
                    )),
              ] else
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                      color: whiteCard,
                      borderRadius: BorderRadius.circular(16)),
                  child: Column(children: [
                    Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                            color: lightBlueBg,
                            borderRadius: BorderRadius.circular(50)),
                        child: const Icon(Icons.notifications_none,
                            color: navy, size: 36)),
                    const SizedBox(height: 14),
                    const Text('أنت على اطلاع بكل شيء',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 6),
                    const Text('ستظهر هنا تنبيهاتك الحجوزات',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontSize: 13, color: greyText, height: 1.6)),
                    const SizedBox(height: 16),
                    SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                            onPressed: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const MyTripsScreen())),
                            style: ElevatedButton.styleFrom(
                                backgroundColor: navy,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14))),
                            child: const Text('اكتشف رحلتك القادمة',
                                style:
                                    TextStyle(fontWeight: FontWeight.bold)))),
                  ]),
                ),
            ]),
          ),
        ),
      ),
    );
  }
}