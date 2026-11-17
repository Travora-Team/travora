import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/destinations/cairo_detail_screen.dart';
import 'package:my_app/features/destinations/destination_details_screen.dart';
import 'package:my_app/features/experiences/explore_activities_screen.dart';
import 'package:my_app/features/experiences/pyramids_experience_screen.dart';

class TopIcon extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const TopIcon({required this.icon, required this.onTap});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 6),
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Icon(icon, size: 18, color: navy),
        ),
      ),
    );
  }
}


class SearchField extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final VoidCallback onTap;
  const SearchField({
    required this.label,
    required this.value,
    required this.icon,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FBFF),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: lightBorder),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, size: 16, color: navy),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(fontSize: 10, color: greyText),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: textColor,
                  ),
                ),
              ],
            ),
            const Spacer(),
            const Icon(Icons.keyboard_arrow_down, color: greyText, size: 18),
          ],
        ),
      ),
    );
  }
}


class TrustItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String sub;
  final VoidCallback? onTap;
  const TrustItem({
    required this.icon,
    required this.title,
    required this.sub,
    this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 42,
            height: 42,
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
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  sub,
                  style: const TextStyle(fontSize: 11, color: greyText),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


class DestinationCard extends StatelessWidget {
  final String image, title, desc;
  const DestinationCard({
    required this.image,
    required this.title,
    required this.desc,
  });
  @override
  Widget build(BuildContext context) {
    final favoriteItem = FavItem(
      id: title == 'القاهرة'
          ? 'home_cairo'
          : title == 'أهرامات الجيزة وأبو الهول'
              ? 'home_pyramids_sphinx'
              : 'home_old_cairo_khan',
      title: title,
      sub: desc,
      image: image,
      price: '',
      category: title == 'القاهرة' ? 'الوجهات' : 'التجارب',
    );

    return Container(
      decoration: BoxDecoration(
        color: whiteCard,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.network(
                  image,
                  height: 160,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    height: 160,
                    width: double.infinity,
                    color: lightBlueBg,
                    alignment: Alignment.center,
                    child: const Icon(
                      Icons.image_not_supported_outlined,
                      color: navy,
                      size: 40,
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 10,
                left: 10,
                child: FavButton(item: favoriteItem),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: textColor,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  style: const TextStyle(
                    fontSize: 11,
                    color: greyText,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => title == 'القاهرة'
                            ? const CairoDetailScreen()
                            : title == 'أهرامات الجيزة وأبو الهول'
                                ? const PyramidsExperienceScreen()
                                : title == 'القاهرة القديمة وخان الخليلي'
                                    ? const ExploreActivitiesScreen()
                                    : const DestinationDetailsScreen(),
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: navy,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      'عرض التفاصيل',
                      style: TextStyle(fontSize: 12),
                    ),
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


class FooterItem extends StatelessWidget {
  final IconData icon;
  final String title, sub;
  const FooterItem({
    required this.icon,
    required this.title,
    required this.sub,
  });
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 16, color: navy),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: textColor,
                  ),
                ),
                if (sub.isNotEmpty)
                  Text(
                    sub,
                    style: const TextStyle(
                      fontSize: 11,
                      color: greyText,
                      height: 1.2,
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
