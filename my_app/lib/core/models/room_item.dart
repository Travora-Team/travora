class RoomItem {
  final String title;
  final String image;
  final String size;
  final String bed;
  final String view;
  final String facilities;
  final int pricePerNight;
  final String buttonLabel;

  RoomItem({
    required this.title,
    required this.image,
    required this.size,
    required this.bed,
    required this.view,
    required this.facilities,
    required this.pricePerNight,
    this.buttonLabel = 'اختيار الغرفة',
  });
}

