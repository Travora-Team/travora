import 'package:flutter/material.dart';

import 'package:my_app/core/constants/app_colors.dart';

class AppTheme {
  const AppTheme._();

  static ThemeData get light => ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: backgroundColor,
        fontFamily: 'Arial',
        colorScheme: ColorScheme.fromSeed(
          seedColor: navy,
          primary: navy,
          surface: whiteCard,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: whiteCard,
          foregroundColor: textColor,
          elevation: 0,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: whiteCard,
          hintStyle: const TextStyle(color: greyText),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: lightBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: navy, width: 1.5),
          ),
        ),
      );
}
