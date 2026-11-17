import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';

class TripBudgetScreen extends StatefulWidget {
  const TripBudgetScreen({super.key});
  @override
  State<TripBudgetScreen> createState() => _TripBudgetScreenState();
}

class _TripBudgetScreenState extends State<TripBudgetScreen> {
  int totalBudget = 6000;
  List<Map<String, dynamic>> expenses = [
    {
      'title': 'عشاء على النيل',
      'amount': 250,
      'category': 'طعام ومشروبات',
      'date': '15 مارس 2027',
      'time': '6:30 م',
      'icon': Icons.restaurant_outlined
    },
    {
      'title': 'غداء اليوم الأول',
      'amount': 220,
      'category': 'طعام',
      'date': '15 مارس 2027',
      'time': '2:30 م',
      'icon': Icons.lunch_dining_outlined
    },
    {
      'title': 'الانتقال إلى الفندق',
      'amount': 180,
      'category': 'التنقل',
      'date': '15 مارس 2027',
      'time': '5:10 م',
      'icon': Icons.local_taxi_outlined
    },
  ];

  List<Map<String, dynamic>> categories = [
    {
      'title': 'الإقامة',
      'amount': 2500,
      'sub': '3 ليالٍ - مدفوعة',
      'icon': Icons.hotel_outlined
    },
    {
      'title': 'الأنشطة',
      'amount': 1200,
      'sub': 'دخول المواقع والأنشطة',
      'icon': Icons.confirmation_number_outlined
    },
    {
      'title': 'الطعام',
      'amount': 850,
      'sub': 'طعام ومشروبات',
      'icon': Icons.restaurant_outlined
    },
    {
      'title': 'التنقل',
      'amount': 400,
      'sub': 'الانتقالات داخل المدينة',
      'icon': Icons.directions_car_outlined
    },
  ];

  int get spent {
    int catSpent = categories.fold(0, (s, e) => s + (e['amount'] as int));
    // المصروف الكلي في الفيديو = 4700
    return catSpent + 750; // 750 مصاريف إضافية عشان نوصل لـ 4700 زي الفيديو
  }

  int get remaining => totalBudget - spent;

  void _showExpenseDetails(Map<String, dynamic> exp) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
        child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('تفاصيل المصروف',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context)),
              ]),
              const SizedBox(height: 8),
              Center(
                  child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                          color: lightBlueBg,
                          borderRadius: BorderRadius.circular(14)),
                      child: Icon(exp['icon'], color: navy, size: 28))),
              const SizedBox(height: 12),
              Center(
                  child: Text(exp['title'],
                      style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: textColor))),
              Center(
                  child: Text('${exp['amount']} ج.م',
                      style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: navy))),
              const SizedBox(height: 16),
              _detailRow('الفئة', exp['category']),
              _detailRow('الموعد', '${exp['date']} - ${exp['time']}'),
              const SizedBox(height: 20),
              SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _showAddExpense(editItem: exp);
                      },
                      style: ElevatedButton.styleFrom(
                          backgroundColor: navy,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14))),
                      child: const Text('تعديل المصروف',
                          style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold)))),
              const SizedBox(height: 10),
              SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('إغلاق',
                          style: TextStyle(
                              color: greyText, fontWeight: FontWeight.bold)))),
            ]),
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: const TextStyle(color: greyText)),
        Text(value,
            style:
                const TextStyle(fontWeight: FontWeight.bold, color: textColor)),
      ]),
    );
  }

  void _showAddExpense({Map<String, dynamic>? editItem}) {
    final catCtrl =
        TextEditingController(text: editItem?['category'] ?? 'طعام ومشروبات');
    final amountCtrl = TextEditingController(
        text: editItem != null ? editItem['amount'].toString() : '250');
    final descCtrl =
        TextEditingController(text: editItem?['title'] ?? 'عشاء على النيل');
    bool isEdit = editItem != null;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
              color: whiteCard,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
          child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(isEdit ? 'تعديل المصروف' : 'أضف مصروفاً',
                          style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: textColor)),
                      IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(ctx)),
                    ]),
                const SizedBox(height: 8),
                _budgetField('الفئة', catCtrl, Icons.category_outlined),
                _budgetField('المبلغ', amountCtrl, Icons.payments_outlined,
                    isNumber: true),
                _budgetField('الوصف', descCtrl, Icons.description_outlined),
                const SizedBox(height: 16),
                SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                        onPressed: () {
                          final amt = int.tryParse(amountCtrl.text) ?? 0;
                          setState(() {
                            if (isEdit) {
                              editItem['category'] = catCtrl.text;
                              editItem['amount'] = amt;
                              editItem['title'] = descCtrl.text;
                            } else {
                              expenses.insert(0, {
                                'title': descCtrl.text.isEmpty
                                    ? 'مصروف جديد'
                                    : descCtrl.text,
                                'amount': amt,
                                'category':
                                    catCtrl.text.isEmpty ? 'عام' : catCtrl.text,
                                'date': '15 مارس 2027',
                                'time': '6:30 م',
                                'icon': Icons.receipt_long_outlined
                              });
                              // نزود المصروف على الطعام عشان الأرقام تتحدث
                              categories[2]['amount'] =
                                  (categories[2]['amount'] as int) + amt;
                            }
                          });
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(isEdit
                                  ? 'تم تعديل المصروف'
                                  : 'تم حفظ المصروف الجديد'),
                              backgroundColor: navy));
                        },
                        style: ElevatedButton.styleFrom(
                            backgroundColor: navy,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14))),
                        child: Text(
                            isEdit ? 'حفظ التعديل' : 'حفظ المصروف الجديد',
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold)))),
              ]),
        ),
      ),
    );
  }

  Widget _budgetField(String label, TextEditingController ctrl, IconData icon,
      {bool isNumber = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: ctrl,
        keyboardType: isNumber ? TextInputType.number : TextInputType.text,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, color: navy),
          filled: true,
          fillColor: backgroundColor,
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: lightBorder)),
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: lightBorder)),
        ),
      ),
    );
  }

  void _showEditBudget() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
            color: whiteCard,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
        child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('ميزانية الرحلة',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor)),
                IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context)),
              ]),
              const Text('تقدير إجمالي يشمل الإقامة والأنشطة والتنقل',
                  style: TextStyle(color: greyText, fontSize: 13)),
              const SizedBox(height: 16),
              for (int b in [3000, 6000, 10000, 20000])
                InkWell(
                  onTap: () {
                    setState(() => totalBudget = b);
                    Navigator.pop(context);
                  },
                  child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                          color:
                              totalBudget == b ? lightBlueBg : backgroundColor,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                              color: totalBudget == b ? navy : lightBorder)),
                      child: Row(children: [
                        Icon(
                            totalBudget == b
                                ? Icons.radio_button_checked
                                : Icons.radio_button_off,
                            color: navy),
                        const SizedBox(width: 10),
                        Text('$b ج.م',
                            style: const TextStyle(
                                fontWeight: FontWeight.bold, color: textColor)),
                        const Spacer(),
                        if (totalBudget == b)
                          const Icon(Icons.check, color: navy)
                      ])),
                ),
            ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: backgroundColor,
        body: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            // العنوان
            const Center(
                child: Text('ميزانية رحلتي',
                    style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: textColor))),
            const SizedBox(height: 6),
            const Center(
                child: Text('القاهرة والجيزة - 4 أيام',
                    style: TextStyle(color: greyText))),
            const SizedBox(height: 16),
            // 3 كروت جنب بعض
            Row(children: [
              _budgetStat('المتبقي', '$remaining ج.م', navy),
              const SizedBox(width: 10),
              _budgetStat('المصروف', '$spent ج.م', textColor),
              const SizedBox(width: 10),
              _budgetStat('الميزانية', '$totalBudget ج.م', textColor),
            ]),
            const SizedBox(height: 16),
            // راجع المتبقي
            Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: const Color(0xFFEAF3FF),
                    borderRadius: BorderRadius.circular(16)),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('راجع المتبقي من الميزانية',
                          style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: textColor)),
                      const SizedBox(height: 6),
                      const Text(
                          'قدر وجباتك وانتقالاتك المتبقية لتظل رحلتك ضمن الميزانية.',
                          style: TextStyle(color: greyText, height: 1.5)),
                      const SizedBox(height: 12),
                      SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton.icon(
                              onPressed: () => _showAddExpense(),
                              icon: const Icon(Icons.add, color: Colors.white),
                              label: const Text('إضافة مصروف +',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold)),
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: navy,
                                  shape: RoundedRectangleBorder(
                                      borderRadius:
                                          BorderRadius.circular(14))))),
                    ])),
            const SizedBox(height: 20),
            // تفاصيل المصروفات
            const Text('تفاصيل المصروفات',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 4),
            const Text('أرقام نموذجية للشرح ومتابعة المصروفات في الرحلة.',
                style: TextStyle(color: greyText, fontSize: 13)),
            const SizedBox(height: 12),
            for (var c in categories)
              _categoryCard(
                  c,
                  () => _showExpenseDetails({
                        'title': c['title'] == 'الإقامة'
                            ? 'إقامة - فندق النيل'
                            : c['title'] == 'الأنشطة'
                                ? 'جولة الأهرامات'
                                : c['title'] == 'الطعام'
                                    ? 'عشاء على النيل'
                                    : 'انتقال إلى الفندق',
                        'amount': c['title'] == 'الطعام' ? 250 : c['amount'],
                        'category': c['title'] == 'الطعام'
                            ? 'طعام ومشروبات'
                            : c['title'],
                        'date': '15 مارس 2027',
                        'time': '6:30 م',
                        'icon': c['icon']
                      })),
            const SizedBox(height: 20),
            // آخر الحركات
            const Text('آخر الحركات',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor)),
            const SizedBox(height: 12),
            for (var e in expenses) _expenseRow(e),
            const SizedBox(height: 20),
            // تعديل الميزانية + العودة
            SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                    onPressed: _showEditBudget,
                    style: OutlinedButton.styleFrom(
                        backgroundColor: whiteCard,
                        side: const BorderSide(color: lightBorder),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('تعديل الميزانية',
                        style: TextStyle(
                            color: navy, fontWeight: FontWeight.bold)))),
            const SizedBox(height: 12),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('العودة لتفاصيل الرحلة',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _budgetStat(String label, String value, Color valColor) {
    return Expanded(
        child: Container(
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
            decoration: BoxDecoration(
                color: whiteCard,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lightBorder)),
            child: Column(children: [
              Text(label,
                  style: const TextStyle(color: greyText, fontSize: 12)),
              const SizedBox(height: 6),
              Text(value,
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: valColor),
                  textAlign: TextAlign.center)
            ])));
  }

  Widget _categoryCard(Map<String, dynamic> c, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
              color: whiteCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: lightBorder)),
          child: Row(children: [
            Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                    color: lightBlueBg,
                    borderRadius: BorderRadius.circular(10)),
                child: Icon(c['icon'], color: navy)),
            const SizedBox(width: 12),
            Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                  Text(c['title'],
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, color: textColor)),
                  const SizedBox(height: 3),
                  Text(c['sub'],
                      style: const TextStyle(color: greyText, fontSize: 12))
                ])),
            Text('${c['amount']} ج.م',
                style: const TextStyle(
                    fontWeight: FontWeight.bold, color: textColor)),
          ])),
    );
  }

  Widget _expenseRow(Map<String, dynamic> e) {
    return InkWell(
      onTap: () => _showExpenseDetails(e),
      child: Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
              color: whiteCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: lightBorder)),
          child: Row(children: [
            Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                    color: lightBlueBg,
                    borderRadius: BorderRadius.circular(10)),
                child: Icon(e['icon'], color: navy)),
            const SizedBox(width: 12),
            Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                  Text(e['title'],
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, color: textColor)),
                  const SizedBox(height: 3),
                  Text('${e['category']} - ${e['date']} ${e['time']}',
                      style: const TextStyle(color: greyText, fontSize: 12))
                ])),
            Text('${e['amount']} ج.م',
                style:
                    const TextStyle(fontWeight: FontWeight.bold, color: navy)),
            const SizedBox(width: 6),
            const Icon(Icons.arrow_forward_ios, size: 14, color: greyText),
          ])),
    );
  }
}

// =================== صفحة حجوزاتي - نفس الفيديو بالظبط ===================
