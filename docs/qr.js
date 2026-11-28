'use strict';
(function(){
  const canvas=document.getElementById('qr-canvas');
  const ctx=canvas.getContext('2d');
  const urlNode=document.getElementById('qr-url');
  const note=document.getElementById('qr-note');
  const save=document.getElementById('save-qr');
  const copy=document.getElementById('copy-url');
  const isHosted=/^https?:$/.test(location.protocol);
  const target=isHosted?new URL('index.html',location.href).href:'';
  urlNode.textContent=target||'لم يُنشر الموقع بعد';
  if(!target){note.textContent='يُنشأ باركود صحيح بمجرد فتح qr.html من رابط الموقع المنشور.';save.disabled=true;copy.disabled=true;return;}
  try{
    const qr=new ElectricQRCode(-1,1);qr.addData(target);qr.make();
    const n=qr.getModuleCount();const margin=4;const side=500;canvas.width=side;canvas.height=side;
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,side,side);
    const scale=side/(n+margin*2);
    ctx.fillStyle='#061426';
    for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr.isDark(y,x)){
      const x0=Math.round((x+margin)*scale),x1=Math.round((x+margin+1)*scale);
      const y0=Math.round((y+margin)*scale),y1=Math.round((y+margin+1)*scale);
      ctx.fillRect(x0,y0,x1-x0,y1-y0);
    }
    save.addEventListener('click',()=>{const a=document.createElement('a');a.download='ELECTRIC_SYSTEM_QR.png';a.href=canvas.toDataURL('image/png');a.click();});
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(target);note.textContent='تم نسخ الرابط.';}catch{note.textContent='تعذر النسخ تلقائياً، انسخ الرابط المعروض.';}});
    note.textContent='هذا الباركود يفتح عنوان صفحة التحميل الحالي، وليس رابط ملف APK.';
  }catch(e){note.textContent='تعذر توليد الباركود: '+e.message;save.disabled=true;}
})();
