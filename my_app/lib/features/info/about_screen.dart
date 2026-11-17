import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/home/home_screen.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/trips/trip_planner_screen.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

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
              const Text(
                'عن Travora',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'السفر يبدأ بفكرة',
                style: TextStyle(fontSize: 13, color: greyText),
              ),
              const SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=900&q=80',
                  height: 190,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    height: 190,
                    color: lightBlueBg,
                    child: const Center(
                      child: Icon(Icons.image, size: 40, color: navy),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'كل تفاصيل السفر في تجربة واحدة',
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.bold,
                  height: 1.4,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'اكتشف وجهات جديدة، خطط رحلة تناسب وقتك واهتماماتك، ثم احفظ إقامتك وتجاربك ومستنداتك في مكان واحد.',
                style: TextStyle(fontSize: 13, color: greyText, height: 1.7),
              ),
              const SizedBox(height: 16),
              _aboutCard(
                icon: Icons.calendar_today_outlined,
                title: 'خطط بمرونة',
                desc: 'عدل أيامك وميزانيتك كلما تغيرت فكرتك.',
              ),
              _aboutCard(
                icon: Icons.map_outlined,
                title: 'اكتشف بثقة',
                desc: 'معلومة واضحة وتفاصيل تساعدك على الاختيار.',
              ),
              _aboutCard(
                icon: Icons.send_outlined,
                title: 'سافر براحة',
                desc: 'كل الحجوزات والمستندات معك أثناء الرحلة.',
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const TripPlannerScreen(),
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: navy,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 15),
                  ),
                  child: const Text(
                    'صمم رحلتك',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              InkWell(
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SupportScreen()),
                ),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    color: whiteCard,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.headset_mic_outlined, color: navy, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'تحتاج مساعدة؟',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: navy,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _aboutCard({
    required IconData icon,
    required String title,
    required String desc,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: whiteCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: lightBorder),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: lightBlueBg,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: navy, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  desc,
                  style: const TextStyle(
                    fontSize: 12,
                    color: greyText,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ==================== FAQ SCREEN - الأسئلة الشائعة ====================
