# اختبار Travora باستخدام Postman

## تشغيل الخادم

من Terminal:

```bash
cd /Users/yousiffares/Desktop/smart-tourism-platform/backend
npm run dev
```

اترك Terminal مفتوحًا. يجب ظهور رسالتي تشغيل الخادم واتصال PostgreSQL.
العنوان الافتراضي: `http://127.0.0.1:3000`.

إذا ظهر خطأ اتصال بقاعدة البيانات، تأكد من تشغيل PostgreSQL وصحة `DATABASE_URL` في `backend/.env`. لإعداد قاعدة موجودة لأول مرة، اتبع [دليل الباك إند](../backend/README.md).

## استيراد الطلبات

1. افتح تطبيق Postman على جهازك، ثم Import.
2. اختر [Travora Auth Collection](../backend/postman/Travora_Auth.postman_collection.json).
3. ستظهر Collection باسم **Travora — Local Authentication**.
4. لا تحتاج Environment؛ المتغير `baseUrl` موجود في Variables الخاصة بالـCollection.
5. استخدم **No Auth** واترك Cookie jar مفعّلًا.
6. افتح الطلبات من 01 إلى 11 واضغط Send بالترتيب، أو شغّل Collection كاملة بواحدة Iteration.
7. راجع Status وBody وTest Results. حالات الخطأ مقصودة؛ ظهور 400 أو401 أو409 في طلب الاختبار المناسب يعني أن الحماية تعمل.

الطلب 02 يولّد بريدًا تجريبيًا جديدًا ويحفظه لبقية الطلبات. ينشئ حساب traveler في قاعدة البيانات المحلية. كلمة المرور التجريبية `Travora@2026Test!`.

| الترتيب | الطلب | النتيجة المتوقعة |
|---|---|---|
| 01 | GET /api/health | 200، قاعدة البيانات متصلة |
| 02 | POST /api/auth/register | 201، حساب جديد وCookie |
| 03 | GET /api/auth/me | 200، بيانات الحساب المسجل |
| 04 | POST /api/auth/login | 200، جلسة دخول جديدة |
| 05 | GET /api/auth/me | 200، بيانات الحساب |
| 06 | POST /api/auth/logout | 204، بدون Body |
| 07 | GET /api/auth/me | 401، تم إنهاء الجلسة |
| 08 | POST /api/auth/login بكلمة مرور خاطئة | 401 |
| 09 | POST /api/auth/register بنفس البريد | 409 |
| 10 | POST /api/auth/register بكلمة مرور قصيرة | 400 |
| 11 | POST /api/auth/register ببريد غير صحيح | 400 |

## إنشاء الطلبات يدويًا

كل طلب POST: اختر **Body → raw → JSON**. سيضاف `Content-Type: application/json`.

التسجيل: `POST http://127.0.0.1:3000/api/auth/register`

```json
{
  "name": "Yousef",
  "email": "yousef.travora.test@example.com",
  "password": "Travora@2026Test!"
}
```

اختر بريدًا جديدًا إذا سبق تسجيل هذا البريد. كلمة المرور من12 إلى128 حرفًا. لا تضف حقولًا مثل `role`؛ الخادم يحدد الدور `traveler`.

الدخول: `POST http://127.0.0.1:3000/api/auth/login`

```json
{
  "email": "yousef.travora.test@example.com",
  "password": "Travora@2026Test!"
}
```

بيانات المستخدم: `GET http://127.0.0.1:3000/api/auth/me`، بدون Body.

الخروج: `POST http://127.0.0.1:3000/api/auth/logout`، مع JSON Body `{}`.

Postman يحفظ Cookie باسم `travora_session` ويرسلها تلقائيًا. التسجيل ينشئ جلسة مباشرة؛ يمكن تجربة me قبل login. استخدم `127.0.0.1` في كل الطلبات، لأن `localhost` له Cookies مختلفة. لا تحتاج Bearer token أو إضافة Origin يدويًا.

## حل الأخطاء الشائعة

- **ECONNREFUSED:** الخادم متوقف أو العنوان/المنفذ غير صحيح.
- **EADDRINUSE عند التشغيل:** المنفذ مستخدم بالفعل؛ جرّب `/api/health` أولًا، فقد يكون الباك إند يعمل في Terminal آخر.
- **401 في me قبل الخروج:** سجل الدخول وتأكد من تفعيل Cookie jar وثبات hostname.
- **409 في التسجيل:** البريد مسجل بالفعل.
- **415:** اختر raw ثم JSON، وليس form-data أو Text، حتى مع logout.
- **403 ORIGIN_NOT_ALLOWED:** احذف Origin المضاف يدويًا أو استخدم Origin مسموحًا في إعدادات الخادم.
- **429:** تجاوزت حد المحاولات. الافتراضي5 طلبات تسجيل في الساعة و10 طلبات دخول كل15 دقيقة لكلIP، وتشمل الطلبات المرفوضة. تشغيل الـCollection مرة واحدة يستخدم4 طلبات تسجيل؛ لا تكرر التشغيل مباشرة.
- **503:** اتصال قاعدة البيانات غير متاح.

مراجع Postman: [الاستيراد](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data/)، [إدارة Cookies](https://learning.postman.com/docs/use/send-requests/response-data/cookies).
