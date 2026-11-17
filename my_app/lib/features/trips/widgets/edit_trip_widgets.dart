import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class EditField extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final VoidCallback onTap;
  const EditField(
      {required this.label,
      required this.value,
      required this.icon,
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
          border: Border.all(color: lightBorder),
        ),
        child: Row(children: [
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
                Text(label,
                    style: const TextStyle(fontSize: 12, color: greyText)),
                const SizedBox(height: 2),
                Text(value,
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ],
            ),
          ),
          const Icon(Icons.keyboard_arrow_down, color: greyText),
        ]),
      ),
    );
  }
}
