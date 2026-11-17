class FavItem {
  final String id; // 'sharm' | 'nile' | 'pyramids'
  final String title;
  final String sub;
  final String image;
  final String price;
  final String category; // 'الوجهات' | 'الفنادق' | 'التجارب'
  const FavItem(
      {required this.id,
      required this.title,
      required this.sub,
      required this.image,
      required this.price,
      required this.category});
}

