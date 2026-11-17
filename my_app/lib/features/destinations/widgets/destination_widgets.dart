import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class FigmaDestinationCard extends StatelessWidget {
  final String image, title, desc;
  final String buttonText;
  final FavItem favoriteItem;
  final VoidCallback onDetails;
  const FigmaDestinationCard({
    required this.image,
    required this.title,
    required this.desc,
    required this.favoriteItem,
    this.buttonText = 'عرض التفاصيل',
    required this.onDetails,
  });
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: whiteCard,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
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
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (c, e, s) => Container(
                    height: 180,
                    color: lightBorder,
                    child: const Icon(Icons.landscape, color: navy),
                  ),
                ),
              ),
              Positioned(
                top: 12,
                left: 12,
                child: FavButton(item: favoriteItem),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: textColor,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  desc,
                  style: const TextStyle(
                    fontSize: 12,
                    color: greyText,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton(
                    onPressed: onDetails,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: navy,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      buttonText,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
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


class CairoPlaceCard extends StatelessWidget {
  final IconData icon;
  final String title, sub, price;
  final VoidCallback onTap;
  const CairoPlaceCard(
      {required this.icon,
      required this.title,
      required this.sub,
      required this.price,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: lightBorder)),
        child: Row(children: [
          Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                  color: lightBlueBg, borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: navy, size: 22)),
          const SizedBox(width: 12),
          Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                Text(title,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: textColor)),
                const SizedBox(height: 2),
                Text(sub,
                    style: const TextStyle(fontSize: 11, color: greyText)),
                const SizedBox(height: 2),
                Text(price,
                    style: const TextStyle(
                        fontSize: 11,
                        color: navy,
                        fontWeight: FontWeight.bold)),
              ])),
          const Icon(Icons.arrow_back_ios, size: 14, color: greyText),
        ]),
      ),
    );
  }
}


class CairoSelectField extends StatelessWidget {
  final IconData icon;
  final String label, value;
  final VoidCallback onTap;
  const CairoSelectField(
      {required this.icon,
      required this.label,
      required this.value,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        decoration: BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: lightBorder)),
        child: Row(children: [
          Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                  color: lightBlueBg, borderRadius: BorderRadius.circular(8)),
              child: Icon(icon, size: 16, color: navy)),
          const SizedBox(width: 10),
          Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                Text(label,
                    style: const TextStyle(fontSize: 10, color: greyText)),
                const SizedBox(height: 2),
                Text(value,
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: textColor)),
              ])),
          const Icon(Icons.keyboard_arrow_down, color: greyText, size: 18),
        ]),
      ),
    );
  }
}
