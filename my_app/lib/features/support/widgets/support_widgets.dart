import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class SupportOptionCard extends StatelessWidget {
  final IconData icon;
  final String title, sub;
  final VoidCallback onTap;
  const SupportOptionCard(
      {required this.icon,
      required this.title,
      required this.sub,
      required this.onTap});

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
                        fontSize: 14,
                        color: textColor)),
                const SizedBox(height: 2),
                Text(sub,
                    style: const TextStyle(fontSize: 12, color: greyText)),
              ])),
          const Icon(Icons.arrow_back_ios, size: 14, color: greyText),
        ]),
      ),
    );
  }
}
