
import 'package:flutter/material.dart';

import 'package:my_app/core/core.dart';

class TravoraTopBar extends StatelessWidget
    implements PreferredSizeWidget {
  final bool canGoBack;

  final VoidCallback onBack;
  final VoidCallback onHome;
  final VoidCallback onSearch;
  final VoidCallback onNotifications;
  final VoidCallback onAccount;

  const TravoraTopBar({
    super.key,
    required this.canGoBack,
    required this.onBack,
    required this.onHome,
    required this.onSearch,
    required this.onNotifications,
    required this.onAccount,
  });

  static const double _height = 68;

  @override
  Size get preferredSize => const Size.fromHeight(_height);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      toolbarHeight: _height,
      automaticallyImplyLeading: false,
      leadingWidth: canGoBack ? 48 : 0,

      leading: canGoBack
          ? IconButton(
              tooltip: 'رجوع',
              onPressed: onBack,
              icon: const BackButtonIcon(),
              color: navy,
              iconSize: 21,
            )
          : null,

      backgroundColor: whiteCard,
      surfaceTintColor: Colors.transparent,
      shadowColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,

      titleSpacing: canGoBack ? 0 : 16,
      centerTitle: false,

      title: InkWell(
        onTap: onHome,
        borderRadius: BorderRadius.circular(12),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF142D52),
                    Color(0xFF2678CF),
                  ],
                ),
                borderRadius: BorderRadius.circular(13),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x261E5D9B),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.flight_takeoff_rounded,
                color: Colors.white,
                size: 23,
              ),
            ),

            const SizedBox(width: 10),

            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Travora',
                  style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.w800,
                    color: textColor,
                  ),
                ),
                Text(
                  'Explore your world',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w500,
                    color: greyText,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),

      actions: [
        _TopBarAction(
          tooltip: 'البحث',
          icon: Icons.search_rounded,
          onTap: onSearch,
        ),
        _TopBarAction(
          tooltip: 'الإشعارات',
          icon: Icons.notifications_none_rounded,
          onTap: onNotifications,
        ),
        _TopBarAction(
          tooltip: 'حسابي',
          icon: Icons.person_outline_rounded,
          onTap: onAccount,
        ),
        const SizedBox(width: 10),
      ],
    );
  }
}

class _TopBarAction extends StatelessWidget {
  final String tooltip;
  final IconData icon;
  final VoidCallback onTap;

  const _TopBarAction({
    required this.tooltip,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.only(end: 6),
      child: Tooltip(
        message: tooltip,
        child: Material(
          color: lightBlueBg,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(13),
            side: const BorderSide(
              color: lightBorder,
              width: 0.7,
            ),
          ),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(13),
            child: SizedBox(
              width: 40,
              height: 40,
              child: Icon(
                icon,
                color: navy,
                size: 21,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
