import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class StatWidget extends StatelessWidget {
  final String label, value;
  const StatWidget({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: whiteCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: lightBorder),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
              color: navy,
            ),
          ),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 11, color: greyText)),
        ],
      ),
    );
  }
}


class DayCard extends StatelessWidget {
  final String day, title, time, desc, img;
  final VoidCallback onTap;
  const DayCard({
    required this.day,
    required this.title,
    required this.time,
    required this.desc,
    required this.img,
    required this.onTap,
  });
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
          border: Border.all(color: lightBorder),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child:
                  Image.network(img, width: 70, height: 70, fit: BoxFit.cover),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'اليوم $day - $title',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    time,
                    style: const TextStyle(
                      fontSize: 11,
                      color: navy,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    desc,
                    style: const TextStyle(fontSize: 11, color: greyText),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_back_ios, size: 14, color: greyText),
          ],
        ),
      ),
    );
  }
}


class LinkCard extends StatelessWidget {
  final IconData icon;
  final String title, sub;
  final VoidCallback? onTap;
  const LinkCard(
      {required this.icon, required this.title, required this.sub, this.onTap});
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: lightBorder),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: lightBlueBg,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: navy, size: 20),
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
                    ),
                  ),
                  Text(
                    sub,
                    style: const TextStyle(fontSize: 11, color: greyText),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_back_ios, size: 14, color: greyText),
          ],
        ),
      ),
    );
  }
}
