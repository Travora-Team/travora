import 'package:flutter/material.dart';
import 'package:my_app/core/core.dart';
import 'package:my_app/features/transport/transport_service_screens.dart';

void showTransportReviewSheet(BuildContext context,
    {required String title,
    required String type,
    required String price,
    required String dateText}) {
  final Color navy = const Color(0xFF1E88FF);
  final Color bg = const Color(0xFFEEF5FF);
  final Color txt = const Color(0xFF0A2A5E);
  final Color grey = const Color(0xFF8A9BB5);
  final Color lightBg = const Color(0xFFE3F0FF);
  showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (_) => Padding(
          padding: const EdgeInsets.all(16),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Row(children: [
              InkWell(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                          color: bg, borderRadius: BorderRadius.circular(20)),
                      child: Icon(Icons.close, size: 18, color: txt))),
              const Spacer(),
              Text('راجع انتقالك',
                  style: TextStyle(
                      fontSize: 17, fontWeight: FontWeight.bold, color: txt))
            ]),
            const SizedBox(height: 16),
            Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                    color: lightBg, borderRadius: BorderRadius.circular(50)),
                child: Icon(Icons.check, color: navy, size: 28)),
            const SizedBox(height: 12),
            Text(title,
                style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold, color: txt)),
            const SizedBox(height: 4),
            Text('$type - $price', style: TextStyle(fontSize: 13, color: grey)),
            const SizedBox(height: 16),
            SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) => TransportBookingScreen(
                                  title: title,
                                  type: type,
                                  price: price,
                                  dateText: dateText)));
                    },
                    style: ElevatedButton.styleFrom(
                        backgroundColor: navy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14))),
                    child: const Text('متابعة الحجز',
                        style: TextStyle(fontWeight: FontWeight.bold)))),
            const SizedBox(height: 8),
            TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('إغلاق',
                    style: TextStyle(color: grey, fontWeight: FontWeight.bold)))
          ])));
}

// ---------- 3: نموذج بيانات الحجز ----------
class TransportBookingScreen extends StatefulWidget {
  final String title;
  final String type;
  final String price;
  final String dateText;
  const TransportBookingScreen(
      {super.key,
      required this.title,
      required this.type,
      required this.price,
      required this.dateText});
  @override
  State<TransportBookingScreen> createState() => _TransportBookingScreenState();
}

class _TransportBookingScreenState extends State<TransportBookingScreen> {
  final Color navy = const Color(0xFF1E88FF);
  final Color bg = const Color(0xFFEEF5FF);
  final Color card = Colors.white;
  final Color lightBg = const Color(0xFFE3F0FF);
  final Color border = const Color(0xFFD6E6FF);
  final Color txt = const Color(0xFF0A2A5E);
  final Color grey = const Color(0xFF8A9BB5);

  final firstNameCtrl = TextEditingController();
  final lastNameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final phoneCtrl = TextEditingController();
  final flightCtrl = TextEditingController();
  String airport = 'القاهرة مصر';
  String transportMethod = 'سيارة مع سائق';
  String dropoff = 'القاهرة مصر';
  String paymentMethod = 'بطاقة بنكية';
  final cardHolderCtrl = TextEditingController();
  final cardNumberCtrl = TextEditingController();
  final cardExpiryCtrl = TextEditingController();
  final cardCvvCtrl = TextEditingController();
  final walletCtrl = TextEditingController();
  final List<String> cities = [
    'القاهرة مصر',
    'الجيزة مصر',
    'القاهرة القديمة مصر',
    'الأقصر مصر',
    'شرم الشيخ مصر'
  ];
  final List<String> transportMethods = [
    'سيارة مع سائق',
    'سيارة خاصة',
    'وسائل عامة'
  ];

  void _showCancelPolicy() {
    showModalBottomSheet(
        context: context,
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
        builder: (_) => Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    InkWell(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                                color: bg,
                                borderRadius: BorderRadius.circular(20)),
                            child: Icon(Icons.close, size: 18, color: txt))),
                    const Spacer(),
                    Text('سياسة التعديل والإلغاء',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt))
                  ]),
                  const SizedBox(height: 6),
                  Text('راجع شروط الخدمة قبل تأكيد الحجز',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 14),
                  Text('قبل الوصول بـ 7 أيام',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, color: txt)),
                  const SizedBox(height: 4),
                  Text('إلغاء مجاني في هذا المثال',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 12),
                  Text('بعد المهلة',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, color: txt)),
                  const SizedBox(height: 4),
                  Text('قد تطبق رسوم الإلغاء',
                      style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 12),
                  Text('الاسترداد',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, color: txt)),
                  const SizedBox(height: 4),
                  Text('تظهر طريقة الاسترداد والمهلة في تفاصيل الحجز',
                      style: TextStyle(fontSize: 13, color: grey, height: 1.6)),
                  const SizedBox(height: 16),
                  SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                          onPressed: () => Navigator.pop(context),
                          style: ElevatedButton.styleFrom(
                              backgroundColor: navy,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14))),
                          child: const Text('فهمت',
                              style: TextStyle(fontWeight: FontWeight.bold))))
                ])));
  }

  void _pickSheet(String title, String subtitle, List<String> options,
      String current, ValueChanged<String> onPick) {
    showModalBottomSheet(
        context: context,
        shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
        builder: (_) => Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    InkWell(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                                color: bg,
                                borderRadius: BorderRadius.circular(20)),
                            child: Icon(Icons.close, size: 18, color: txt))),
                    const Spacer(),
                    Text(title,
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: txt))
                  ]),
                  const SizedBox(height: 6),
                  Text(subtitle, style: TextStyle(fontSize: 13, color: grey)),
                  const SizedBox(height: 14),
                  ...options.map((o) => Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ElevatedButton(
                          onPressed: () {
                            onPick(o);
                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: current == o ? navy : lightBg,
                              foregroundColor:
                                  current == o ? Colors.white : txt,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14)),
                          child: Text(o,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold)))))
                ])));
  }

  Widget _input(String label, String hint, TextEditingController ctrl,
      {TextInputType? keyboard}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label,
          style:
              TextStyle(fontWeight: FontWeight.bold, color: txt, fontSize: 13)),
      const SizedBox(height: 6),
      TextField(
          controller: ctrl,
          keyboardType: keyboard,
          decoration: InputDecoration(
              hintText: hint,
              hintStyle: TextStyle(color: grey, fontSize: 13),
              filled: true,
              fillColor: card,
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: border)),
              enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: border)),
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 14, vertical: 14)))
    ]);
  }

  Widget _selectField(String label, String value, VoidCallback onTap) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label,
          style:
              TextStyle(fontWeight: FontWeight.bold, color: txt, fontSize: 13)),
      const SizedBox(height: 6),
      InkWell(
          onTap: onTap,
          child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
              decoration: BoxDecoration(
                  color: card,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: border)),
              child: Row(children: [
                Expanded(
                    child: Text(value,
                        style: TextStyle(
                            color: txt, fontWeight: FontWeight.bold))),
                Icon(Icons.keyboard_arrow_down, color: grey)
              ])))
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
        textDirection: TextDirection.rtl,
        child: Scaffold(
            backgroundColor: bg,
            appBar: AppBar(
                backgroundColor: card,
                elevation: 0,
                leading: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.arrow_back_ios, size: 18, color: txt)),
                title: Row(children: [
                  Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                          color: navy, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.send,
                          color: Colors.white, size: 16)),
                  const SizedBox(width: 8),
                  Text('Travora',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: txt))
                ]),
                actions: [
                  IconButton(
                      onPressed: () {}, icon: Icon(Icons.search, color: txt)),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(Icons.notifications_none, color: txt)),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(Icons.person_outline, color: txt))
                ]),
            body: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('أكمل حجزك',
                          style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: txt)),
                      const SizedBox(height: 4),
                      Text('راجع الطلب وبيانات المسافر وطريقة الدفع',
                          style: TextStyle(fontSize: 13, color: grey)),
                      const SizedBox(height: 16),
                      Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                              color: card,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: border)),
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ClipRRect(
                                    borderRadius: const BorderRadius.vertical(
                                        top: Radius.circular(18)),
                                    child: Image.network(
                                        'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80',
                                        height: 160,
                                        width: double.infinity,
                                        fit: BoxFit.cover)),
                                Padding(
                                    padding: const EdgeInsets.all(14),
                                    child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                              '${widget.type} - ${widget.title}',
                                              style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.bold,
                                                  color: txt)),
                                          const SizedBox(height: 4),
                                          Text(
                                              '${widget.type} - ${widget.title}',
                                              style: TextStyle(
                                                  fontSize: 12, color: grey)),
                                          const SizedBox(height: 4),
                                          Text(
                                              '${widget.dateText} - 10:30 ص - رحلة واحدة',
                                              style: TextStyle(
                                                  fontSize: 12, color: grey)),
                                          const SizedBox(height: 2),
                                          Text(
                                              'رحلة واحدة من المطار إلى الفندق',
                                              style: TextStyle(
                                                  fontSize: 12, color: grey)),
                                          const SizedBox(height: 8),
                                          Text('الخدمة والضرائب',
                                              style: TextStyle(
                                                  fontSize: 12, color: grey)),
                                          Text(widget.price,
                                              style: TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.bold,
                                                  color: navy)),
                                          const SizedBox(height: 10),
                                          SizedBox(
                                              width: double.infinity,
                                              height: 48,
                                              child: ElevatedButton(
                                                  onPressed: _showCancelPolicy,
                                                  style: ElevatedButton.styleFrom(
                                                      backgroundColor: lightBg,
                                                      foregroundColor: navy,
                                                      elevation: 0,
                                                      shape:
                                                          RoundedRectangleBorder(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          12))),
                                                  child: const Text(
                                                      'مراجعة سياسة الإلغاء',
                                                      style: TextStyle(
                                                          fontWeight: FontWeight
                                                              .bold))))
                                        ]))
                              ])),
                      const SizedBox(height: 22),
                      Text('المسافر الرئيسي',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: txt)),
                      const SizedBox(height: 12),
                      _input('الاسم الأول', 'اكتب الاسم الأول', firstNameCtrl),
                      const SizedBox(height: 12),
                      _input('اسم العائلة', 'اكتب اسم العائلة', lastNameCtrl),
                      const SizedBox(height: 12),
                      _input('البريد الإلكتروني', 'اكتب البريد الإلكتروني',
                          emailCtrl,
                          keyboard: TextInputType.emailAddress),
                      const SizedBox(height: 12),
                      _input('رقم الهاتف', 'اكتب رقم الهاتف', phoneCtrl,
                          keyboard: TextInputType.phone),
                      const SizedBox(height: 22),
                      Text('تفاصيل الاستقبال',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: txt)),
                      const SizedBox(height: 12),
                      _input(
                          'رقم الرحلة الجوية', 'اكتب رقم الرحلة', flightCtrl),
                      const SizedBox(height: 12),
                      _selectField(
                          'مطار الوصول',
                          airport,
                          () => _pickSheet(
                              'اختر وجهتك',
                              'اختر المدينة التي تبدأ منها رحلتك',
                              cities,
                              airport,
                              (v) => setState(() => airport = v))),
                      const SizedBox(height: 12),
                      _selectField(
                          'وسيلة التنقل',
                          transportMethod,
                          () => _pickSheet(
                              'وسيلة التنقل',
                              'اختر طريقة التنقل بين أماكن الرحلة',
                              transportMethods,
                              transportMethod,
                              (v) => setState(() => transportMethod = v))),
                      const SizedBox(height: 12),
                      _selectField(
                          'مكان التوصيل',
                          dropoff,
                          () => _pickSheet(
                              'اختر وجهتك',
                              'اختر المدينة التي تبدأ منها رحلتك',
                              cities,
                              dropoff,
                              (v) => setState(() => dropoff = v))),
                      const SizedBox(height: 12),
                      Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                              color: lightBg,
                              borderRadius: BorderRadius.circular(12)),
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('سائق ينتظرك عند الوصول',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: txt)),
                                const SizedBox(height: 4),
                                Text(
                                    'يشمل السعر الانتظار لمدة ساعة بعد هبوط الطائرة. أضف رقم الرحلة لمراجعة وقت الاستقبال',
                                    style: TextStyle(
                                        fontSize: 13, color: grey, height: 1.6))
                              ])),
                      const SizedBox(height: 22),
                      Text('طريقة الدفع',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: txt)),
                      const SizedBox(height: 12),
                      _selectField(
                          'طريقة الدفع المختارة',
                          paymentMethod,
                          () => _pickSheet(
                              'طريقة الدفع',
                              'اختر طريقة الدفع المناسبة لك',
                              [
                                'بطاقة بنكية',
                                'محفظة إلكترونية',
                                'الدفع لاحقاً'
                              ],
                              paymentMethod,
                              (v) => setState(() => paymentMethod = v))),
                      const SizedBox(height: 12),
                      if (paymentMethod == 'بطاقة بنكية') ...[
                        _input('اسم حامل البطاقة', 'اكتب اسم حامل البطاقة',
                            cardHolderCtrl),
                        const SizedBox(height: 12),
                        _input(
                            'رقم البطاقة', 'اكتب رقم البطاقة', cardNumberCtrl,
                            keyboard: TextInputType.number),
                        const SizedBox(height: 12),
                        Row(children: [
                          Expanded(
                              child: _input(
                                  'تاريخ الانتهاء', 'MM / YY', cardExpiryCtrl)),
                          const SizedBox(width: 12),
                          Expanded(
                              child: _input('رمز الأمان', 'CVV', cardCvvCtrl,
                                  keyboard: TextInputType.number))
                        ])
                      ],
                      if (paymentMethod == 'محفظة إلكترونية') ...[
                        _input('اسم صاحب المحفظة', 'اكتب اسم صاحب المحفظة',
                            cardHolderCtrl),
                        const SizedBox(height: 12),
                        _input('رقم المحفظة', 'اكتب رقم المحفظة', walletCtrl,
                            keyboard: TextInputType.phone)
                      ],
                      if (paymentMethod == 'الدفع لاحقاً') ...[
                        Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                                color: lightBg,
                                borderRadius: BorderRadius.circular(12)),
                            child: Text(
                                'هتدفع عند الوصول، ومش محتاج تدخل بيانات بطاقة دلوقتي',
                                style: TextStyle(
                                    fontSize: 13, color: grey, height: 1.6)))
                      ],
                      const SizedBox(height: 12),
                      TextButton(
                          onPressed: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) =>
                                      const TransportServiceTermsScreen())),
                          child: Text('شروط الحجز',
                              style: TextStyle(
                                  color: navy, fontWeight: FontWeight.bold))),
                      Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                              color: lightBg,
                              borderRadius: BorderRadius.circular(12)),
                          child: Text('مساعدة في الحجز والدفع',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, color: txt))),
                      const SizedBox(height: 22),
                      SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                              onPressed: () {
                                if (firstNameCtrl.text.isEmpty ||
                                    lastNameCtrl.text.isEmpty ||
                                    emailCtrl.text.isEmpty ||
                                    phoneCtrl.text.isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                          content: Text(
                                              'كملي بيانات المسافر الأول')));
                                  return;
                                }
                                final data = TransportBookingData(
                                    title: widget.title,
                                    type: widget.type,
                                    priceText: widget.price,
                                    priceValue: int.tryParse(widget.price
                                            .replaceAll(
                                                RegExp(r'[^0-9]'), '')) ??
                                        850,
                                    dateText: widget.dateText,
                                    firstName: firstNameCtrl.text,
                                    lastName: lastNameCtrl.text,
                                    email: emailCtrl.text,
                                    phone: phoneCtrl.text,
                                    paymentMethod: paymentMethod);
                                showConfirmBookingSheet(context, data: data);
                              },
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: navy,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14))),
                              child: Text('تأكيد الحجز والدفع - حجز آمن',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold)))),
                      const SizedBox(height: 16),
                    ]))));
  }
}

// ---------- 5: شيت نؤكد حجزك ----------
