# مرجع مشروع Travora

هذا المرجع يجمع المعلومات التي تمت مراجعتها من المشروع المحلي، وملف Figma الذي أرسله المستخدم، وملفي SQL وERD المرفقين. يميز بين نطاق المشروع المصمم والتنفيذ الموجود في الكود.

## المراجع الأساسية

- [تصميم Figma — منصة السياحة الذكية الفاخرة / Graduation Project](https://www.figma.com/design/WGfzRMh2fq0LkJy5fXgtRq/?node-id=223-332).
- [خارطة البوابات داخل Figma](https://www.figma.com/design/WGfzRMh2fq0LkJy5fXgtRq/?node-id=247-427).
- [مخطط PostgreSQL الكامل](/Users/yousiffares/Desktop/smart-tourism-platform/docs/reference/travora-schema.sql).
- [دليل ERD التفاعلي](/Users/yousiffares/Desktop/smart-tourism-platform/docs/reference/travora-erd.html).
- [فهرس أسماء الشاشات المرصودة وعقد Figma](/Users/yousiffares/Desktop/smart-tourism-platform/docs/reference/figma-screen-inventory.json).
- [Prisma للنسخة المبدئية القديمة](/Users/yousiffares/Desktop/smart-tourism-platform/backend/prisma/schema.prisma).

الـSQL الكامل المرفق بعنوان `Travora database v1.0` هو مرجع تعريف قاعدة البيانات ذات الـ106 جداول. تم تطبيقه محليًا داخل مساحة `travora` لقاعدة `tourismplatform` أثناء تنفيذ المصادقة، مع الحفاظ على جداول وبيانات `public`. ملفات Prisma ذات الخمسة نماذج محفوظة كمرجع للنسخة المبدئية القديمة؛ الباك اند الحالي يستخدم `pg` للمخطط الكامل.

## المنتج والبوابات

Travora منصة سياحية عربية لتخطيط الرحلات واكتشاف الوجهات والحجز ومتابعة اليوم أثناء السفر. تشمل المصروفات والمستندات والتذاكر، والتخطيط وإعادة التخطيط حسب الأحداث أثناء الرحلة.

أكد المستخدم أن المشروع سيشمل تطبيق موبايل باستخدام **Flutter**، إلى جانب واجهة الويب React، مع مشاركة خدمات الباك اند. تطبيق Flutter جزء من الخطة ولم ينفذ بعد في الملفات الحالية.

### المشرفون وأعضاء الفريق

الأسماء مستخرجة من نموذج التخرج الذي أرسله المستخدم. الأسماء المعروضة في العرض بالإنجليزية فقط: **Dr. Lamia Hassaan** للمشرفة، و**Eng. Mohamed Hassan** لعضو الهيئة المعاونة. لا يحدد النموذج أدوار الأعضاء، وقد حددها المستخدم لاحقًا.

أكد المستخدم أن اسمه **يوسف محمد السيد فارس**، وورد في النموذج بالإنجليزية **Yousef Mohamed El Sayed Fares**. طلب ترتيب الفريق باسمه أولًا، ثم حنين ووسام، ثم باقي الأعضاء:

1. Yousef Mohamed El Sayed Fares — Backend
2. Haneen Mohamed Ahmed Atta Mohamed — Frontend
3. Wesam Khaled Farouk Ahmed — Flutter
4. Mostafa Emad Hendawy — AI
5. Youssef Mohamed Shahhat Salem Awad — AI

العرض التقديمي يتكون من ثماني شرائح: العنوان، المشرفون، الفريق والأدوار، Abstract، Introduction، Problem Definition، Solution Approach، Tools. طلب المستخدم أن تكون Abstract وIntroduction منفصلتين، وأن يركز العرض على الفكرة والحل المقترح دون عرض ما تم تنفيذه أو حالة التقدم. طلب أيضًا أن تكون الملفات المسلمة بدون ملاحظات للشرائح، وألا تحتوي على تعليماته أو تفاصيل المحادثة. حدد لاحقًا تصميمًا بصريًا 3D بعناصر مجسمة وعمق وإضاءة، ومظهر Liquid Glass مستوحى من Apple، وانتقالات PowerPoint Morph. لم يطلب مجسمات يمكن تدويرها. مصدر المحتوى هو `docs/presentation-content.md`.

المصدر: [نموذج مشروع التخرج](/Users/yousiffares/Downloads/Graduation_Project_Form_Updated_Travora.pdf). الخانة السادسة في النموذج فارغة. لا تحفظ بيانات الاتصال أو أرقام الطلاب في محتوى العرض.

| البوابة | النطاق الظاهر في التصميم |
|---|---|
| المسافر | الوجهات والأنشطة والفنادق، المخطط الذكي، رحلاتي، الخريطة، الميزانية، المستندات، الحجز والدفع، المطاعم والمرشدون وطلبات الطعام، المفضلة والإشعارات والدعم |
| الفنادق | الغرف والأسعار والتوافر، التقويم، الحجوزات وتفاصيلها وتسجيل الوصول، والمالية |
| المطاعم | القائمة والأصناف والأسعار والتوافر، الطاولات والمواعيد والحجوزات، طلبات الطعام والتحضير والتسليم للسائق |
| المرشدون السياحيون | الملف واللغات والجولات والمواعيد والتوافر، حجوزات الجولات والتقييمات والمستحقات |
| النقل والتوصيل | الأسطول والسائقون والمركبات، الحجوزات، توزيع المهام ومتابعتها والمالية |
| السائقون | المهام وقبولها، مسار الاستلام والتسليم، رموز التحقق وإثبات إتمام الخدمة، السجل والمستحقات والملف |
| إدارة المنصة | مراجعة واعتماد الشركاء، المستخدمون والصلاحيات، الحجوزات والنزاعات، العمولات والتسويات والتحويلات، المحتوى والتقارير والإعدادات وسجل التدقيق |

الشاشات المشتركة تشمل تبديل البوابات ومساحات العمل، دليل الخدمات، الإشعارات، الدعم، وحالات إرسال الطلب أو حفظ البيانات.

## تنظيم Figma ونظام التصميم

تمت مشاهدة الصفحات الـ12 التالية في قائمة الملف:

1. `00 • Cover · Travora`
2. `01 • Getting Started`
3. `02 • Design System`
4. `03 • Platform Navigation · Travora`
5. `04 • Traveler Screens & Prototype · Desktop`
6. `05 • Traveler Screens & Prototype · Mobile`
7. `06 • Provider Portals · Desktop`
8. `07 • Provider Portals · Mobile`
9. `08 • Driver Portal · Desktop`
10. `09 • Driver Portal · Mobile`
11. `10 • Platform Admin · Desktop`
12. `11 • Platform Admin · Mobile`

خارطة المنصة تذكر: **171 شاشة لكل جهاز، 4 مجموعات للصفحات، 6 أنواع حجز، 106 جداول، 156 حالة تحقق ناجحة**. تم استخراج فهرس الديسكتوب والموبايل وحساب الشاشات بعد استبعاد الأقسام والحاويات ودليل النموذج والنوافذ. فهرس الديسكتوب يطابق 171 شاشة: 79 للمسافر، 44 لمقدمي الخدمات، 20 للسائقين، 28 للإدارة. توجد كذلك 68 نافذة/حالة للمسافر و68 Mobile Sheets. لم يتم تشغيل الاختبارات المذكورة في Figma.

الفهرس المستخرج للموبايل يحتوي على 170 شاشة عادية: 78 للمسافر و44 لمقدمي الخدمات و20 للسائقين و28 للإدارة. شاشة `activitiesFiltered` تظهر في فهرس الديسكتوب، ولم يظهر صف شاشة مقابل لها في فهرس الموبايل المستخرج. هذا فرق بين الفهرسين يحتاج مراجعة الفريم عند تنفيذ تصفية الأنشطة؛ لا يعد إثباتًا لغيابها من تجربة النموذج.

نظام التصميم يحتوي على Ocean Blue وTurquoise وSunset Orange، وألوان الخلفيات والنصوص والحدود والحالات والخرائط. يضم Button وInput وChoice وExperience Card وMetric Card وData Row وStatus Badge وخريطة القاهرة وصور الوجهات والإقامة.

الواجهة عربية RTL، وخط Cairo مذكور في دليل النموذج ومكونات الواجهة. الألوان الأساسية المعرفة في الكود: الأزرق `#0099FF`، التركواز `#00C8A8`، البرتقالي `#FF8A00`. تعتمد الواجهة على البطاقات المستديرة والصور والتدرجات والظلال الناعمة.

تظهر في نموذج المسافر حالات تسجيل الدخول والتسجيل والتحقق واستعادة كلمة المرور، والبحث والتصفية والنتائج الفارغة، وحالات الحجز والدفع والإلغاء، والخطط المحفوظة وإعادة التخطيط، وإضافة المصروفات والمستندات، ومشاركة الرحلة، وتفضيلات الحساب والإشعارات، و401 و404 وانقطاع الاتصال. عرض البيانات في Figma لا يثبت وجود خدمات حية مرتبطة بها.

## قاعدة البيانات الكاملة

المخطط يستهدف PostgreSQL 16+ ويستخدم مساحة أسماء `travora`. ملفا SQL وERD يحتويان على نفس أسماء الجداول والـViews؛ تمت أيضًا مقارنة أسماء الأعمدة بعد احتساب `ALTER TABLE` وكانت متطابقة.

- **106 جداول**.
- **1073 عمودًا**.
- **238 علاقة FK**؛ عدد `REFERENCES` في SQL يطابق عدد العلاقات في ERD.
- **8 Views** محسوبة.
- كل جدول في ERD له مفتاح أساسي، وكل هدف FK موجود ضمن الجداول المرفقة.

| الوحدة | عدد الجداول |
|---|---:|
| الحسابات وتفضيلات المستخدم | 7 |
| مقدمو الخدمات والفرق | 17 |
| الوجهات والخدمات والمخزون | 27 |
| الرحلات والتخطيط الذكي | 14 |
| الحجوزات وتشغيل الخدمات | 23 |
| الدفع والتسويات والتحويلات | 9 |
| المفضلة والدعم والمحتوى | 9 |

### العلاقات وقواعد النمذجة الرئيسية

- الهوية: `users` مع `user_preferences` و`auth_identities` و`sessions` و`auth_challenges`. كلمات المرور تخص هويات المصادقة، والجلسات والتحديات لها حقول hashes ومواعيد انتهاء. أدوار `users.role` هي `traveler` و`provider` و`admin`؛ السائق له `driver_profiles` وعضويات لدى مقدم الخدمة، وليس قيمة `driver` في هذا الحقل.
- الشركاء: `providers` مع الفروع والتصنيفات وطلبات الانضمام ووثائقها والتراخيص، وعضويات الفرق والدعوات والأدوار والصلاحيات والاستثناءات وسجل التدقيق والمركبات.
- الرحلات: `users → trips → itinerary_versions → itinerary_days → itinerary_items`. ترتبط الرحلة بوجهة وعملة وتواريخ بداية ونهاية، ويمكنها الإشارة إلى نسخة الخطة النشطة. توجد طلبات تخطيط ومهام AI ومحاولات وأحداث مباشرة وطلبات إعادة تخطيط ومصروفات ومستندات ومسافرون وروابط مشاركة.
- الخدمات: الفنادق وأنواع الغرف ومخزون الليالي؛ الأنشطة وجلساتها؛ خدمات النقل وعروضها؛ المطاعم والطاولات والجلسات وقوائم الطعام ومخزونها؛ المرشدون واللغات وفترات التوافر.
- الحجز: جدول `bookings` موحد مع تفاصيل متخصصة للحجز. الأنواع الستة هي `HOTEL` و`ACTIVITY` و`TRANSPORT` و`RESTAURANT` و`GUIDE` و`DELIVERY`. يرتبط الحجز بالمستخدم والرحلة ومقدم الخدمة وفرعه عند وجودهما، ويحفظ snapshots لتفاصيل الخدمة وسياسة الإلغاء.
- دورة الحجز: `draft` و`pending_payment` و`confirmed` و`cancelled` و`expired` و`completed`. شروط الدفع `prepaid` أو`pay_on_service`. توجد سجلات تغيّر الحالة والإلغاء وتخصيصات المخزون لكل نوع خدمة.
- تشغيل الخدمة: `service_dispatches` يربط الحجز بمقدم الخدمة والسائق والمركبة. الحالات تشمل الإسناد والقبول والتحرك والوصول والاستلام والإتمام والإلغاء، مع أحداث الموقع وسجل التشغيل وإثبات الإتمام.
- المالية: محاولات دفع وwebhook events واستردادات، ثم قواعد وعمولات الحجز وبنود التسوية وتسويات مقدم الخدمة ووجهات التحويل والتحويلات. طرق الدفع المعرفة هي `card` و`wallet` و`onsite`؛ وجود اسم طريقة دفع لا يعني أن بوابة دفع فعلية موصولة.
- المبالغ المالية بوحدات صحيحة صغيرة `*_minor`، والعملة تعرف `minor_units`. كثير من الكيانات تستخدم UUID، والأوقات التشغيلية تستخدم `timestamptz`، مع تواريخ محلية ومناطق زمنية للرحلات والوجهات.
- المخطط يضم قيود CHECK ومفاتيح مركبة وفهارس ودوال وtriggers لتنظيم الملكية والنطاق وحالات الحجز وتخصيص المخزون والمالية والتشغيل. هذه مراجعة للمخطط المرفق، وليست إثباتًا لتطبيقه أو اختبار كل سلوك تشغيلي.

الـViews هي `booking_balances` و`driver_dispatch_availability` و`provider_booking_earnings` و`provider_cash_positions` و`provider_current_verification` و`provider_effective_permissions` و`provider_settlement_balances` و`trip_budget_summary`.

## التنفيذ الموجود في المشروع المحلي

- `frontend`: React 19 وVite 8 وTailwind 4 وReact Router، حسب الحزم المعلنة. الصفحة الرئيسية تضم Navbar وHero والوجهات والتخطيط المباشر والخدمات وFooter. توجد صور Hero للموبايل والتابلت والديسكتوب وصور الوجهات والأنشطة والخدمات.
- المسارات المسجلة: الرئيسية، `login`، `register`، و404. روابط الفنادق والوجهات ورحلاتي وعنا تظهر في التنقل، لكن صفحاتها ليست مسجلة في Router الحالي. نموذج Hero ينتقل إلى `/destinations` دون إرسال بحث إلى API.
- الدخول والتسجيل صفحات أولية غير موصولة بالمصادقة. الميزانية والمرور والطقس وإعادة ترتيب اليوم في الرئيسية عرض توضيحي ثابت.
- `backend`: Node.js 22+ وExpress و`pg`/PostgreSQL. المسارات الحالية هي `GET /api/health` و`POST /api/auth/register` و`POST /api/auth/login` و`GET /api/auth/me` و`POST /api/auth/logout`. مسار إنشاء المستخدم المبدئي `/api/users` استبدل بالتسجيل.
- التسجيل ينشئ مستخدمًا وصلاحية traveler وهوية password وتفضيلات وجلسة في transaction واحدة. كلمات المرور Argon2id، ورمز الجلسة العشوائي داخل Cookie HttpOnly/SameSite، وتخزن قاعدة البيانات SHA-256 للرمز. الجلسات تستمر في PostgreSQL وتلغى عند الخروج. يوجد تحقق مدخلات وحدود محاولات وCORS محدد ومعالجة JSON للأخطاء. README الباك اند يشرح التشغيل والكود وعقد الـAPI.
- ملف Prisma القديم يضم `User` و`Trip` و`Itinerary` و`Provider` و`Booking` فقط، بمفاتيح Int ومبالغ Float، ولا يصف اتصال المصادقة الحالي. البيانات المبدئية القديمة في `public` لم تُحذف أو تحول إلى حسابات مصادقة تلقائيًا.
- `ai-engine`: يحتوي حاليًا على README فقط.
- الاسم الظاهر في مكونات الواجهة Travora، بينما عنوان HTML الحالي ما زال `Travlifa | خطط رحلتك`.

المخطط الكامل ونطاق Figma هما مراجع المشروع المطلوب. مخطط قاعدة البيانات والمصادقة يعملان محليًا؛ بقية الخدمات والواجهات ومحرك AI ما زالت مراحل تنفيذ لاحقة. أي migrations لاحقة تحتاج مراجعة الحالة الفعلية للقاعدة، ويمنع استخدام نموذج Prisma القديم باعتباره وصفًا لمخطط Travora الكامل. اختبارات المصادقة تستخدم قاعدة منفصلة مؤقتة وتتحقق من المسارات عبر HTTP وPostgreSQL.

## فهرس الجداول الكامل

الفهرس التالي يولّد من بيانات ERD المرفقة؛ تفاصيل الأعمدة والمفاتيح والقيود كاملة محفوظة في SQL ودليل ERD.

### الحسابات وتفضيلات المستخدم — 7 جداول

`auth_challenges`, `auth_identities`, `interests`, `sessions`, `user_interests`, `user_preferences`, `users`

### مقدمو الخدمات والفرق — 17 جداول

`driver_profiles`, `provider_application_documents`, `provider_applications`, `provider_audit_events`, `provider_branches`, `provider_categories`, `provider_category_assignments`, `provider_invitations`, `provider_license_types`, `provider_licenses`, `provider_member_permission_overrides`, `provider_memberships`, `provider_permissions`, `provider_role_permissions`, `provider_roles`, `provider_vehicles`, `providers`

### الوجهات والخدمات والمخزون — 27 جداول

`activities`, `activity_sessions`, `amenities`, `countries`, `currencies`, `destination_media`, `destinations`, `guide_availability_slots`, `guide_languages`, `guide_profiles`, `hotel_amenities`, `hotels`, `media_assets`, `menu_item_inventory`, `menu_items`, `restaurant_delivery_settings`, `restaurant_hours`, `restaurant_menu_categories`, `restaurant_reservation_sessions`, `restaurant_table_inventory`, `restaurant_tables`, `restaurants`, `room_inventory`, `room_type_amenities`, `room_types`, `transport_offers`, `transport_services`

### الرحلات والتخطيط الذكي — 14 جداول

`ai_job_attempts`, `ai_jobs`, `itinerary_days`, `itinerary_items`, `itinerary_versions`, `planner_requests`, `trip_budget_categories`, `trip_documents`, `trip_expenses`, `trip_live_events`, `trip_replans`, `trip_share_links`, `trip_travelers`, `trips`

### الحجوزات وتشغيل الخدمات — 23 جداول

`activity_allocations`, `activity_booking_details`, `booking_cancellations`, `booking_status_history`, `booking_travelers`, `bookings`, `food_cart_items`, `food_carts`, `food_delivery_details`, `food_delivery_status_history`, `food_order_lines`, `guide_allocations`, `guide_booking_details`, `hotel_booking_details`, `restaurant_allocations`, `restaurant_booking_details`, `room_night_allocations`, `service_completion_proofs`, `service_dispatch_events`, `service_dispatches`, `service_location_events`, `transport_allocations`, `transport_booking_details`

### الدفع والتسويات والتحويلات — 9 جداول

`booking_commissions`, `commission_rules`, `payment_attempts`, `payment_webhook_events`, `provider_payout_destinations`, `provider_payouts`, `provider_settlements`, `refunds`, `settlement_items`

### المفضلة والدعم والمحتوى — 9 جداول

`content_pages`, `faq_entries`, `favorites`, `newsletter_subscriptions`, `notifications`, `reviews`, `support_attachments`, `support_messages`, `support_tickets`
