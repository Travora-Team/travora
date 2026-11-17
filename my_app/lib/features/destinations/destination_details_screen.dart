import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/trips/trip_planner_screen.dart';

class DestinationDetailsScreen extends StatefulWidget {
  const DestinationDetailsScreen({super.key});
  @override
  State<DestinationDetailsScreen> createState() =>
      _DestinationDetailsScreenState();
}

class _DestinationDetailsScreenState extends State<DestinationDetailsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
          children: [
            const Text(
              'القاهرة.. حكاية تستحق الزيارة',
              style: TextStyle(
                fontSize: 25,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 18),
            const TravelImage(url: cairoImage, height: 235, radius: 20),
            const SizedBox(height: 22),
            TravoraButton(
              text: 'خطط رحلتك إلى القاهرة',
              icon: Icons.auto_awesome,
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const TripPlannerScreen()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ==================== HOTELS SCREEN - الكود الجديد المرسل ====================
// ==================== HotelsScreen - من الفيديو فقط ====================
