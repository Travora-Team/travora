import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/payment_screens.dart';
import 'package:my_app/features/destinations/cairo_detail_screen.dart';
import 'package:my_app/features/destinations/destinations_screen.dart';
import 'package:my_app/features/experiences/explore_activities_screen.dart';
import 'package:my_app/features/experiences/pyramids_experience_screen.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});
  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  String filter = 'الكل';

  void _openFav(FavItem item) {
    if (item.id == 'sharm') {
      Navigator.push(context,
          MaterialPageRoute(builder: (_) => const DestinationsScreen()));
    } else if (item.id == 'nile') {
      final booking = BookingData(
          title: 'إقامة فاخرة على ضفاف النيل',
          subTitle: 'ديلوكس • إفطار شامل',
          image: item.image,
          dateRange: '15 - 18 مارس 2027',
          nights: 3,
          travelers: 2,
          pricePerNight: 6800,
          guestName: TravoraUser.name,
          email: TravoraUser.email,
          paymentMethod: 'بطاقة بنكية',
          bookingRef: 'TRV-2027-1048',
          isPaid: true);
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (_) => BookingDetailsScreen(booking: booking)));
    } else if (item.id == 'pyramids') {
      Navigator.push(context,
          MaterialPageRoute(builder: (_) => const DestinationsScreen()));
    } else if (item.id == 'home_cairo') {
      Navigator.push(context,
          MaterialPageRoute(builder: (_) => const CairoDetailScreen()));
    } else if (item.id == 'home_pyramids_sphinx') {
      Navigator.push(context,
          MaterialPageRoute(builder: (_) => const PyramidsExperienceScreen()));
    } else if (item.id == 'home_old_cairo_khan') {
      Navigator.push(context,
          MaterialPageRoute(builder: (_) => const ExploreActivitiesScreen()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: ValueListenableBuilder<List<FavItem>>(
          valueListenable: TravoraFavorites.items,
          builder: (_, all, __) {
            final list = filter == 'الكل'
                ? all
                : all.where((e) => e.category == filter).toList();
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('المفضلة',
                        style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 4),
                    const Text('كل ما أحببته محفوظ في الرحلة',
                        style: TextStyle(fontSize: 13, color: greyText)),
                    const SizedBox(height: 16),
                    Row(
                      children:
                          ['الكل', 'الوجهات', 'الفنادق', 'التجارب'].map((f) {
                        return Expanded(
                          child: InkWell(
                            onTap: () {
                              setState(() {
                                filter = f;
                              });
                            },
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 3),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: filter == f ? navy : whiteCard,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: lightBorder),
                              ),
                              child: Center(
                                child: Text(
                                  f,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color:
                                        filter == f ? Colors.white : textColor,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),
                    if (list.isEmpty)
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
                              child: const Icon(Icons.favorite_border,
                                  color: navy, size: 36)),
                          const SizedBox(height: 14),
                          const Text('ابدأ مجموعة أماكنك',
                              style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.bold,
                                  color: textColor)),
                          const SizedBox(height: 6),
                          const Text(
                              'اضغط على القلب في أي وجهة أو تجربة لتجدها هنا',
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
                                          builder: (_) =>
                                              const DestinationsScreen())),
                                  style: ElevatedButton.styleFrom(
                                      backgroundColor: navy,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(14))),
                                  child: const Text('اكتشف الوجهات',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)))),
                        ]),
                      )
                    else
                      ...list.map((item) => Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                                color: whiteCard,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: lightBorder)),
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Stack(children: [
                                    ClipRRect(
                                        borderRadius: BorderRadius.circular(12),
                                        child: Image.network(item.image,
                                            height: 160,
                                            width: double.infinity,
                                            fit: BoxFit.cover)),
                                    Positioned(
                                        top: 10,
                                        left: 10,
                                        child: FavButton(item: item))
                                  ]),
                                  const SizedBox(height: 12),
                                  Text(item.title,
                                      style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                          color: textColor)),
                                  const SizedBox(height: 4),
                                  Text(item.sub,
                                      style: const TextStyle(
                                          fontSize: 13, color: greyText)),
                                  if (item.price.isNotEmpty) ...[
                                    const SizedBox(height: 4),
                                    Text(item.price,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: navy))
                                  ],
                                  const SizedBox(height: 12),
                                  SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                          onPressed: () => _openFav(item),
                                          style: ElevatedButton.styleFrom(
                                              backgroundColor: navy,
                                              foregroundColor: Colors.white,
                                              shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(
                                                          12))),
                                          child: const Text('عرض التفاصيل'))),
                                  const SizedBox(height: 8),
                                  SizedBox(
                                    width: double.infinity,
                                    child: OutlinedButton(
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                const DestinationsScreen(),
                                          ),
                                        );
                                      },
                                      style: OutlinedButton.styleFrom(
                                        foregroundColor: navy,
                                        side: const BorderSide(
                                            color: lightBorder),
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                      ),
                                      child: const Text('اكتشف المزيد'),
                                    ),
                                  ),
                                ]),
                          )),
                    if (list.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      SizedBox(
                          width: double.infinity,
                          child: TextButton(
                              onPressed: () => TravoraFavorites.clear(),
                              child: const Text('عرض المفضلة فارغة',
                                  style: TextStyle(
                                      color: navy,
                                      fontWeight: FontWeight.bold)))),
                    ],
                  ]),
            );
          },
        ),
      ),
    );
  }
}

// ==================== 6 - صفحة الإشعارات ====================
