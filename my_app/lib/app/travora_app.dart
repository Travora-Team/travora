
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'package:my_app/app/theme/app_theme.dart';
import 'package:my_app/app/shell/travora_shell.dart';

class TravoraApp extends StatelessWidget {
  const TravoraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Travora',
      debugShowCheckedModeBanner: false,

      locale: const Locale('ar'),

      supportedLocales: const [
        Locale('ar'),
        Locale('en', 'US'),
      ],

      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],

      theme: AppTheme.light,

      home: const TravoraShell(),
    );
  }
}
