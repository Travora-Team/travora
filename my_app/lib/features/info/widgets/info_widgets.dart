import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class FaqCard extends StatelessWidget {
  final String title, sub;
  final IconData icon;
  final VoidCallback onTap;
  const FaqCard(
      {required this.title,
      required this.sub,
      required this.icon,
      required this.onTap});
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: lightBorder),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                  color: lightBlueBg, borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: navy, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: textColor)),
                  const SizedBox(height: 4),
                  Text(sub,
                      style: const TextStyle(fontSize: 12, color: greyText)),
                ],
              ),
            ),
            const Icon(Icons.keyboard_arrow_down, color: greyText, size: 18),
          ],
        ),
      ),
    );
  }
}


class FaqStep extends StatelessWidget {
  final String text;
  const FaqStep({required this.text});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 5),
            width: 6,
            height: 6,
            decoration:
                const BoxDecoration(color: navy, shape: BoxShape.circle),
          ),
          const SizedBox(width: 10),
          Expanded(
              child: Text(text,
                  style: const TextStyle(fontSize: 13, color: textColor))),
        ],
      ),
    );
  }
}


class PrivacySection extends StatelessWidget {
  final String title, body;
  const PrivacySection({required this.title, required this.body});
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: whiteCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: lightBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: const TextStyle(
                  fontSize: 15, fontWeight: FontWeight.bold, color: textColor)),
          const SizedBox(height: 6),
          Text(body,
              style:
                  const TextStyle(fontSize: 13, color: textColor, height: 1.6)),
        ],
      ),
    );
  }
}
