ELECTRIC SYSTEM — إصلاح ظهور واتساب والوصول إلى الباركود (V2.1)

سبب المشكلة:
- نسخة V2 الأصلية تعرض Instagram/Facebook/Telegram/YouTube فقط في قسم التواصل.
- supportWhatsapp كان يستخدم لإرسال طلبات الخدمة داخل النافذة، ولا ينشئ زر واتساب ضمن التواصل الاجتماعي.
- الباركود موجود أصلاً في qr.html، لكن رابط الوصول إليه كان في تذييل الصفحة فقط.

التعديل:
- إضافة زر واتساب في قسم التواصل وفي واجهة الصفحة الرئيسية إذا كان رقم الدعم صحيحاً.
- إضافة زر باركود QR واضح في القسم الرئيسي.
- قبول أرقام العراق بصيغة 07xxxxxxxxx أو 9647xxxxxxxxx أو رابط wa.me.
- لا تعديل على خدمة الإصدارات أو Supabase أو نظام Flutter.

ارفع إلى GitHub: docs/index.html + docs/app.js + docs/styles.css فقط.
لا ترفع config.json من الحزمة القديمة أو الجديدة فوق config.json الحالي، كي لا يمحى رقم واتساب الذي أدخلته.

ضبط الرقم في docs/config.json:
  "supportWhatsapp": "9647XXXXXXXXX"
استبدل X برقمك الفعلي؛ لا تدخل قيمة تجريبية.

بعد الرفع افتح:
https://ali-dhya96.github.io/electric_reparing/
الباركود:
https://ali-dhya96.github.io/electric_reparing/qr.html
إذا ظهر محتوى قديم، حدّث الصفحة مع Ctrl+F5 وافحص ملف config.json المنشور.
