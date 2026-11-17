import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class IncludedRow extends StatelessWidget {
  final IconData icon;
  final String text;
  final bool included;
  const IncludedRow(
      {required this.icon, required this.text, required this.included});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(children: [
        Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
                color: lightBlueBg, borderRadius: BorderRadius.circular(8)),
            child: Icon(icon, size: 16, color: navy)),
        const SizedBox(width: 10),
        Expanded(
            child: Text(text,
                style: TextStyle(
                    fontSize: 13,
                    color: included ? textColor : greyText,
                    decoration: included ? null : TextDecoration.lineThrough))),
        Icon(included ? Icons.check_circle : Icons.cancel_outlined,
            size: 18, color: included ? Colors.green : greyText),
      ]),
    );
  }
}


class PyramidsLinkCard extends StatelessWidget {
  final IconData icon;
  final String title, sub;
  final VoidCallback onTap;
  const PyramidsLinkCard(
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
              child: Icon(icon, color: navy, size: 20)),
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
                    style: const TextStyle(
                        fontSize: 11, color: greyText, height: 1.4))
              ])),
          const Icon(Icons.arrow_back_ios, size: 14, color: greyText),
        ]),
      ),
    );
  }
}


class PyramidsSelectField extends StatelessWidget {
  final IconData icon;
  final String label, value;
  final VoidCallback onTap;
  const PyramidsSelectField(
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
            color: backgroundColor,
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
