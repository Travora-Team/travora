import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class TripStat extends StatelessWidget {
  final String num, label;
  const TripStat({required this.num, required this.label});
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: lightBorder)),
        child: Column(children: [
          Text(num,
              style: const TextStyle(
                  fontSize: 18, fontWeight: FontWeight.bold, color: navy)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 11, color: greyText)),
        ]),
      ),
    );
  }
}


class TripCard extends StatelessWidget {
  final String img, title, status, date, duration, travelers, activities;
  final Color statusColor;
  final bool isFav;
  final VoidCallback onFav, onDetails;
  const TripCard(
      {required this.img,
      required this.title,
      required this.status,
      required this.statusColor,
      required this.date,
      required this.duration,
      required this.travelers,
      required this.activities,
      required this.isFav,
      required this.onFav,
      required this.onDetails});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
          color: whiteCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: lightBorder)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Stack(children: [
          ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              child: Image.network(img,
                  height: 170, width: double.infinity, fit: BoxFit.cover)),
          Positioned(
            top: 12,
            right: 12,
            child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20)),
                child: Text(status,
                    style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: statusColor))),
          ),
          Positioned(
            top: 12,
            left: 12,
            child: InkWell(
              onTap: onFav,
              child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                      color: Colors.white, shape: BoxShape.circle),
                  child: Icon(isFav ? Icons.favorite : Icons.favorite_border,
                      color: isFav ? Colors.red : navy, size: 20)),
            ),
          ),
        ]),
        Padding(
          padding: const EdgeInsets.all(14),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(title,
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: textColor)),
            const SizedBox(height: 6),
            Row(children: [
              const Icon(Icons.calendar_today_outlined,
                  size: 14, color: greyText),
              const SizedBox(width: 4),
              Text(date, style: const TextStyle(fontSize: 12, color: greyText)),
              const SizedBox(width: 12),
              const Icon(Icons.schedule_outlined, size: 14, color: greyText),
              const SizedBox(width: 4),
              Text(duration,
                  style: const TextStyle(fontSize: 12, color: greyText)),
            ]),
            const SizedBox(height: 4),
            Row(children: [
              const Icon(Icons.group_outlined, size: 14, color: greyText),
              const SizedBox(width: 4),
              Text(travelers,
                  style: const TextStyle(fontSize: 12, color: greyText)),
              const SizedBox(width: 12),
              const Icon(Icons.local_activity_outlined,
                  size: 14, color: greyText),
              const SizedBox(width: 4),
              Text(activities,
                  style: const TextStyle(
                      fontSize: 12, color: navy, fontWeight: FontWeight.bold)),
            ]),
            const SizedBox(height: 12),
            SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton(
                    onPressed: onDetails,
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12))),
                    child: const Text('عرض التفاصيل',
                        style: TextStyle(fontWeight: FontWeight.bold)))),
          ]),
        ),
      ]),
    );
  }
}
