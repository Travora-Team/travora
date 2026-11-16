# Travora Backend

خادم Express للمصادقة على PostgreSQL، باستخدام مخطط Travora الكامل ذي الـ106 جداول.

## التشغيل

المتطلبات: Node.js 22 أو أحدث، وPostgreSQL 16 أو أحدث، وقاعدة بيانات موجودة يمكن الاتصال بها.

داخل مجلد `backend`:

```bash
npm ci
cp -n .env.example .env
```

انسخ ملف البيئة فقط إذا لم يكن `.env` موجودًا، ثم عدّل `DATABASE_URL` ببيانات الاتصال المحلية. لا تُضف الملف إلى Git. باقي الخيارات موضحة في `.env.example`.

```bash
npm run db:setup
npm run dev
```

`db:setup` ينشئ مساحة `travora` من `database/schema.sql` داخل قاعدة البيانات الموجودة. التثبيت الأول يتم في transaction، ولا يحذف جداول `public` أو بياناتها. عند إعادة الأمر يفحص وجود الجداول والمصادقة بدل إعادة إنشاء البيانات. إذا كانت مساحة `travora` موجودة بشكل جزئي، يتوقف ويطلب migration؛ لا يحاول إعادة ضبطها.

للعمل دون إعادة التشغيل التلقائي:

```bash
npm start
```

العنوان الافتراضي `http://127.0.0.1:3000`. يفحص الخادم الاتصال والجداول المطلوبة قبل فتح المنفذ، ويتوقف عند عدم جاهزية قاعدة البيانات. تغيير `.env` يحتاج إعادة تشغيل الخادم.

```bash
curl http://127.0.0.1:3000/api/health
```

النتيجة السليمة:

```json
{"status":"success","data":{"database":"connected"}}
```

## إعدادات البيئة

| المتغير | الافتراضي | الغرض |
|---|---|---|
| `DATABASE_URL` | مطلوب | اتصال PostgreSQL بقاعدة موجودة |
| `NODE_ENV` | `development` | `development` أو`test` أو`production` |
| `HOST` / `PORT` | `127.0.0.1` / `3000` | عنوان ومنفذ الخادم |
| `CORS_ORIGINS` | localhost و127.0.0.1 على5173 | Origins الواجهة المسموحة، مفصولة بفاصلة ودون مسار |
| `SESSION_TTL_DAYS` | `7` | صلاحية الجلسة، بين1 و30 يومًا |
| `AUTH_LOGIN_LIMIT` | `10` | عدد طلبات الدخول لكل IP خلال15 دقيقة |
| `AUTH_REGISTER_LIMIT` | `5` | عدد طلبات التسجيل لكل IP خلالساعة |
| `DB_POOL_MAX` | `10` | الحد الأقصى لاتصالات قاعدة البيانات |
| `TRUST_PROXY_HOPS` | `0` | عدد طبقات proxy الموثوقة فعليًا |

في `production` يجب تحديد `CORS_ORIGINS` صراحة. Cookie الجلسة تصبح `Secure` وتحتاج HTTPS، واسمها `__Host-travora_session`؛ محليًا اسمها `travora_session`. لا تضبط proxy hops إلا بحسب إعداد النشر. حدود المحاولات الحالية تحفظ في ذاكرة كل عملية Node؛ تشغيل أكثر من نسخة يحتاج store مشتركًا للحدود.

## عقد الـAPI

كل طلب POST للمصادقة يستخدم `Content-Type: application/json`. التسجيل يقبل `name` و`email` و`password` فقط؛ الدخول يقبل `email` و`password` فقط. الحقول الإضافية، ومنها `role`، تُرفض.

- الاسم: بعد إزالة المسافات الطرفية، من1 إلى120 حرفًا، دون أحرف تحكم.
- البريد: صحيح وبحد أقصى254 حرفًا، ويحفظ بعد إزالة المسافات الطرفية والتحويل إلى lowercase.
- كلمة المرور الجديدة: من12 إلى128 حرفًا. تحفظ المسافات داخل كلمة المرور وفي أطرافها؛ لا يتم قصها أو إزالة مسافاتها قبل hashing.
- التسجيل ينشئ حساب `traveler` وجلسة دخول مباشرة. التحقق بالبريد/OTP ليس ضمن هذه المرحلة؛ `emailVerified` يبقى `false`.

| المسار | النجاح | أبرز حالات الخطأ |
|---|---|---|
| `POST /api/auth/register` | `201` ومعلومات المستخدم وCookie | `400` بيانات غير صحيحة، `409` بريد مكرر، `429` تجاوز المحاولات |
| `POST /api/auth/login` | `200` ومعلومات المستخدم وCookie جديدة | `400` بيانات غير صحيحة، `401` بيانات دخول خاطئة أو حساب غير نشط، `429` |
| `GET /api/auth/me` | `200` ومعلومات صاحب الجلسة | `401` جلسة مفقودة أو مزورة أو منتهية أو ملغاة |
| `POST /api/auth/logout` | `204` دون محتوى، وإلغاء الجلسة ومسحCookie | `401` دون جلسة صحيحة |
| `GET /api/health` | `200` عند نجاح استعلام قاعدة البيانات | `503` عند تعذر الاتصال |

التسجيل والدخول و`me` يعيدان:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "UUID",
      "name": "أحمد",
      "email": "ahmed@example.com",
      "role": "traveler",
      "emailVerified": false,
      "createdAt": "ISO timestamp"
    }
  }
}
```

الأخطاء لها عقد موحد دون SQL أو stack trace أو بيانات سرية:

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "راجع بيانات الحساب.",
    "details": { "email": "أدخل بريدًا إلكترونيًا صحيحًا." }
  }
}
```

قد يظهر أيضًا `403 ORIGIN_NOT_ALLOWED` لمصدر غير مسموح، و`413 PAYLOAD_TOO_LARGE` فوق16KB، و`415 UNSUPPORTED_MEDIA_TYPE` لطلبات POST غير JSON، و`404 NOT_FOUND`. عنوان `/api/users` القديم استبدل بمسار التسجيل؛ الحسابات المبدئية القديمة في `public.User` تبقى محفوظة، لكنها لا تحتوي على هوية دخول في المخطط الجديد.

## تجربة المسارات

لاختبارها عبر Postman، استخدم [دليل Postman](../docs/postman-guide.md) و[Collection جاهزة بالطلبات والاختبارات](postman/Travora_Auth.postman_collection.json).

الأمثلة تستخدم حسابًا جديدًا وملف Cookies محليًا. لا تستخدم كلمة المرور التجريبية لحساب حقيقي.

```bash
curl -i -c /tmp/travora-cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"name":"أحمد","email":"ahmed@example.com","password":"Travel@2026Safe!"}' \
  http://127.0.0.1:3000/api/auth/register

curl -i -b /tmp/travora-cookies.txt -c /tmp/travora-cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"email":"ahmed@example.com","password":"Travel@2026Safe!"}' \
  http://127.0.0.1:3000/api/auth/login

curl -i -b /tmp/travora-cookies.txt \
  http://127.0.0.1:3000/api/auth/me

curl -i -b /tmp/travora-cookies.txt -c /tmp/travora-cookies.txt \
  -H 'Content-Type: application/json' -d '{}' \
  http://127.0.0.1:3000/api/auth/logout
```

في الواجهة يستخدم كل طلب المصادقة `credentials: 'include'`، وتأتي Cookie من المتصفح تلقائيًا؛ لا تقرأها JavaScript ولا تحفظها في localStorage. اسم localhost و127.0.0.1 مختلفان بالنسبة للـCookies؛ استخدم نفس hostname للواجهة والخادم أثناء التطوير.

```js
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const result = await response.json();
```

ربط نماذج React بالمسارات مرحلة مستقلة؛ هذا التنفيذ يجهز الباك اند وعقد المصادقة.

## كيف يعمل الكود؟

1. `src/index.js`: تحميل البيئة وفحص قاعدة البيانات، ثم تشغيل الخادم وإغلاق اتصالاته عند SIGINT أوSIGTERM.
2. `src/app.js`: Express وHelmet وCORS ومحلل JSON والـCookies، ومسار health ومعالج الأخطاء.
3. `src/routes/authRoutes.js`: ربط المسارات مع حدود المحاولات والتحقق من البيانات والجلسة.
4. `src/controllers/authController.js`: استقبال نتيجة الخدمة، وضبطCookie، وإرجاع HTTP/JSON.
5. `src/services/authService.js`: الاستعلامات والقواعد الفعلية للتسجيل والدخول والجلسات.
6. `src/config/db.js`: connection pool وtransactions وفحص جداول المصادقة.
7. `src/utils/password.js` و`session.js`: hashing لكلمات المرور، وتوليد الجلسة وhash الرمز وإدارةCookie.
8. `src/middleware`: التحقق من المدخلات والجلسة وتحويل الأخطاء إلى استجابات ثابتة.

التسجيل يحسب Argon2id أولًا، ثم ينشئ `users` و`auth_identities` و`user_preferences` و`sessions` داخل transaction واحدة. أي فشل يلغي العملية كلها، فلا يتبقى حساب ناقص. الصلاحية `traveler` يحددها الخادم.

الدخول يجد هوية password ويقارن Argon2id، ثم يعيد فحص حالة الحساب والهوية تحت قفل قبل إنشاء جلسة. البريد غير الموجود وكلمة المرور الخاطئة يعيدان نفس401؛ البريد غير الموجود يمر أيضًا بعملية تحقق hashing. إعادة الدخول معCookie حالية تلغي تلك الجلسة وتصدر رمزًا جديدًا.

الجلسة رمز عشوائي من32 byte داخلCookie `HttpOnly` و`SameSite=Lax`. قاعدة البيانات تحفظ SHA-256 للرمز فقط، مع الانتهاء والإلغاء. `me` يتحقق من الحساب وحالة الجلسة ويحدث `last_seen_at`. تسجيل الخروج يحدث `revoked_at`؛ حتى لو احتفظ العميل بالرمز القديم فلن يمكن استخدامه لاحقًا.

استعلامات البيانات تستخدم parameters، ومصادر المتصفح غير المسموحة تُرفض قبل تنفيذ المسارات. الردود الخاصة بالمصادقة تستخدم `Cache-Control: no-store`. SQL الأصلي محفوظ في `database/schema.sql` مع قيوده ودواله وtriggers؛ التنفيذ الحالي يستخدم `pg`. ملفات Prisma القديمة محفوظة كتاريخ للمخطط المبدئي، ولا تدير مصادقة Travora الحالية.

## الاختبارات

```bash
npm test
```

تستخدم الاختبارات `node:test` وطلبات HTTP فعلية وPostgreSQL. تنشئ قاعدة مؤقتة باسم عشوائي `travora_auth_test_*` باستخدام حساب الاتصال، وتثبت المخطط بها ثم تحذف قاعدة الاختبار بعد النهاية. تحتاج صلاحية `CREATEDB`. لا يتم reset أو حذف بيانات قاعدة `DATABASE_URL`.

تشمل الحالات: التسجيل والدخول و`me` والخروج، البريد المكرر والتسجيل المتزامن، تخزين hashes، استمرار الجلسة مع نسخة خادم أخرى، تدوير الجلسة، الانتهاء والإلغاء، الحساب الموقوف والمحذوف، البيانات الخاطئة ومحاولات رفع الصلاحية، JSON غير صالح وحجم الطلب، CORS ومصدر الطلب، حدود المحاولات،Cookie الإنتاج، rollback عند فشل التخزين، وإعادة تشغيل إعداد قاعدة البيانات دون فقد الحسابات.

المراجع التقنية: [node-argon2](https://github.com/ranisalt/node-argon2)، [استعلامات pg](https://node-postgres.com/features/queries)، [transactions في pg](https://node-postgres.com/features/transactions)، [Express](https://expressjs.com/en/5x/api.html)، [إعداد rate limiting](https://express-rate-limit.mintlify.app/reference/configuration).
