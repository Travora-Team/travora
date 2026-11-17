import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/my_bookings_screen.dart';
import 'package:my_app/features/destinations/cairo_detail_screen.dart';
import 'package:my_app/features/experiences/pyramids_experience_screen.dart';
import 'package:my_app/features/hotels/hotel_detail_screen.dart';
import 'package:my_app/features/trips/edit_trip_plan_screen.dart';
import 'package:my_app/features/trips/live_trip_replanned_screen.dart';
import 'package:my_app/features/trips/share_trip_sheet.dart';
import 'package:my_app/features/trips/trip_budget_screen.dart';
import 'package:my_app/features/trips/trip_documents_screen.dart';
import 'package:my_app/features/trips/widgets/trip_details_widgets.dart';

class TripDetailsScreen extends StatefulWidget {
  final String destination;
  final String budget;
  final int activitiesCount;
  final int duration;
  final String travelers;
  final String date;

  const TripDetailsScreen({
    super.key,
    this.destination = 'القاهرة والجيزة',
    this.budget = '6,000 ج.م',
    this.activitiesCount = 8,
    this.duration = 4,
    this.travelers = '2 مسافران',
    this.date = '15 - 18 مارس 2027',
  });

  @override
  State<TripDetailsScreen> createState() => _TripDetailsScreenState();
}

class _TripDetailsScreenState extends State<TripDetailsScreen> {
  bool isFavHotel = false;
  int selectedDay = 0;

  final List<Map<String, dynamic>> days = [
    {
      'title': 'الأهرامات والمتحف المصري',
      'time': '9:00 ص - 6:00 م',
      'tags': 'تاريخ وآثار • القاهرة والجيزة',
      'img': pyramidsImage,
    },
    {
      'title': 'القاهرة القديمة وخان الخليلي',
      'time': '9:00 ص - 9:00 م',
      'tags': 'ثقافة وطعام وتسوق',
      'img': khanImage,
    },
    {
      'title': 'جولة حرة وعشاء على النيل',
      'time': '10:00 ص - 10:00 م',
      'tags': 'استرخاء وتجربة محلية',
      'img': cairoImage,
    },
    {
      'title': 'وقت حر والعودة إلى المطار',
      'time': '9:00 ص - 2:00 م',
      'tags': 'زيارة أخيرة وانتقال',
      'img': mapImage,
    },
  ];

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // ===== العنوان =====
            Text(widget.destination,
                style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            Text('${widget.date} • ${widget.travelers}',
                style: const TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 12),
            TravelImage(url: cairoImage, height: 190),
            const SizedBox(height: 12),

            // ===== 3 سكاشن جنب بعض =====
            Row(children: [
              Expanded(
                child: StatCard(
                  value: widget.budget,
                  label: 'الميزانية',
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: StatCard(
                  value: '${widget.activitiesCount}',
                  label: 'الأنشطة',
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: StatCard(
                  value: '${widget.duration}',
                  label: 'الأيام',
                ),
              ),
            ]),
            const SizedBox(height: 12),

            // ===== رحلتك مؤكدة وجاهزة =====
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: lightBlueBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lightBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Row(children: [
                    Icon(Icons.check_circle, color: Colors.green, size: 20),
                    SizedBox(width: 6),
                    Text('رحلتك مؤكدة وجاهزة',
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: textColor)),
                  ]),
                  SizedBox(height: 6),
                  Text('تاريخ • إيقاع متوازن • سيارة مع إقامة قرب النيل',
                      style: TextStyle(fontSize: 13, color: textColor)),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // ===== زرار ابدأ المتابعة =====
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => LiveTripReplannedScreen(
                        destination: widget.destination,
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: navy,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('ابدأ المتابعة والمباشرة',
                    style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 20),

            // ===== الخطة اليومية =====
            const Text('الخطة اليومية',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('اضغط على أي يوم لمراجعة تجاربه وتفاصيله',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 12),

            ...List.generate(days.length, (i) {
              final d = days[i];
              final isSelected = selectedDay == i;
              return InkWell(
                onTap: () {
                  if (i == 0) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const PyramidsExperienceScreen(),
                      ),
                    );
                  } else if (i == 1) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const CairoDetailScreen(),
                      ),
                    );
                  } else if (i == 2) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const PyramidsExperienceScreen(),
                      ),
                    );
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const PyramidsExperienceScreen(),
                      ),
                    );
                  }
                },
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: whiteCard,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                        color: isSelected ? navy : lightBorder,
                        width: isSelected ? 1.5 : 1),
                  ),
                  child: Row(children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        d['img'],
                        width: 70,
                        height: 70,
                        fit: BoxFit.cover,
                        errorBuilder: (c, e, s) => Container(
                            width: 70,
                            height: 70,
                            color: lightBorder,
                            child: const Icon(Icons.landscape_rounded,
                                color: navy)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${i + 1} - ${d['title']}',
                              style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: textColor)),
                          const SizedBox(height: 4),
                          Text(d['time'],
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: navy,
                                  fontWeight: FontWeight.bold)),
                          const SizedBox(height: 2),
                          Text(d['tags'],
                              style: const TextStyle(
                                  fontSize: 12, color: greyText)),
                        ],
                      ),
                    ),
                  ]),
                ),
              );
            }),

            // ===== تعديل الخطة =====
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const EditTripPlanScreen(),
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: lightBorder),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('تعديل الخطة',
                    style: TextStyle(color: navy, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 20),

            // ===== الخريطة الذكية =====
            const Text('الخريطة الذكية',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('أماكن الزيارة والمسار المقترح',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 12),
            TravelImage(url: mapImage, height: 170),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton(
                onPressed: () => _showSnack('عرض الخريطة كاملة'),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: lightBorder),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('عرض الخريطة كاملة',
                    style: TextStyle(color: navy, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 20),

            // ===== فندقك المقترح =====
            const Text('فندقك المقترح',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lightBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Stack(children: [
                    TravelImage(
                      url:
                          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
                      height: 160,
                    ),
                    Positioned(
                      top: 10,
                      left: 10,
                      child: InkWell(
                        onTap: () => setState(() => isFavHotel = !isFavHotel),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                              color: Colors.white, shape: BoxShape.circle),
                          child: Icon(
                              isFavHotel
                                  ? Icons.favorite
                                  : Icons.favorite_border,
                              color: isFavHotel ? Colors.red : navy,
                              size: 18),
                        ),
                      ),
                    ),
                  ]),
                  const SizedBox(height: 10),
                  const Text('فندقك المقترح على النيل',
                      style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                  const SizedBox(height: 4),
                  const Text('3 ليالي • غرفة لشخصين • إفطار متاح • 4.8 ★',
                      style: TextStyle(fontSize: 12, color: greyText)),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const HotelDetailScreen(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('عرض التفاصيل',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // ===== ميزانية / حجوزات / مستندات / مشاركة =====
            LinkRow(
              icon: Icons.wallet_outlined,
              title: 'ميزانية الرحلة',
              sub: 'تقرير المصروف',
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const TripBudgetScreen(),
                ),
              ),
            ),
            LinkRow(
              icon: Icons.hotel_outlined,
              title: 'حجوزات الرحلة',
              sub: 'الفنادق والجولات',
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const MyBookingsScreen(),
                ),
              ),
            ),
            LinkRow(
              icon: Icons.confirmation_number_outlined,
              title: 'المستندات والتذاكر',
              sub: 'اعرض تذكرتك ومستنداتك',
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const TripDocumentsScreen(),
                ),
              ),
            ),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () => showShareTripSheet(
                  context,
                  destination: 'القاهرة والجيزة',
                  duration: 4,
                ),
                icon: const Icon(Icons.share, size: 18),
                label: const Text(
                  'مشاركة الرحلة',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: navy,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}



// ==================== EDIT TRIP PLAN SCREEN - تعديل خطة الرحلة ====================
