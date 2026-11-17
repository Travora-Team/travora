import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/destinations/cairo_detail_screen.dart';
import 'package:my_app/features/destinations/destination_section.dart';
import 'package:my_app/features/destinations/widgets/destination_widgets.dart';
import 'package:my_app/features/experiences/pyramids_experience_screen.dart';
import 'package:my_app/features/trips/trip_planner_screen.dart';

class DestinationsScreen extends StatefulWidget {
  const DestinationsScreen({super.key});
  @override
  State<DestinationsScreen> createState() => _DestinationsScreenState();
}

class _DestinationsScreenState extends State<DestinationsScreen> {
  String selectedCity = 'الكل';
  String selectedExperienceFilter = 'ثقافة وتاريخ';
  final List<Map<String, String>> allDestinations = [
    {
      'city': 'القاهرة',
      'category': 'ثقافة وتاريخ',
      'title': 'القاهرة',
      'desc':
          'القاهرة.. مزيج ساحر بين التاريخ والحاضر، مدينة لا تنام - نزهة ساحرة بين الأبراج والنيل',
      'image': cairoImage,
    },
    {
      'city': 'الجيزة',
      'category': 'ثقافة وتاريخ',
      'title': 'الجيزة',
      'desc':
          'أهرامات الجيزة وأبو الهول - عجائب الدنيا السبع في انتظارك، تجربة تاريخية لا تنسى',
      'image': pyramidsImage,
    },
    {
      'city': 'الأقصر',
      'category': 'ثقافة وتاريخ',
      'title': 'الأقصر',
      'desc':
          'معابد الأقصر والكرنك - متحف مفتوح لآثار الفراعنة، جولة بين أعمدة معبد الأقصر الشهيرة',
      'image': luxorImage,
    },
    {
      'city': 'شرم الشيخ',
      'category': 'شواطئ واستجمام,طبيعة ومغامرة',
      'title': 'شرم الشيخ',
      'desc':
          'جمال البحر الأحمر والشعاب المرجانية - شواطئ خلابة وأنشطة غوص لا مثيل لها',
      'image': sharmImage,
    },
  ];
  void openCitySheet() {
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
              SheetOption(
                text: 'الكل',
                selected: selectedCity == 'الكل',
                onTap: () {
                  setState(() => selectedCity = 'الكل');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'القاهرة',
                selected: selectedCity == 'القاهرة',
                onTap: () {
                  setState(() => selectedCity = 'القاهرة');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'الجيزة',
                selected: selectedCity == 'الجيزة',
                onTap: () {
                  setState(() => selectedCity = 'الجيزة');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'الأقصر',
                selected: selectedCity == 'الأقصر',
                onTap: () {
                  setState(() => selectedCity = 'الأقصر');
                  Navigator.pop(ctx);
                },
              ),
              SheetOption(
                text: 'شرم الشيخ',
                selected: selectedCity == 'شرم الشيخ',
                onTap: () {
                  setState(() => selectedCity = 'شرم الشيخ');
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
    List<Map<String, String>> filtered = allDestinations.where((destination) {
      final matchesCity =
          selectedCity == 'الكل' || destination['city'] == selectedCity;
      final categories = (destination['category'] ?? '').split(',');
      final matchesFilter = selectedExperienceFilter == 'الكل' ||
          categories.contains(selectedExperienceFilter);
      return matchesCity && matchesFilter;
    }).toList();
    return Scaffold(
      backgroundColor: backgroundColor,
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          children: [
            DestinationSection(
              onDiscover: (chosenDestination) {
                final city = chosenDestination.replaceFirst(' مصر', '');
                setState(() {
                  selectedCity = city == 'القاهرة القديمة' ? 'القاهرة' : city;
                });
              },
              onFilterChanged: (chosenFilter) {
                setState(() {
                  selectedExperienceFilter = chosenFilter;
                });
              },
            ),
            const SizedBox(height: 16),
            if (filtered.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 28),
                child: Center(
                  child: Text(
                    'لا توجد وجهات تطابق اختياراتك. جرّب تغيير التصفية أو المدينة.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: greyText, fontSize: 13),
                  ),
                ),
              ),
            ...filtered.map(
              (dest) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: FigmaDestinationCard(
                  image: dest['image']!,
                  title: dest['title']!,
                  desc: dest['desc']!,
                  favoriteItem: FavItem(
                    id: 'destination_${dest['city']}',
                    title: dest['title']!,
                    sub: dest['desc']!,
                    image: dest['image']!,
                    price: '',
                    category: 'الوجهات',
                  ),
                  buttonText: (dest['title'] == 'الأقصر' ||
                          dest['title'] == 'شرم الشيخ')
                      ? 'ابدأ مخطط الرحلة'
                      : 'عرض التفاصيل',
                  onDetails: () {
                    final Widget targetPage;
                    if (dest['title'] == 'القاهرة') {
                      targetPage = const CairoDetailScreen();
                    } else if (dest['title'] == 'الجيزة') {
                      targetPage = const PyramidsExperienceScreen();
                    } else {
                      targetPage = const TripPlannerScreen();
                    }
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => targetPage),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),
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
                    'قرب المعالم من بعضها',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
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
                      height: 200,
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
                        'عرض الخريطة الذكية',
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
                  const SizedBox(height: 12),
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
                        'خطط رحلتك الآن',
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
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
