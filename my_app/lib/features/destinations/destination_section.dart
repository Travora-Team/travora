import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class DestinationSection extends StatefulWidget {
  final ValueChanged<String>? onDiscover;
  final ValueChanged<String>? onFilterChanged;
  const DestinationSection({
    super.key,
    this.onDiscover,
    this.onFilterChanged,
  });

  @override
  State<DestinationSection> createState() => _DestinationSectionState();
}

class _DestinationSectionState extends State<DestinationSection> {
  String destination = 'اختر المدينة';
  String filter = 'ثقافة وتاريخ';
  String sortBy = 'الأكثر شهرة';

  final List<String> destinations = [
    'القاهرة مصر',
    'الجيزة مصر',
    'القاهرة القديمة مصر',
    'الأقصر مصر',
    'شرم الشيخ مصر',
  ];

  final List<String> filters = [
    'الكل',
    'ثقافة وتاريخ',
    'طبيعة ومغامرة',
    'شواطئ واستجمام',
  ];

  final List<String> sorts = [
    'الأكثر شهرة',
    'الأعلى تقييما',
    'الأقرب إليك',
  ];

  void _pickDestination() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                InkWell(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                        color: backgroundColor,
                        borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.close, size: 18, color: textColor),
                  ),
                ),
                const Spacer(),
                const Text('اختر وجهتك',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ],
            ),
            const SizedBox(height: 6),
            const Text('اختر المدينة التي تبدأ منها رحلتك',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            ...destinations.map((d) => Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() => destination = d);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: destination == d ? navy : lightBlueBg,
                      foregroundColor:
                          destination == d ? Colors.white : textColor,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(d,
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                )),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  void _pickFilter() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                InkWell(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                        color: backgroundColor,
                        borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.close, size: 18, color: textColor),
                  ),
                ),
                const Spacer(),
                const Text('تصفية الوجهات',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ],
            ),
            const SizedBox(height: 6),
            const Text('اختر نوع التجربة اللي بتدور عليها',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            ...filters.map((f) => Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() => filter = f);
                      widget.onFilterChanged?.call(f);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: filter == f ? navy : lightBlueBg,
                      foregroundColor: filter == f ? Colors.white : textColor,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(f,
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                )),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  void _pickSort() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                InkWell(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                        color: backgroundColor,
                        borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.close, size: 18, color: textColor),
                  ),
                ),
                const Spacer(),
                const Text('ترتيب الوجهات',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
              ],
            ),
            const SizedBox(height: 6),
            const Text('ما الذي تريد أن يظهر أولا؟',
                style: TextStyle(fontSize: 13, color: greyText)),
            const SizedBox(height: 14),
            ...sorts.map((s) => Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() => sortBy = s);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: sortBy == s ? navy : lightBlueBg,
                      foregroundColor: sortBy == s ? Colors.white : textColor,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(s,
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                )),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1 - العنوان
          const Text(
            'وجهتك القادمة هنا',
            style: TextStyle(
                fontSize: 24, fontWeight: FontWeight.bold, color: textColor),
          ),
          const SizedBox(height: 4),
          const Text(
            'ابدأ بمدينة.. واصنع منها رحلة تستحق الذكر',
            style: TextStyle(fontSize: 13, color: greyText),
          ),
          const SizedBox(height: 14),

          // 2 - اختر وجهة - كارت أبيض
          InkWell(
            onTap: _pickDestination,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lightBorder),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'اختر وجهة',
                          style: TextStyle(fontSize: 12, color: greyText),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          destination,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: destination == 'اختر المدينة'
                                ? greyText
                                : textColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          // 3 - اكتشف الوجهات - أزرق
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                if (destination == 'اختر المدينة') {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('من فضلك اختر المدينة أولا')),
                  );
                  return;
                }
                widget.onDiscover?.call(destination);
                if (widget.onDiscover == null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                        content: Text(
                            'جار اكتشاف الوجهات في $destination - تصفية: $filter - ترتيب: $sortBy')),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: navy,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('اكتشف الوجهات',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            ),
          ),
          const SizedBox(height: 10),

          // 4 - تصفية: ثقافة وتاريخ
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _pickFilter,
              style: ElevatedButton.styleFrom(
                backgroundColor: lightBlueBg,
                foregroundColor: navy,
                elevation: 0,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              child: Text('تصفية: $filter',
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 14)),
            ),
          ),
          const SizedBox(height: 10),

          // 5 - ترتيب الوجهات
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _pickSort,
              style: ElevatedButton.styleFrom(
                backgroundColor: lightBlueBg,
                foregroundColor: navy,
                elevation: 0,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              child: Text('ترتيب الوجهات: $sortBy',
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 14)),
            ),
          ),
        ],
      ),
    );
  }
}

// ==================== Transport booking flow (integrated from supplied code) ====================
// ---------- 2: شيت راجع انتقالك ----------
