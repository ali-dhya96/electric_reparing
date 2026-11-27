# دليل استخدام ELECTRIC SYSTEM — نسخة المعاينة V3

هذه الحزمة مجلد موقع GitHub Pages كامل، مبني على نسخة الموقع V2 مع إضافات WhatsApp وQR من V2.1. لا تحتاج Android Studio ولا SQL ولا تعديل Edge Functions لإظهار الدليل.

## طريقة الرفع على GitHub

1. فك ضغط الملف `ELECTRIC_SYSTEM_GUIDE_V3_GITHUB_DOCS.zip`.
2. افتح مستودع `ali-dhya96/electric_reparing` ثم مجلد `docs`.
3. ارفع **محتويات الحزمة** إلى داخل `docs` واستبدل الملفات التي تحمل الاسم نفسه.
4. حافظ على ملف `config.json` المنشور لديك إن كان يحتوي رقم WhatsApp والروابط الاجتماعية؛ لا تستبدله بالملف المرفق إذا كنت قد عدّلته مسبقاً. ملفات الدليل لا تحتاج تعديل هذا الملف.
5. في GitHub: Settings → Pages → Deploy from a branch → main → /docs.
6. بعد نجاح النشر افتح `https://ali-dhya96.github.io/electric_reparing/guide.html` ثم جرّب الروابط.

## الصفحات الجديدة

- `guide.html`: فهرس 14 فصلاً مع مربع بحث.
- `guides/overview.html`: فكرة النظام.
- `guides/dashboard.html`: Windows.
- `guides/incidents.html`: إضافة حادث، بطاقة الحادث، التكليف، الاستلام، النتيجة.
- `guides/field.html`: تطبيق Android، استلام الحوادث، الإنجاز، التعذر، النداءات.
- `guides/stations.html`: المحطات والمغذيات والمحولات وGPS وExcel.
- `guides/groups.html`: المجموعات والمخولون والحضور.
- `guides/roles.html`: المساح والمشاهد ومراقب الشكاوى.
- `guides/operations.html`: غرفة العمليات والخرائط.
- `guides/reports.html`: الأرشيف والتقارير وPDF.
- `guides/devices.html`: الحاسبات الإضافية والصلاحيات.
- `guides/updates.html`: التحديث والتثبيت.
- `guides/notifications.html`: الإشعارات والنداءات والحضور.
- `guides/troubleshooting.html`: الأخطاء الشائعة.
- `guides/safety.html`: السلامة المهنية وحماية البيانات.

كل صفحة بها رابط عائم «الرئيسية» أسفل اليسار وزر الصعود لأعلى الصفحة أسفل اليمين.

## الصور الحقيقية والنماذج التوضيحية

- يحتوي الدليل على **صورة حقيقية واحدة مقتطعة من Windows** من صورة سبق أن أرسلتها، وأخفيت فيها تفاصيل حساب ظاهرة. مصدرها `assets/guide/dashboard-real.jpg`.
- بقية المعاينات مصممة داخل HTML بشكل تعليمي ومتروسة داخلها عبارة «تمثيل توضيحي». **ليست لقطات حقيقية**؛ لأنها لم تتوفر في الملفات المرسلة.
- حتى تطابق الصور الواجهة الفعلية، التقط من نسختك على Windows وAndroid صوراً بلا بيانات حساسة. يحاول الدليل تحميل الصور التالية تلقائياً، وإذا لم يجدها يعرض الرسم التوضيحي دون أن يظهر مربع صورة مكسور:

| اسم الصورة المطلوب | مكان الالتقاط |
|---|---|
| `incident-create-windows.png` | Windows → كتابة حادث جديد (قبل الإرسال) |
| `incident-card-windows.png` | Windows → بطاقة حادث اختبارية |
| `incident-accept-android.png` | Android → بطاقة حادث واستلام |
| `incident-result-android.png` | Android → تقرير إنجاز / تعذر |
| `field-accept-android.png` | Android → تأكيد استلام |
| `field-completion-android.png` | Android → تقرير الإنجاز الإجباري |
| `station-tree-windows.png` | Windows → المحطة والمغذي والمحولة |
| `operations-map-windows.png` | Windows → غرفة عمليات مع GPS غير حساس |
| `device-permissions-windows.png` | Windows → إعدادات صلاحيات الحاسبات دون حسابات حقيقية |
| `reports-windows.png` | Windows → تقرير تجريبي دون أسماء/هواتف حقيقية |
| `presence-windows.png` | Windows → حالات مخولين تجريبيين |
| `roles-android.png` | Android → الواجهة الخاصة بالمشاهد أو المساح |
| `dashboard-windows.png` | Windows → لوحة العمليات العامة |
| `update-windows.png` | Windows → نافذة تحديث دون أسرار |
| `diagnostic-windows.png` | Windows → شاشة تشخيص عامة |
| `safety-android.png` | Android → تعليمات السلامة إن وجدت في النسخة |

ضع الصور داخل `docs/assets/guide/` بالاسم المطابق. عند توفرها يستبدل الموقع التمثيل البصري تلقائياً بالصورة الأصلية.

**لا ترفع** كلمات مرور، بطاقات تفعيل، أرقام هواتف المبلغين، بيانات أشخاص، أكواد تراخيص، أو رموز Supabase، ولا تستخدم بيانات حادث حقيقية في موقع عام. الأفضل التقاط أمثلة من حساب اختباري وإخفاء الأسماء الحساسة.

## حدود هذا الإصدار

الدليل مبني على الملفات التي تمت مراجعتها في محادثة مشروع ELECTRIC SYSTEM، وليس على تجربة تشغيل حية للأجهزة. قد يختلف ترتيب الأزرار أو تتعطل بعض الوظائف في نسخ لم تُحدّث بعد، خصوصاً حضور المخولين وGPS. ميزات GPS المقترحة للموافقة والتاريخ مذكورة بصيغة تطويرية وليست مزايا مثبتة في كل إصدار.

لم يتغير `electric-center-admin` أو بيانات Supabase أو كود التفعيل بسبب هذه الحزمة. المحتوى HTML/CSS/JS فقط ويعمل على GitHub Pages.
