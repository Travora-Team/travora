
import 'package:flutter/material.dart';

import 'package:my_app/core/core.dart';
import 'package:my_app/app/navigation/travora_top_bar.dart';
import 'package:my_app/app/navigation/travel_bottom_nav.dart';

import 'package:my_app/features/account/account_screen.dart';
import 'package:my_app/features/auth/login_screen.dart';
import 'package:my_app/features/home/home_screen.dart';
import 'package:my_app/features/notifications/notifications_screen.dart';
import 'package:my_app/features/search/search_screen.dart';
import 'package:my_app/features/trips/my_trips_screen.dart';
import 'package:my_app/features/trips/trip_planner_screen.dart';
import 'package:my_app/features/trips/trip_services_screen.dart';

class TravoraShell extends StatefulWidget {
  const TravoraShell({super.key});

  @override
  State<TravoraShell> createState() => _TravoraShellState();
}

class _TravoraShellState extends State<TravoraShell> {
  static const int _initialTab = 4;
  static const Duration _tabAnimationDuration =
      Duration(milliseconds: 480);

  final GlobalKey<NavigatorState> _navigatorKey =
      GlobalKey<NavigatorState>();

  late final _ShellNavigatorObserver _navigatorObserver;

  int _selectedIndex = _initialTab;

  bool _canGoBack = false;
  bool _isChangingTab = false;

  @override
  void initState() {
    super.initState();

    _navigatorObserver = _ShellNavigatorObserver(
      _refreshBackState,
    );
  }

  // تحديث حالة زر الرجوع عند فتح أو إغلاق صفحة.
  void _refreshBackState() {
    if (!mounted) return;

    final canPop =
        _navigatorKey.currentState?.canPop() ?? false;

    if (canPop != _canGoBack) {
      setState(() {
        _canGoBack = canPop;
      });
    }
  }

  // إنشاء انتقال موحد لجميع الصفحات.
  Route<void> _createRoute(Widget page) {
    return PageRouteBuilder<void>(
      pageBuilder: (_, animation, secondaryAnimation) => page,
      transitionDuration: const Duration(milliseconds: 220),
      reverseTransitionDuration: const Duration(milliseconds: 180),
      transitionsBuilder: (
        context,
        animation,
        secondaryAnimation,
        child,
      ) {
        final curvedAnimation = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutCubic,
        );

        return FadeTransition(
          opacity: curvedAnimation,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0, 0.025),
              end: Offset.zero,
            ).animate(curvedAnimation),
            child: child,
          ),
        );
      },
    );
  }

  // الصفحة التي يفتحها كل تبويب.
  Widget _pageForTab(int index) {
    switch (index) {
      case 0:
        return TravoraUser.isLoggedIn
            ? const AccountScreen()
            : const LoginScreen();

      case 1:
        return const MyTripsScreen();

      case 2:
        return const TripPlannerScreen();

      case 3:
        return const TripServicesScreen();

      case 4:
      default:
        return const HomeScreen();
    }
  }

  // فتح شاشة فرعية داخل Navigator الداخلي.
  void _pushPage(Widget page) {
    final navigator = _navigatorKey.currentState;

    if (navigator == null) return;

    navigator.push<void>(_createRoute(page));
  }

  // الانتقال إلى صفحة تبويب جديدة.
  void _selectTab(int index) {
    if (index < 0 || index > 4 || _isChangingTab) return;

    final navigator = _navigatorKey.currentState;

    // الضغط مجددًا على التبويب الحالي يعيد إلى الصفحة
    // الرئيسية الخاصة به دون إعادة بناء التطبيق.
    if (index == _selectedIndex) {
      if (navigator != null && navigator.canPop()) {
        navigator.popUntil((route) => route.isFirst);
      }
      return;
    }

    setState(() {
      _selectedIndex = index;
      _isChangingTab = true;
    });

    // ننتظر انتهاء حركة CurvedNavigationBar.
    Future.delayed(_tabAnimationDuration, () {
      if (!mounted) return;

      final currentNavigator = _navigatorKey.currentState;

      if (currentNavigator != null) {
        currentNavigator.pushAndRemoveUntil<void>(
          _createRoute(_pageForTab(index)),
          (route) => false,
        );
      }

      if (mounted) {
        setState(() {
          _isChangingTab = false;
        });
      }
    });
  }

  // زر الرجوع الموجود في الشريط العلوي.
  void _handleBack() {
    final navigator = _navigatorKey.currentState;

    if (navigator != null && navigator.canPop()) {
      navigator.pop();
    }
  }

  // العودة إلى الصفحة الرئيسية.
  void _goHome() {
    _selectTab(4);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,

      // الشريط العلوي ثابت على مستوى التطبيق.
      appBar: TravoraTopBar(
        canGoBack: _canGoBack,
        onBack: _handleBack,
        onHome: _goHome,
        onSearch: () {
          _pushPage(const TravoraSearchScreen());
        },
        onNotifications: () {
          _pushPage(const NotificationsScreen());
        },
        onAccount: () {
          _pushPage(
            TravoraUser.isLoggedIn
                ? const AccountScreen()
                : const LoginScreen(),
          );
        },
      ),

      // الشاشات تتغير هنا فقط.
      body: NavigatorPopHandler<dynamic>(
        onPopWithResult: (_) {
          _navigatorKey.currentState?.maybePop();
        },
        child: Navigator(
          key: _navigatorKey,
          observers: [_navigatorObserver],
          onGenerateRoute: (_) {
            return _createRoute(const HomeScreen());
          },
        ),
      ),

      // الشريط السفلي ثابت أيضًا.
      bottomNavigationBar: TravelBottomNav(
        selectedIndex: _selectedIndex,
        isNavigationLocked: _isChangingTab,
        onTap: _selectTab,
      ),
    );
  }
}

// مراقبة الصفحات داخل Navigator الداخلي.
// لا نعيد إنشاء TravoraShell عند التنقل.
class _ShellNavigatorObserver extends NavigatorObserver {
  _ShellNavigatorObserver(this.onChanged);

  final VoidCallback onChanged;

  void _notify() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      onChanged();
    });
  }

  @override
  void didPush(
    Route<dynamic> route,
    Route<dynamic>? previousRoute,
  ) {
    super.didPush(route, previousRoute);
    _notify();
  }

  @override
  void didPop(
    Route<dynamic> route,
    Route<dynamic>? previousRoute,
  ) {
    super.didPop(route, previousRoute);
    _notify();
  }

  @override
  void didRemove(
    Route<dynamic> route,
    Route<dynamic>? previousRoute,
  ) {
    super.didRemove(route, previousRoute);
    _notify();
  }

  @override
  void didReplace({
    Route<dynamic>? newRoute,
    Route<dynamic>? oldRoute,
  }) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    _notify();
  }
}
