import 'package:flutter/material.dart';

import 'package:my_app/core/constants/app_colors.dart';

class TravelImage extends StatelessWidget {
  final String url;
  final double height;
  final double? width;
  final double radius;
  const TravelImage({
    super.key,
    required this.url,
    required this.height,
    this.width,
    this.radius = 18,
  });
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: Image.network(
        url,
        height: height,
        width: width ?? double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (c, e, s) => Container(
          height: height,
          width: width ?? double.infinity,
          color: lightBorder,
          child: const Center(
            child: Icon(Icons.landscape_rounded, size: 48, color: navy),
          ),
        ),
      ),
    );
  }
}

