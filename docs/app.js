'use strict';
const $ = (id) => document.getElementById(id);
let appConfig = { releaseApiUrl: '', supportWhatsapp: '', refreshMinutes: 10 };
let checkTimer;

function text(id, value) { const el=$(id); if (el) el.textContent=value; }
function safePublicUrl(value) {
  if (typeof value !== 'string') return null;
  try { const url=new URL(value); return url.protocol==='https:' ? url.href : null; }
  catch { return null; }
}
// Supports wa.me links, +964... and local Iraqi numbers starting with 07.
function whatsappNumber(input) {
  let raw=String(input||'').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) {
    try {
      const u=new URL(raw);
      const host=u.hostname.toLowerCase();
      if (host==='wa.me' || host==='www.wa.me') raw=u.pathname.split('/').filter(Boolean)[0]||'';
      else if (host==='api.whatsapp.com' || host==='www.api.whatsapp.com') raw=u.searchParams.get('phone')||'';
      else return '';
    } catch { return ''; }
  }
  const digits=raw.replace(/\D/g,'');
  if (/^07\d{9}$/.test(digits)) return '964'+digits.slice(1);
  if (/^7\d{9}$/.test(digits)) return '964'+digits;
  return /^\d{10,15}$/.test(digits) ? digits : '';
}
function setButton(platform, release) {
  const button = $(`${platform}-download`);
  const version = $(`${platform}-version`);
  const details = $(`${platform}-details`);
  const note = $(`${platform}-note`);
  const url = safePublicUrl(release?.download_url);
  if (!release || !url || !release.version_name) {
    version.textContent=platform==='ios'?'لم يُنشر بعد':'لا يوجد إصدار منشور';
    details.textContent=platform==='ios'?'iOS قيد الإتاحة؛ لا يوجد رابط رسمي حالياً':'راجع حالة نشر الإصدار في Supabase';
    button.textContent=platform==='ios'?'قريباً على iPhone':'التحميل غير متاح حالياً';
    button.classList.add('disabled'); button.setAttribute('aria-disabled','true');
    button.setAttribute('tabindex','-1'); button.removeAttribute('target');
    button.setAttribute('href','#التحميل');
    note.textContent=platform==='ios'?'سيُفعّل الزر تلقائياً فور نشر إصدار iOS رسمي.':'تُعرض النسخ المنشورة والمربوطة بملف تحميل فقط.';
    return;
  }
  version.textContent=`الإصدار ${release.version_name}`;
  details.textContent=`البناء ${release.build_number||'—'}${release.file_size_bytes?` · ${formatSize(release.file_size_bytes)}`:''}`;
  button.innerHTML=platform==='ios'?'فتح النسخة الرسمية <span>↗</span>':'تحميل أحدث إصدار <span>↓</span>';
  button.classList.remove('disabled'); button.removeAttribute('aria-disabled');
  button.removeAttribute('tabindex'); button.href=url;
  button.target='_blank'; button.rel='noopener noreferrer';
  note.textContent=release.release_notes?.trim() || 'رابط الإصدار المنشور المعتمد حالياً.';
}
function formatSize(bytes) {
  const x=Number(bytes); if (!Number.isFinite(x)||x<=0) return '—';
  return x>=1048576?`${(x/1048576).toFixed(1)} MB`:`${(x/1024).toFixed(0)} KB`;
}
function status(message, state='loading') {
  text('release-status',message);
  const light=$('release-light'); light.className=`release-light ${state}`;
}
async function refreshReleases() {
  if (!appConfig.releaseApiUrl) {
    setButton('android',null); setButton('ios',null); setButton('windows',null);
    status('لم يُضبط عنوان خدمة الإصدارات بعد. أكمل إعداد config.json.','warn'); return;
  }
  status('جارٍ جلب أحدث نسخة منشورة من Supabase...','loading');
  const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),12000);
  try {
    const url=safePublicUrl(appConfig.releaseApiUrl);
    if (!url) throw Error('عنوان الخدمة غير صالح');
    const response=await fetch(`${url}${url.includes('?')?'&':'?'}_=${Date.now()}`,{
      cache:'no-store',signal:controller.signal,headers:{'Accept':'application/json'}
    });
    if (!response.ok) throw Error(`رمز الاستجابة HTTP ${response.status}`);
    const payload=await response.json();
    if (!payload || payload.ok!==true || !payload.releases || typeof payload.releases!=='object') {
      throw Error('بيانات الإصدارات غير صالحة');
    }
    setButton('android',payload.releases.android); setButton('ios',payload.releases.ios); setButton('windows',payload.releases.windows);
    status(`تم التحقق من آخر إصدار منشور · ${new Date().toLocaleTimeString('ar-IQ',{hour:'2-digit',minute:'2-digit'})}`,'ok');
  } catch (error) {
    // Fail closed: never keep a stale or unverified download URL clickable.
    setButton('android',null);setButton('ios',null);setButton('windows',null);
    text('android-version','تعذر التحقق'); text('ios-version','تعذر التحقق'); text('windows-version','تعذر التحقق');
    status(`تعذر التحقق من الإصدارات (${error.name==='AbortError'?'انتهت مهلة الاتصال':error.message}). أعد المحاولة.`, 'warn');
  } finally { clearTimeout(timeout); }
}
const requestDialog=$('request-dialog');
function openRequest(type) {
  $('request-type').value=type; text('request-title',type);text('request-feedback','');
  if (typeof requestDialog.showModal === 'function') requestDialog.showModal();
  else requestDialog.setAttribute('open','');
}
function composeRequest() {
  const name=$('request-name').value.trim();
  const center=$('request-center').value.trim();
  const phone=$('request-phone').value.trim();
  const details=$('request-details').value.trim();
  if (!name) { text('request-feedback','يرجى كتابة اسم المسؤول أولاً.'); $('request-name').focus(); return null; }
  const type=$('request-type').value;
  return [
    'السلام عليكم، لدي طلب عبر بوابة ELECTRIC SYSTEM:',
    `نوع الطلب: ${type}`,
    `الاسم: ${name}`,
    `المركز / الجهة: ${center || 'غير محدد'}`,
    `رقم التواصل: ${phone || 'غير محدد'}`,
    `التفاصيل: ${details || 'لا توجد تفاصيل إضافية'}`
  ].join('\n');
}
async function copyRequest() {
  const message=composeRequest();if (!message)return;
  try { await navigator.clipboard.writeText(message);text('request-feedback','تم نسخ نص الطلب. يمكنك إرساله إلى جهة الدعم.'); }
  catch { text('request-feedback','لم يسمح المتصفح بالنسخ. استخدم واتساب بعد ضبط رقم الدعم.'); }
}
function sendRequest() {
  const message=composeRequest();if (!message)return;
  const phone=whatsappNumber(appConfig.supportWhatsapp);
  if (!/^\d{10,15}$/.test(phone)) {
    text('request-feedback','رقم واتساب الدعم لم يُضف بعد. استخدم «نسخ نص الطلب» أو حدّث config.json برقم الدعم الرسمي.');
    return;
  }
  const url=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank','noopener,noreferrer');
  text('request-feedback','تم فتح واتساب. راجع الطلب ثم اضغط إرسال بنفسك.');
}
function showSocials() {
  const whatsapp=whatsappNumber(appConfig.supportWhatsapp);
  const waLink=$('whatsapp-link');
  const waHero=$('whatsapp-hero');
  const waUrl=whatsapp ? 'https://wa.me/'+whatsapp : '';
  for (const el of [waLink,waHero]) {
    if (!el) continue;
    el.hidden=!waUrl;
    if (waUrl) {
      el.href=waUrl;
      el.rel='noopener noreferrer';
      el.target='_blank';
    }
  }
  const entries = [
    ['instagram','instagram-link'], ['facebook','facebook-link'],
    ['telegram','telegram-link'], ['youtube','youtube-link'],
  ];
  let hasAny = Boolean(whatsapp);
  for (const [field,id] of entries) {
    const a=$(id);
    const url=safePublicUrl(appConfig[field]);
    if (a && url) {a.href=url; a.hidden=false; a.rel='noopener noreferrer'; a.target='_blank'; hasAny=true;}
    else if(a) a.hidden=true;
  }
  if ($('socials-section')) $('socials-section').hidden=!hasAny;
}
async function init() {
  text('footer-year',new Date().getFullYear());
  try { const res=await fetch('config.json',{cache:'no-store'});if(res.ok)appConfig={...appConfig,...await res.json()}; }
  catch { /* Site can still render without configuration. */ }
  showSocials();
  $('refresh-versions').addEventListener('click',refreshReleases);
  document.querySelectorAll('[data-service]').forEach((el)=>el.addEventListener('click',()=>openRequest(el.dataset.service)));
  $('dialog-close').addEventListener('click',()=>requestDialog.close());
  requestDialog.addEventListener('click',e=>{if(e.target===requestDialog)requestDialog.close();});
  $('send-request').addEventListener('click',sendRequest);
  $('copy-request').addEventListener('click',copyRequest);
  $('request-type').addEventListener('change',e=>text('request-title',e.target.value));
  await refreshReleases();
  checkTimer=setInterval(refreshReleases,Math.max(1,Number(appConfig.refreshMinutes)||10)*60000);
  window.addEventListener('focus',()=>{ if(document.visibilityState==='visible')refreshReleases(); });
}
document.addEventListener('DOMContentLoaded',init);
