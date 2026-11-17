import 'package:flutter/foundation.dart';

import 'package:my_app/core/models/travora_notification.dart';

class TravoraNotifications {
  static final ValueNotifier<List<TravoraNotification>> items = ValueNotifier([
    const TravoraNotification(
        title: 'حجزك مؤكد',
        sub: 'تم تأكيد إقامتك على النيل',
        time: 'منذ 10 دقائق'),
    const TravoraNotification(
        title: 'خطة رحلتك جاهزة',
        sub: '4 أيام مليئة بالتجارب في القاهرة',
        time: 'منذ ساعة'),
    const TravoraNotification(
        title: 'موعد الرحلة يقترب',
        sub: 'راجع مستلزماتك قبل السفر',
        time: 'غداً'),
    const TravoraNotification(
        title: 'وجهات جديدة لك', sub: 'اكتشف تجارب البحر الأحمر', time: 'أمس'),
  ]);
  static void markAllRead() => items.value = [];
}

