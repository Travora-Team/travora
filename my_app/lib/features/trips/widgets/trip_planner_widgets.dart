import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class PlannerField extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final VoidCallback onTap;
  const PlannerField({
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


class VerticalCheckBox extends StatelessWidget {
  final String text;
  final bool selected;
  final VoidCallback onTap;
  const VerticalCheckBox({
    required this.text,
    required this.selected,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: selected ? lightBlueBg : const Color(0xFFF8FBFF),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? navy : lightBorder,
            width: selected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                color: selected ? navy : Colors.white,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: selected ? navy : lightBorder),
              ),
              child: selected
                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                  : null,
            ),
            const SizedBox(width: 12),
            Text(
              text,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: selected ? navy : textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}


class MiniChip extends StatelessWidget {
  final String text;
  final bool selected;
  final VoidCallback onTap;
  const MiniChip({
    required this.text,
    required this.selected,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? lightBlueBg : const Color(0xFFF8FBFF),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: selected ? navy : lightBorder),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: selected ? navy : textColor,
          ),
        ),
      ),
    );
  }
}
