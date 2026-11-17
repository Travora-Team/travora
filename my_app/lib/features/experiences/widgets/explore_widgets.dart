import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class ExploreField extends StatelessWidget {
  final IconData icon;
  final String label, value;
  final VoidCallback onTap;
  const ExploreField(
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
                        color: textColor))
              ])),
          const Icon(Icons.keyboard_arrow_down, color: greyText, size: 18),
        ]),
      ),
    );
  }
}


class ActivityCard extends StatelessWidget {
  final String img, title, info, price;
  final bool isFav;
  final VoidCallback onFav, onDetails;
  const ActivityCard(
      {required this.img,
      required this.title,
      required this.info,
      required this.price,
      required this.isFav,
      required this.onFav,
      required this.onDetails});
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: lightBorder)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Stack(children: [
          ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              child: Image.network(img,
                  height: 170, width: double.infinity, fit: BoxFit.cover)),
          Positioned(
            top: 12,
            left: 12,
            child: InkWell(
              onTap: onFav,
              child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                      color: Colors.white, shape: BoxShape.circle),
                  child: Icon(isFav ? Icons.favorite : Icons.favorite_border,
                      color: isFav ? Colors.red : navy, size: 20)),
            ),
          ),
        ]),
        Padding(
          padding: const EdgeInsets.all(14),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(title,
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                    color: textColor)),
            const SizedBox(height: 4),
            Text(info, style: const TextStyle(fontSize: 12, color: greyText)),
            const SizedBox(height: 2),
            Text(price,
                style: const TextStyle(
                    fontSize: 13, color: navy, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton(
                    onPressed: onDetails,
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12))),
                    child: const Text('عرض التفاصيل',
                        style: TextStyle(fontWeight: FontWeight.bold)))),
          ]),
        ),
      ]),
    );
  }
}
