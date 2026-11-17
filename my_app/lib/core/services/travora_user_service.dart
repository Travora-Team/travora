// ==================== 1 - مخزن بيانات المستخدم والمفضلة والإشعارات ====================

class TravoraUser {
  static String name = '';
  static String email = '';
  // تظل حالة تسجيل الدخول محفوظة أثناء استخدام التطبيق حتى تسجيل الخروج.
  static bool isLoggedIn = false;
  static int bookings = 3; // بيتغير على حسب حجوزاتك
  static int savedPlaces = 0; // بيساوي عدد المفضلة لوحده
  static int trips = 6; // بيتغير على حسب رحلاتك
}

// المفضلة - بتبدأ فاضية
