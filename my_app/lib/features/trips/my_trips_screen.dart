import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/my_bookings_screen.dart';
import 'package:my_app/features/destinations/cairo_detail_screen.dart';
import 'package:my_app/features/trips/trip_details_screen.dart';
import 'package:my_app/features/trips/trip_planner_screen.dart';
import 'package:my_app/features/trips/widgets/my_trips_widgets.dart';

class MyTripsScreen extends StatefulWidget {
  const MyTripsScreen({super.key});

  @override
  State<MyTripsScreen> createState() => _MyTripsScreenState();
}

class _MyTripsScreenState extends State<MyTripsScreen> {
  String selectedFilter = 'الكل';

  final List<Map<String, dynamic>> allTrips = [
    {
      'title': 'القاهرة والجيزة',
      'status': 'قادم',
      'statusColor': Colors.green,
      'date': '15 - 18 مارس 2027',
      'duration': '4 أيام',
      'travelers': '2 مسافران',
      'activities': '8 أنشطة',
      'img':
          'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=85',
      'type': 'upcoming',
      'isFav': false,
    },
    {
      'title': 'عطلة البحر الأحمر',
      'status': 'قادم',
      'statusColor': Colors.green,
      'date': '10 - 14 أبريل 2027',
      'duration': '5 أيام',
      'travelers': '2 مسافران',
      'activities': '6 أنشطة',
      'img':
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
      'type': 'upcoming',
      'isFav': false,
    },
    {
      'title': 'الأقصر وأسوان',
      'status': 'رحلة سابقة',
      'statusColor': greyText,
      'date': '20 - 24 فبراير 2027',
      'duration': '5 أيام',
      'travelers': '2 مسافران',
      'activities': '5 أنشطة',
      'img':
          'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=900&q=80',
      'type': 'past',
      'isFav': false,
    },
    {
      'title': 'القاهرة القديمة',
      'status': 'محفوظة',
      'statusColor': Colors.orange,
      'date': 'خطة ثقافية',
      'duration': '3 أيام',
      'travelers': 'لم تحجز بعد',
      'activities': '3 أنشطة',
      'img':
          'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=85',
      'type': 'saved',
      'isFav': false,
    },
  ];

  List<Map<String, dynamic>> get filteredTrips {
    if (selectedFilter == 'الكل') return allTrips;
    if (selectedFilter == 'القادمة') {
      return allTrips.where((t) => t['type'] == 'upcoming').toList();
    }
    if (selectedFilter == 'السابقة') {
      return allTrips.where((t) => t['type'] == 'past').toList();
    }
    if (selectedFilter == 'المحفوظة') {
      return allTrips.where((t) => t['type'] == 'saved').toList();
    }
    return allTrips;
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
                    // ===== 1. رحلاتي =====
                    const Text('رحلاتي',
                        style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                    const SizedBox(height: 4),
                    const Text('كل خططك وذكرياتك في مكان واحد',
                        style: TextStyle(fontSize: 13, color: greyText)),
                    const SizedBox(height: 16),

                    // ===== 2. ال 4 زرار جنب بعض =====
                    Row(
                      children:
                          ['الكل', 'القادمة', 'السابقة', 'المحفوظة'].map((f) {
                        final isSelected = selectedFilter == f;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => selectedFilter = f),
                            child: Container(
                              margin: const EdgeInsets.only(left: 6),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: isSelected ? navy : whiteCard,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                    color: isSelected ? navy : lightBorder),
                              ),
                              child: Center(
                                  child: Text(f,
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: isSelected
                                              ? Colors.white
                                              : textColor))),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 14),

                    // ===== 3. الأرقام: 1 قادمة / 2 الرحلات / 12 نشاط =====
                    const Row(
                      children: [
                        const TripStat(num: '2', label: 'قادمة'),
                        SizedBox(width: 8),
                        const TripStat(num: '1', label: 'الرحلات'),
                        SizedBox(width: 8),
                        const TripStat(num: '1', label: 'الأنشطة'),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // ===== 4. كروت الرحلات =====
                    ...filteredTrips.map((trip) {
                      final index = allTrips.indexOf(trip);
                      return TripCard(
                        img: trip['img'],
                        title: trip['title'],
                        status: trip['status'],
                        statusColor: trip['statusColor'],
                        date: trip['date'],
                        duration: trip['duration'],
                        travelers: trip['travelers'],
                        activities: trip['activities'],
                        isFav: TravoraFavorites.contains(
                            'trip_${index}_${trip['title']}'),
                        onFav: () {
                          final favoriteItem = FavItem(
                            id: 'trip_${index}_${trip['title']}',
                            title: trip['title'],
                            sub:
                                '${trip['date']} • ${trip['duration']} • ${trip['travelers']}',
                            image: trip['img'],
                            price: '',
                            category: 'الوجهات',
                          );
                          final wasFavorite =
                              TravoraFavorites.contains(favoriteItem.id);
                          TravoraFavorites.toggle(favoriteItem);
                          setState(() {
                            allTrips[index]['isFav'] = !wasFavorite;
                          });
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(wasFavorite
                                  ? 'تمت الإزالة من المفضلة'
                                  : 'تمت الإضافة إلى المفضلة ✅')));
                        },
                        onDetails: () {
                          if (trip['title'] == 'القاهرة والجيزة') {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const CairoDetailScreen()));
                          } else if (trip['title'] == 'عطلة البحر الأحمر') {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const TripDetailsScreen(
                                          destination: 'البحر الأحمر',
                                          budget: 'غير محدد',
                                          activitiesCount: 6,
                                          duration: 5,
                                          travelers: '2 مسافران',
                                          date: '10 - 14 أبريل 2027',
                                        )));
                          } else if (trip['title'] == 'الأقصر وأسوان') {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const TripDetailsScreen(
                                          destination: 'الأقصر وأسوان',
                                          budget: 'غير محدد',
                                          activitiesCount: 5,
                                          duration: 5,
                                          travelers: '2 مسافران',
                                          date: '20 - 24 فبراير 2027',
                                        )));
                          } else if (trip['title'] == 'القاهرة القديمة') {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const TripDetailsScreen(
                                          destination: 'القاهرة القديمة',
                                          budget: 'غير محدد',
                                          activitiesCount: 3,
                                          duration: 3,
                                          travelers: 'لم تحجز بعد',
                                          date: 'خطة ثقافية',
                                        )));
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                content: Text('صفحة ${trip['title']} قريباً')));
                          }
                        },
                      );
                    }),

                    // ===== 5. زرار خطة رحلة جديدة =====
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const TripPlannerScreen())),
                        style: ElevatedButton.styleFrom(
                            backgroundColor: navy,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14))),
                        child: const Text('+ خطة رحلة جديدة',
                            style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // ===== 6. حجوزاتي =====
                    InkWell(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const MyBookingsScreen(),
                        ),
                      ),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(16),
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
                              child: const Icon(Icons.hotel_outlined,
                                  color: navy, size: 22)),
                          const SizedBox(width: 12),
                          const Expanded(
                              child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                Text('حجوزاتي',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 15,
                                        color: textColor)),
                                SizedBox(height: 2),
                                Text('الفنادق والتجارب المؤكدة',
                                    style: TextStyle(
                                        fontSize: 12, color: greyText)),
                              ])),
                          const Icon(Icons.arrow_back_ios,
                              size: 14, color: greyText),
                        ]),
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
