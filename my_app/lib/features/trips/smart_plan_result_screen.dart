import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/bookings/my_bookings_screen.dart';
import 'package:my_app/features/destinations/cairo_detail_screen.dart';
import 'package:my_app/features/experiences/pyramids_experience_screen.dart';
import 'package:my_app/features/hotels/hotel_detail_screen.dart';
import 'package:my_app/features/trips/edit_trip_plan_screen.dart';
import 'package:my_app/features/trips/share_trip_sheet.dart';
import 'package:my_app/features/trips/trip_budget_screen.dart';
import 'package:my_app/features/trips/trip_details_screen.dart';
import 'package:my_app/features/trips/trip_documents_screen.dart';
import 'package:my_app/features/trips/widgets/smart_plan_widgets.dart';

class SmartPlanResultScreen extends StatelessWidget {
  final String destination;
  final String date;
  final int duration;
  final String travelers;
  final String budget;
  final List<String> interests;
  final String pace;
  final String transport;
  final String accommodation;
  final String notes;

  const SmartPlanResultScreen({
    super.key,
    required this.destination,
    required this.date,
    required this.duration,
    required this.travelers,
    required this.budget,
    required this.interests,
    required this.pace,
    required this.transport,
    required this.accommodation,
    required this.notes,
  });

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
                    const Text(
                      'خطتك الذكية جاهزة',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '$duration أيام في $destination • $date',
                      style: const TextStyle(fontSize: 13, color: greyText),
                    ),
                    const SizedBox(height: 14),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80',
                        height: 180,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(
                            child:
                                StatWidget(label: 'الميزانية', value: budget)),
                        Expanded(
                            child: StatWidget(
                                label: 'الاهتمامات',
                                value: '${interests.length}')),
                        Expanded(
                            child: StatWidget(
                                label: 'الأيام', value: '$duration')),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: lightBlueBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: lightBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'صممت وفق اختيارك',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            interests.join(' • '),
                            style:
                                const TextStyle(fontSize: 13, color: greyText),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'الإيقاع: $pace، المواصلات: $transport، الإقامة: $accommodation، المسافرون: $travelers${notes.isNotEmpty ? '، ملاحظات: $notes' : ''}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: greyText,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: 14),
                          SizedBox(
                            width: double.infinity,
                            height: 48,
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => TripDetailsScreen(
                                      destination: destination,
                                      budget: budget,
                                      activitiesCount: interests.length,
                                      duration: duration,
                                      travelers: travelers,
                                      date: date,
                                    ),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: navy,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: const Text(
                                'اعتماد وحفظ الخطة',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'الخطة اليومية',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'اضغط على أي يوم لعرض التفاصيل',
                      style: TextStyle(fontSize: 12, color: greyText),
                    ),
                    const SizedBox(height: 12),
                    DayCard(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const PyramidsExperienceScreen(),
                        ),
                      ),
                      day: '1',
                      title: 'الأهرامات والمتحف المصري',
                      time: '9:00 ص - 4:00 م',
                      desc: 'زيارة الأهرامات وأبو الهول والمتحف المصري',
                      img:
                          'https://www.qatarairways.com/content/dam/images/renditions/horizontal-2/destinations/egypt-/cairo/h2-cairo-pyramids.jpg',
                    ),
                    DayCard(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const CairoDetailScreen(),
                        ),
                      ),
                      day: '2',
                      title: 'القاهرة القديمة وخان الخليلي',
                      time: '9:00 ص - 5:00 م',
                      desc: 'جولة في القاهرة القديمة وخان الخليلي',
                      img:
                          'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=80',
                    ),
                    DayCard(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const PyramidsExperienceScreen(),
                        ),
                      ),
                      day: '3',
                      title: 'جولة حرة وعشاء على النيل',
                      time: '10:00 ص - 10:00 م',
                      desc: 'جولة حرة في الصباح وعشاء على النيل',
                      img:
                          'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&q=80',
                    ),
                    DayCard(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const PyramidsExperienceScreen(),
                        ),
                      ),
                      day: '4',
                      title: 'وقت حر والعودة إلى المطار',
                      time: '9:00 ص - 2:00 م',
                      desc: 'وقت حر للتسوق والعودة إلى المطار',
                      img:
                          'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton(
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const EditTripPlanScreen(),
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          backgroundColor: whiteCard,
                          side: BorderSide.none,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'تعديل الخطة',
                          style: TextStyle(
                            color: navy,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'الخريطة الذكية',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'أفضل مسار لتوفير الوقت والتنقل',
                      style: TextStyle(fontSize: 12, color: greyText),
                    ),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80',
                        height: 170,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      height: 44,
                      child: OutlinedButton(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'عرض الخريطة',
                          style: TextStyle(
                            color: navy,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: whiteCard,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: lightBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(
                              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
                              height: 150,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'فندقك المقترح على النيل',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${duration > 1 ? duration - 1 : 1} ليالي  •  غرفة مزدوجة  •  إفطار مجاني',
                            style:
                                const TextStyle(fontSize: 12, color: greyText),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            '⭐ 4.8  •  تقييم الضيوف',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            height: 44,
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => HotelDetailScreen(
                                        durationDays: duration),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: navy,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: const Text(
                                'عرض التفاصيل',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    LinkCard(
                      icon: Icons.wallet_outlined,
                      title: 'ميزانية الرحلة',
                      sub: 'عرض تفاصيل الميزانية والتكاليف',
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const TripBudgetScreen(),
                        ),
                      ),
                    ),
                    LinkCard(
                      icon: Icons.airplane_ticket_outlined,
                      title: 'حجوزات الرحلة',
                      sub: 'حجوزاتك المؤكدة والفنادق والطيران',
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const MyBookingsScreen(),
                        ),
                      ),
                    ),
                    LinkCard(
                      icon: Icons.description_outlined,
                      title: 'المستندات والتذاكر',
                      sub: 'كل المستندات والتذاكر في مكان واحد',
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const TripDocumentsScreen(),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton.icon(
                        onPressed: () => showShareTripSheet(
                          context,
                          destination: destination,
                          duration: duration,
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

void showBuildingPlanDialog(
  BuildContext context, {
  required String destination,
  required String date,
  required int duration,
  required String travelers,
  required String budget,
  required List<String> interests,
  required String pace,
  required String transport,
  required String accommodation,
  required String notes,
}) {
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (_) => Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                  color: lightBlueBg, shape: BoxShape.circle),
              child: const Icon(Icons.send, color: navy, size: 32),
            ),
            const SizedBox(height: 16),
            const Text('نبني خطتك الذكية',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
            const SizedBox(height: 8),
            const Text('نجمع اختياراتك ونرتبها في أفضل خطة ممكنة',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: greyText)),
            const SizedBox(height: 16),
            const LinearProgressIndicator(
                color: navy, backgroundColor: lightBorder),
            const SizedBox(height: 12),
            const Text('لحظات ونجهز لك كل حاجة...',
                style: TextStyle(fontSize: 11, color: greyText)),
          ],
        ),
      ),
    ),
  );
  Future.delayed(const Duration(seconds: 2), () {
    if (!context.mounted) return;
    Navigator.of(context).pop();
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => SmartPlanResultScreen(
          destination: destination,
          date: date,
          duration: duration,
          travelers: travelers,
          budget: budget,
          interests: List<String>.from(interests),
          pace: pace,
          transport: transport,
          accommodation: accommodation,
          notes: notes,
        ),
      ),
    );
  });
}

// ==================== SUPPORT & HELP SCREEN ====================
