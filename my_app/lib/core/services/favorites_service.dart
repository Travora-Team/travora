import 'package:flutter/foundation.dart';

import 'package:my_app/core/models/fav_item.dart';
import 'package:my_app/core/services/travora_user_service.dart';

class TravoraFavorites {
  static final ValueNotifier<List<FavItem>> items = ValueNotifier([]);

  static bool contains(String id) => items.value.any((e) => e.id == id);

  static void toggle(FavItem item) {
    final list = List<FavItem>.from(items.value);
    if (contains(item.id)) {
      list.removeWhere((e) => e.id == item.id);
    } else {
      list.add(item);
    }
    items.value = list;
    TravoraUser.savedPlaces = list.length;
  }

  static void clear() {
    items.value = [];
    TravoraUser.savedPlaces = 0;
  }
}

// زرار القلب - بتحطيه على أي كارت في أي صفحة
