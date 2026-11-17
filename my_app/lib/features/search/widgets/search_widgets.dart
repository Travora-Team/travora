import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class SearchSuggestItem extends StatelessWidget {
  final IconData icon;
  final String title, sub;
  const SearchSuggestItem({
    required this.icon,
    required this.title,
    required this.sub,
  });
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 18, color: navy),
          ),
          const SizedBox(width: 12),
          Column(
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
              Text(sub, style: const TextStyle(fontSize: 11, color: greyText)),
            ],
          ),
        ],
      ),
    );
  }
}


class SearchResultCard extends StatelessWidget {
  final String title, sub;
  final IconData icon;
  final VoidCallback onTap;
  const SearchResultCard({
    required this.title,
    required this.sub,
    required this.icon,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FBFF),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: lightBorder),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, size: 18, color: navy),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                Text(
                  sub,
                  style: const TextStyle(fontSize: 11, color: greyText),
                ),
              ],
            ),
            const Spacer(),
            const Icon(Icons.arrow_forward_ios, size: 14, color: greyText),
          ],
        ),
      ),
    );
  }
}
