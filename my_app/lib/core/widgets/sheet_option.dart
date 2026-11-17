import 'package:flutter/material.dart';

import 'package:my_app/core/constants/app_colors.dart';

class SheetOption extends StatelessWidget {
  final String text;
  final bool selected;
  final VoidCallback onTap;
  const SheetOption({
    required this.text,
    required this.selected,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: selected ? lightBlueBg : const Color(0xFFF8FBFF),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? navy : lightBorder),
        ),
        child: Row(
          children: [
            Text(
              text,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: selected ? navy : textColor,
                fontSize: 13,
              ),
            ),
            const Spacer(),
            if (selected) const Icon(Icons.check_circle, color: navy, size: 18),
          ],
        ),
      ),
    );
  }
}

// =================== صفحة خطط رحلتك الذكية - الجزء المضاف سابقا - مربعات فوق بعض ===================
