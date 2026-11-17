import 'package:flutter/material.dart';

import 'package:my_app/core/constants/app_colors.dart';
import 'package:my_app/core/models/fav_item.dart';
import 'package:my_app/core/services/favorites_service.dart';

class FavButton extends StatelessWidget {
  final FavItem item;
  const FavButton({super.key, required this.item});
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<List<FavItem>>(
      valueListenable: TravoraFavorites.items,
      builder: (_, list, __) {
        final isFav = list.any((e) => e.id == item.id);
        return InkWell(
          onTap: () {
            TravoraFavorites.toggle(item);
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content: Text(isFav
                    ? 'تمت الإزالة من المفضلة'
                    : 'تمت الإضافة إلى المفضلة')));
          },
          child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(20)),
              child: Icon(isFav ? Icons.favorite : Icons.favorite_border,
                  color: isFav ? const Color(0xFFC62828) : navy, size: 20)),
        );
      },
    );
  }
}

// العناصر اللي ممكن تتضاف للمفضلة - دي تعريف بس، مش مضافة
