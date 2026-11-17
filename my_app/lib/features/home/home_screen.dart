import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/auth/register_screen.dart';
import 'package:my_app/features/destinations/destinations_screen.dart';
import 'package:my_app/features/experiences/explore_activities_screen.dart';
import 'package:my_app/features/home/widgets/home_widgets.dart';
import 'package:my_app/features/hotels/hotels_screen.dart';
import 'package:my_app/features/info/about_screen.dart';
import 'package:my_app/features/info/faq_screen.dart';
import 'package:my_app/features/info/policy_screens.dart';
import 'package:my_app/features/support/support_screen.dart';
import 'package:my_app/features/transport/transport_screen.dart';
import 'package:my_app/features/trips/my_trips_screen.dart';
import 'package:my_app/features/trips/trip_planner_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String selectedDestination = 'القاهرة، مصر';
  String selectedDate = '15 فبراير، 2027';
  String selectedTravelers = '2 بالغين، غرفة واحدة';

  void openDestinationSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: whiteCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    'اختر وجهتك',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const Text(
                'اختر المدينة التي ترغب بزيارتها',
                style: TextStyle(color: greyText, fontSize: 12),
              ),
              const SizedBox(height: 16),
              SheetOption(
                text: 'القاهرة، مصر',
                selected: selectedDestination == 'القاهرة، مصر',
                onTap: () {
                  setState(() => selectedDestination = 'القاهرة، مصر');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'الأقصر، مصر',
                selected: selectedDestination == 'الأقصر، مصر',
                onTap: () {
                  setState(() => selectedDestination = 'الأقصر، مصر');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'أسوان، مصر',
                selected: selectedDestination == 'أسوان، مصر',
                onTap: () {
                  setState(() => selectedDestination = 'أسوان، مصر');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'الإسكندرية، مصر',
                selected: selectedDestination == 'الإسكندرية، مصر',
                onTap: () {
                  setState(() => selectedDestination = 'الإسكندرية، مصر');
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void openDateSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: whiteCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Row(
                children: [
                  const Text(
                    'تاريخ السفر',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              CalendarDatePicker(
                initialDate: DateTime(2027, 3, 15),
                firstDate: DateTime(2026),
                lastDate: DateTime(2028),
                onDateChanged: (d) {
                  setState(
                    () => selectedDate = '${d.day} ${[
                      'يناير',
                      'فبراير',
                      'مارس',
                      'أبريل',
                      'مايو',
                      'يونيو',
                      'يوليو',
                      'أغسطس',
                      'سبتمبر',
                      'أكتوبر',
                      'نوفمبر',
                      'ديسمبر'
                    ][d.month - 1]}، ${d.year}',
                  );
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void openTravelersSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: whiteCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    'المسافرون والغرف',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              SheetOption(
                text: '1 بالغ، غرفة واحدة',
                selected: selectedTravelers == '1 بالغ، غرفة واحدة',
                onTap: () {
                  setState(() => selectedTravelers = '1 بالغ، غرفة واحدة');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: '2 بالغين، غرفة واحدة',
                selected: selectedTravelers == '2 بالغين، غرفة واحدة',
                onTap: () {
                  setState(() => selectedTravelers = '2 بالغين، غرفة واحدة');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: '2 بالغين، طفل، غرفة واحدة',
                selected: selectedTravelers.contains('طفل'),
                onTap: () {
                  setState(
                    () => selectedTravelers = '2 بالغين، طفل، غرفة واحدة',
                  );
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      backgroundColor: backgroundColor,
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: CustomScrollView(
          slivers: [
            SliverList(
              delegate: SliverChildListDelegate([
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Center(
                        child: Text(
                          'رحلتك أذكى، ذكريات أجمل',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Center(
                        child: Text(
                          'مغامرات مصممة خصيصاً لتطلعاتك',
                          style: TextStyle(fontSize: 12, color: greyText),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Stack(
                        clipBehavior: Clip.none,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Image.network(
                              heroImage,
                              height: 220,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Positioned(
                            bottom: -30,
                            left: 12,
                            right: 12,
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: whiteCard,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.08),
                                    blurRadius: 12,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                                border: Border.all(color: lightBorder),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'رحلتك تبدأ بفكرة... ونحن نرتب التفاصيل',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                      color: textColor,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    'فكر بوجھتك واترك لنا تنسيق الرحلة واختيار الفنادق، ونحن نضمن لك تجربة ممتعة',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: greyText,
                                      height: 1.4,
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  SizedBox(
                                    width: double.infinity,
                                    height: 38,
                                    child: ElevatedButton(
                                      onPressed: () => Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) =>
                                              const TripPlannerScreen(),
                                        ),
                                      ),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: navy,
                                        foregroundColor: Colors.white,
                                        elevation: 0,
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            10,
                                          ),
                                        ),
                                      ),
                                      child: const Text(
                                        'خطط رحلتي بالذكاء الاصطناعي ',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 50),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: whiteCard,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: lightBorder),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'إلى أين تذهب؟',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 14),
                            SearchField(
                              label: 'الوجهة',
                              value: selectedDestination,
                              icon: Icons.location_on_outlined,
                              onTap: openDestinationSheet,
                            ),
                            const SizedBox(height: 10),
                            SearchField(
                              label: 'التاريخ',
                              value: selectedDate,
                              icon: Icons.calendar_today_outlined,
                              onTap: openDateSheet,
                            ),
                            const SizedBox(height: 10),
                            SearchField(
                              label: 'المسافرون',
                              value: selectedTravelers,
                              icon: Icons.people_outline,
                              onTap: openTravelersSheet,
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              height: 48,
                              child: ElevatedButton(
                                onPressed: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => const DestinationsScreen(),
                                  ),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: navy,
                                  foregroundColor: Colors.white,
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: const Text(
                                  'استكشاف رحلتي',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: backgroundColor,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Column(
                                      children: [
                                        Text(
                                          '1M+',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: navy,
                                            fontSize: 13,
                                          ),
                                        ),
                                        SizedBox(height: 2),
                                        Text(
                                          'من الفنادق',
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: greyText,
                                          ),
                                        ),
                                        Text(
                                          'مليون واحد',
                                          style: TextStyle(
                                            fontSize: 9,
                                            color: greyText,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: backgroundColor,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Column(
                                      children: [
                                        Text(
                                          '360+',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: navy,
                                            fontSize: 13,
                                          ),
                                        ),
                                        SizedBox(height: 2),
                                        Text(
                                          'وجهة سياحية',
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: greyText,
                                          ),
                                        ),
                                        Text(
                                          'حول العالم',
                                          style: TextStyle(
                                            fontSize: 9,
                                            color: greyText,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: whiteCard,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'سافر بثقة وراحة',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 14),
                            TrustItem(
                              icon: Icons.map_outlined,
                              title: 'خطة مفصلة',
                              sub:
                                  'خطة مفصلة يوم بيوم لرحلتك مع أفضل الأنشطة والمواعيد',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const TripPlannerScreen(),
                                ),
                              ),
                            ),
                            const SizedBox(height: 14),
                            TrustItem(
                              icon: Icons.star_border,
                              title: 'تجارب موثوقة',
                              sub:
                                  'تقييمات حقيقية لأفضل الأماكن والخدمات لضمان تجربة مميزة',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const HotelsScreen(),
                                ),
                              ),
                            ),
                            const SizedBox(height: 14),
                            TrustItem(
                              icon: Icons.headset_mic_outlined,
                              title: 'دعم على مدار الساعة',
                              sub: 'مساعدة فورية طوال رحلتك من فريق دعم متخصص',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const SupportScreen(),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'وجهات وتجارب تستحق الاكتشاف',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 12),
                      const DestinationCard(
                        image: cairoImage,
                        title: 'القاهرة',
                        desc:
                            'القاهرة.. مزيج ساحر بين التاريخ والحاضر، مدينة لا تنام',
                      ),
                      const SizedBox(height: 12),
                      const DestinationCard(
                        image: pyramidsImage,
                        title: 'أهرامات الجيزة وأبو الهول',
                        desc: 'عجائب الدنيا السبع في انتظارك، تجربة لا تنسى',
                      ),
                      const SizedBox(height: 12),
                      const DestinationCard(
                        image: khanImage,
                        title: 'القاهرة القديمة وخان الخليلي',
                        desc: 'أسواق شعبية وتاريخ عريق، تسوق وتذوق الأصالة',
                      ),
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: whiteCard,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'خريطتك الذكية.. وكل يوم له حكاية',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'شاهد معالم القاهرة على خريطة تفاعلية مع مسارك اليومي المفصل لكل يوم من أيام رحلتك',
                              style: TextStyle(
                                fontSize: 11,
                                color: greyText,
                                height: 1.4,
                              ),
                            ),
                            const SizedBox(height: 12),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: Image.network(
                                mapImage,
                                height: 180,
                                width: double.infinity,
                                fit: BoxFit.cover,
                              ),
                            ),
                            const SizedBox(height: 12),
                            SizedBox(
                              width: double.infinity,
                              height: 44,
                              child: OutlinedButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.map_outlined, size: 18),
                                label: const Text(
                                  'عرض الخريطة التفاعلية',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: navy,
                                  side: const BorderSide(color: lightBorder),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: whiteCard,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'كل احتياجات الرحلة',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: textColor,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'كل ما تحتاجه لرحلة مثالية',
                              style: TextStyle(fontSize: 11, color: greyText),
                            ),
                            SizedBox(height: 16),
                            TrustItem(
                              icon: Icons.hotel_outlined,
                              title: 'فنادق وإقامة',
                              sub: 'أفضل الفنادق والشقق الفندقية بأفضل الأسعار',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const HotelsScreen(),
                                ),
                              ),
                            ),
                            TrustItem(
                              icon: Icons.confirmation_number_outlined,
                              title: 'الأنشطة والتجارب',
                              sub: 'اكتشف الأنشطة والتجارب السياحية المميزة',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) =>
                                      const ExploreActivitiesScreen(),
                                ),
                              ),
                            ),
                            TrustItem(
                              icon: Icons.flight_outlined,
                              title: 'التنقل والاستقبال',
                              sub: 'حجز طيران، قطارات، وسيارات مع سائق خاص',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const TransportScreen(),
                                ),
                              ),
                            ),
                            TrustItem(
                              icon: Icons.list_alt_outlined,
                              title: 'رحلاتي و حجوزاتي',
                              sub: 'تابع خطط رحلاتك وحجوزاتك في مكان واحد',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const MyTripsScreen(),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: lightBlueBg,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          children: [
                            const Text(
                              'جاهز لرحلتك القادمة؟',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'ابدأ بتخطيط مغامرتك الآن مع Travora واحصل على خطة مخصصة لك',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 11,
                                color: greyText,
                                height: 1.4,
                              ),
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              height: 48,
                              child: ElevatedButton.icon(
                                onPressed: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => const TripPlannerScreen(),
                                  ),
                                ),
                                icon: const Icon(Icons.auto_awesome, size: 18),
                                label: const Text(
                                  'صمم رحلتك الآن',
                                  style: TextStyle(fontWeight: FontWeight.bold),
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
                            SizedBox(
                              width: double.infinity,
                              height: 48,
                              child: OutlinedButton(
                                onPressed: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => const RegisterScreen(),
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
                                  'إنشاء حساب',
                                  style: TextStyle(
                                    color: navy,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: whiteCard,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Center(
                              child: Column(
                                children: [
                                  Text(
                                    'Travora',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: navy,
                                      fontSize: 16,
                                    ),
                                  ),
                                  Text(
                                    'More Than a Destination',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: greyText,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(height: 16),
                            InkWell(
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const AboutScreen(),
                                ),
                              ),
                              borderRadius: BorderRadius.circular(12),
                              child: const FooterItem(
                                icon: Icons.info_outline,
                                title: 'عن Travora',
                                sub:
                                    'منصة السفر الذكية التي تجمع بين التكنولوجيا والخبرة',
                              ),
                            ),
                            InkWell(
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const FaqScreen(),
                                ),
                              ),
                              borderRadius: BorderRadius.circular(12),
                              child: const FooterItem(
                                icon: Icons.help_outline,
                                title: 'الأسئلة الشائعة',
                                sub: 'إجابات لكل استفساراتك حول الحجز والرحلات',
                              ),
                            ),
                            InkWell(
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const PrivacyPolicyScreen(),
                                ),
                              ),
                              borderRadius: BorderRadius.circular(12),
                              child: const FooterItem(
                                icon: Icons.policy_outlined,
                                title: 'سياسة الخصوصية',
                                sub: '',
                              ),
                            ),
                            InkWell(
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const TermsScreen(),
                                ),
                              ),
                              borderRadius: BorderRadius.circular(12),
                              child: const FooterItem(
                                icon: Icons.description_outlined,
                                title: 'الشروط والأحكام',
                                sub: '',
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}
