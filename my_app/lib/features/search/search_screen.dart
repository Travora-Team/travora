import 'package:flutter/material.dart';

import 'package:my_app/core/core.dart';
import 'package:my_app/features/destinations/destination_details_screen.dart';
import 'package:my_app/features/destinations/destinations_screen.dart';
import 'package:my_app/features/search/widgets/search_widgets.dart';

class TravoraSearchScreen extends StatefulWidget {
  const TravoraSearchScreen({super.key});

  @override
  State<TravoraSearchScreen> createState() => _TravoraSearchScreenState();
}

class _TravoraSearchScreenState extends State<TravoraSearchScreen> {
  final TextEditingController searchController = TextEditingController();

  String query = '';

  final List<Map<String, Object>> allPlaces = [
    {
      'title': 'القاهرة، مصر',
      'sub': 'العاصمة - تاريخ وحضارة',
      'icon': Icons.location_on_outlined,
    },
    {
      'title': 'الأقصر، مصر',
      'sub': 'مدينة المائة باب',
      'icon': Icons.map_outlined,
    },
    {
      'title': 'أسوان، مصر',
      'sub': 'جمال النوبة والنيل',
      'icon': Icons.star_border,
    },
    {
      'title': 'الإسكندرية، مصر',
      'sub': 'عروس البحر المتوسط',
      'icon': Icons.location_on_outlined,
    },
    {
      'title': 'شرم الشيخ، مصر',
      'sub': 'شواطئ وغوص',
      'icon': Icons.beach_access_outlined,
    },
    {
      'title': 'رحلة على النيل',
      'sub': 'تجربة نيلية مميزة',
      'icon': Icons.directions_boat_outlined,
    },
    {
      'title': 'أسوان الجديدة',
      'sub': 'مناطق سياحية',
      'icon': Icons.landscape_outlined,
    },
  ];

  List<Map<String, Object>> get filteredPlaces {
    final normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery.isEmpty) {
      return [];
    }

    return allPlaces.where((place) {
      final title = place['title'] as String;
      final subtitle = place['sub'] as String;

      return title.toLowerCase().contains(normalizedQuery) ||
          subtitle.toLowerCase().contains(normalizedQuery);
    }).toList();
  }

  bool get isSearching => query.trim().isNotEmpty;

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  void _updateQuery(String value) {
    setState(() {
      query = value;
    });
  }

  void _clearSearch() {
    setState(() {
      query = '';
      searchController.clear();
    });
  }

  // فتح قائمة الوجهات داخل Navigator الخاص بالتطبيق.
  void _openDestinations() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => const DestinationsScreen(),
      ),
    );
  }

  // فتح تفاصيل الوجهة داخل Navigator الخاص بالتطبيق.
  void _openDestinationDetails() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => const DestinationDetailsScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final results = filteredPlaces;

    return ColoredBox(
      color: whiteCard,
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          children: [
            _buildSearchField(),
            const SizedBox(height: 22),
            if (!isSearching) ...[
              _buildSuggestions(),
            ] else ...[
              _buildSearchResults(results),
            ],
          ],
        ),
      ),
    );
  }

  // حقل البحث.
  Widget _buildSearchField() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FBFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: lightBorder),
      ),
      child: TextField(
        controller: searchController,
        autofocus: true,
        textInputAction: TextInputAction.search,
        onChanged: _updateQuery,
        decoration: InputDecoration(
          hintText: 'إلى أين تود الذهاب؟',
          hintStyle: const TextStyle(
            color: greyText,
            fontSize: 13,
          ),
          prefixIcon: const Icon(
            Icons.search,
            color: navy,
            size: 20,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            vertical: 14,
          ),
          suffixIcon: query.isNotEmpty
              ? IconButton(
                  tooltip: 'مسح البحث',
                  icon: const Icon(
                    Icons.clear,
                    size: 18,
                    color: greyText,
                  ),
                  onPressed: _clearSearch,
                )
              : null,
        ),
      ),
    );
  }

  // الاقتراحات الأولية.
  Widget _buildSuggestions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'مقترحات لك',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            color: textColor,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'وجهات وتجارب قد تعجبك',
          style: TextStyle(
            fontSize: 11,
            color: greyText,
          ),
        ),
        const SizedBox(height: 16),
        const SearchSuggestItem(
          icon: Icons.location_on_outlined,
          title: 'القاهرة',
          sub: 'العاصمة - تاريخ وحضارة',
        ),
        const SearchSuggestItem(
          icon: Icons.map_outlined,
          title: 'رحلة على النيل',
          sub: 'رحلة نيلية مميزة',
        ),
        const SearchSuggestItem(
          icon: Icons.star_border,
          title: 'أسوان الجديدة',
          sub: 'وجهة سياحية جديدة',
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: _openDestinations,
            style: ElevatedButton.styleFrom(
              backgroundColor: navy,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'بحث في الأماكن',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Center(
          child: TextButton(
            onPressed: _clearSearch,
            child: const Text(
              'مسح البحث الحالي',
              style: TextStyle(
                color: greyText,
                fontSize: 11,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // نتائج البحث.
  Widget _buildSearchResults(
    List<Map<String, Object>> results,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'نتائج البحث',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            color: textColor,
          ),
        ),
        const SizedBox(height: 12),
        if (results.isEmpty)
          const Padding(
            padding: EdgeInsets.only(top: 40),
            child: Center(
              child: Column(
                children: [
                  Icon(
                    Icons.search_off_rounded,
                    size: 42,
                    color: greyText,
                  ),
                  SizedBox(height: 12),
                  Text(
                    'لا توجد نتائج',
                    style: TextStyle(
                      color: greyText,
                      fontSize: 13,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    'جرّب البحث باستخدام اسم مكان آخر',
                    style: TextStyle(
                      color: greyText,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          ...results.map((place) {
            return SearchResultCard(
              title: place['title'] as String,
              sub: place['sub'] as String,
              icon: place['icon'] as IconData,
              onTap: _openDestinationDetails,
            );
          }),
      ],
    );
  }
}
