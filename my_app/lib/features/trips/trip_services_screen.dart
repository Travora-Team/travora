import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/destinations/destinations_screen.dart';
import 'package:my_app/features/experiences/explore_activities_screen.dart';
import 'package:my_app/features/hotels/hotel_detail_screen.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/transport/transport_screen.dart';
import 'package:my_app/features/trips/my_trips_screen.dart';

class TripServicesScreen extends StatelessWidget {
  const TripServicesScreen({super.key});

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
              // أزرار الدعم والمساعدة ظاهرة أسفل الشريط العلوي مباشرة
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  TextButton(
                    onPressed: () {},
                    child: const Text(
                      'الدعم',
                      style: TextStyle(
                        color: navy,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  TextButton(
                    onPressed: () {},
                    child: const Text(
                      'المساعدة',
                      style: TextStyle(
                        color: navy,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const Text('خدمات رحلتك',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 4),
              const Text('كل ما تحتاجه قبل الرحلة وأثناءها',
                  style: TextStyle(fontSize: 13, color: greyText)),
              const SizedBox(height: 20),
              const Text('الإقامة والتجارب',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 12),
              _serviceCard(
                title: 'اكتشف الوجهات',
                sub: 'مدن ومعالم وتجارب سياحية',
                action: 'استكشف',
                onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const DestinationsScreen())),
              ),
              _serviceCard(
                title: 'الفنادق',
                sub: 'غرف وتوافر وحجز إقامة',
                action: 'استكشف',
                onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const HotelDetailScreen())),
              ),
              _serviceCard(
                title: 'الأنشطة',
                sub: 'مغامرات ومعالم',
                action: 'استكشف',
                onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const ExploreActivitiesScreen())),
              ),
              _serviceCard(
                  title: 'المرشدون السياحيون',
                  sub: 'مرشد خاص بلغتك',
                  action: 'استكشف',
                  onTap: () {}),
              const SizedBox(height: 20),
              const Text('الطعام والتنقل',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 12),
              _serviceCard(
                  title: 'المطاعم وحجز الطاولات',
                  sub: 'قوائم وتوافر عربون الحجز',
                  action: 'استكشف',
                  onTap: () {}),
              _serviceCard(
                  title: 'توصيل الطعام',
                  sub: 'اطلب إلى الفندق وتابع التسليم',
                  action: 'استكشف',
                  onTap: () {}),
              _serviceCard(
                  title: 'النقل مع سائق',
                  sub: 'سيارة خاصة وتنقل من وإلى المطار',
                  action: 'احجز أثناء الرحلة',
                  onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const TransportScreen(),
                        ),
                      )),
              const SizedBox(height: 20),
              const Text('أثناء الرحلة',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: textColor)),
              const SizedBox(height: 12),
              _serviceCard(
                title: 'رحلتي والخريطة',
                sub: 'رحلاتي والخريطة',
                action: 'استكشف',
                onTap: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const MyTripsScreen())),
              ),
              _serviceCard(
                title: 'مساعدة أثناء الرحلة',
                sub: 'متابعة الطلبات والإلغاء',
                action: 'استكشف',
                onTap: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const SupportScreen())),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _serviceCard({
    required String title,
    required String sub,
    required String action,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: double.infinity,
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: lightBorder),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                  const SizedBox(height: 4),
                  Text(sub,
                      style: const TextStyle(fontSize: 13, color: greyText)),
                  const SizedBox(height: 6),
                  Text(action,
                      style: const TextStyle(
                          color: navy, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const Icon(Icons.arrow_back_ios, size: 14, color: greyText),
          ],
        ),
      ),
    );
  }
}

// ==================== 5 - صفحة المفضلة ====================
