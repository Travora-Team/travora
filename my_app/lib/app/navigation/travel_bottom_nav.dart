
import 'package:flutter/material.dart';
import 'package:curved_navigation_bar/curved_navigation_bar.dart';

import 'package:my_app/core/core.dart';

class TravelBottomNav extends StatelessWidget {
  final int selectedIndex;
  final bool isNavigationLocked;
  final ValueChanged<int> onTap;

  const TravelBottomNav({
    super.key,
    required this.selectedIndex,
    required this.onTap,
    this.isNavigationLocked = false,
  });

  Widget _buildIcon({
    required IconData icon,
    required int index,
  }) {
    final isActive = selectedIndex == index;

    return Icon(
      icon,
      size: 32,
      color: isActive ? Colors.white : greyText,
      shadows: isActive
          ? const [
              Shadow(
                color: Color(0xAA1E88FF),
                blurRadius: 14,
                offset: Offset(0, 2),
              ),
            ]
          : null,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.ltr,
      child: CurvedNavigationBar(
        index: selectedIndex,
        height: 74,

        items: [
          _buildIcon(
            icon: Icons.person_outline_rounded,
            index: 0,
          ),
          _buildIcon(
            icon: Icons.luggage_outlined,
            index: 1,
          ),
          _buildIcon(
            icon: Icons.map_outlined,
            index: 2,
          ),
          _buildIcon(
            icon: Icons.explore_outlined,
            index: 3,
          ),
          _buildIcon(
            icon: Icons.home_outlined,
            index: 4,
          ),
        ],

        color: whiteCard,
        buttonBackgroundColor: navy,
        backgroundColor: Colors.transparent,

        animationCurve: Curves.easeInOutCubic,
        animationDuration: const Duration(milliseconds: 480),

        onTap: onTap,
        letIndexChange: (_) => !isNavigationLocked,
      ),
    );
  }
}
