(()=>{
function ready(fn){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn):fn()}
ready(()=>{
 const content=document.querySelector(".practice-content");
 const layout=document.querySelector(".practice-layout");
 if(!content||!layout)return;
 const fields=[...content.querySelectorAll("[data-save-key]")];
 if(!fields.length)return;

 const lesson=(document.body.dataset.lesson||"").trim();
 const grade=(document.body.dataset.grade||"").trim();
 const title=(document.querySelector(".lesson-hero h1")?.textContent||"Практична робота").trim();

 const card=document.createElement("section");
 card.className="lesson-card practice-export-card";
 card.innerHTML=`
   <p class="eyebrow">ЗАВЕРШЕННЯ РОБОТИ</p>
   <h2>Експорт виконаної роботи в PDF</h2>
   <p>Перед експортом укажіть своє ім’я та клас. PDF можна сформувати навіть тоді, коли частина відповідей залишилася незаповненою.</p>
   <div class="practice-export-meta">
     <label>Прізвище та ім’я
       <input type="text" id="practice-export-name" autocomplete="name" placeholder="Наприклад: Іваненко Марія">
     </label>
     <label>Клас
       <input type="text" id="practice-export-class" value="${grade?grade+" клас":""}" placeholder="Наприклад: 9-А">
     </label>
   </div>
   <div class="practice-export-status" id="practice-export-status" role="status" aria-live="polite"></div>
   <div class="lesson-actions">
     <button type="button" id="practice-export-pdf">Експортувати виконану роботу в PDF</button>
   </div>
   <p class="lesson-tiny">У системному вікні друку оберіть «Зберегти як PDF». До PDF потраплять умови завдань, введені відповіді та позначки «Не заповнено» для порожніх полів.</p>`;
 layout.insertAdjacentElement("afterend",card);

 const style=document.createElement("style");
 style.textContent=`
 .practice-export-card{border:2px solid #b9d9f3!important;background:linear-gradient(135deg,#f6fbff,#eef6ff)!important}
 .practice-export-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:18px 0}
 .practice-export-meta label{margin:0}
 .practice-export-meta input{max-width:none!important;width:100%!important;box-sizing:border-box}
 .practice-export-status{margin:12px 0;padding:11px 14px;border-radius:10px;background:#eef6ff;color:#345774;font-weight:700}
 .practice-export-status.is-complete{background:#e8f8ee;color:#22683e}
 .practice-export-status.is-warning{background:#fff5db;color:#7a5a12}
 @media(max-width:650px){.practice-export-meta{grid-template-columns:1fr}}
 `;
 document.head.appendChild(style);

 const name=document.getElementById("practice-export-name");
 const cls=document.getElementById("practice-export-class");
 const status=document.getElementById("practice-export-status");
 const btn=document.getElementById("practice-export-pdf");
 const metaNameKey="hub56:practice-export:name";
 const metaClassKey="hub56:practice-export:class";
 name.value=localStorage.getItem(metaNameKey)||"";
 cls.value=localStorage.getItem(metaClassKey)||cls.value;
 name.addEventListener("input",()=>localStorage.setItem(metaNameKey,name.value));
 cls.addEventListener("input",()=>localStorage.setItem(metaClassKey,cls.value));

 const valueOf=f=>{
   if(f.matches("select"))return f.value.trim();
   if(f.matches('input[type="checkbox"],input[type="radio"]'))return f.checked?f.value.trim():"";
   return (f.value??f.textContent??"").trim();
 };
 function update(){
   const done=fields.filter(f=>valueOf(f)!=="").length;
   status.textContent="Заповнено полів: "+done+" із "+fields.length+".";
   status.classList.toggle("is-complete",done===fields.length);
   status.classList.toggle("is-warning",done!==fields.length);
 }
 fields.forEach(f=>{f.addEventListener("input",update);f.addEventListener("change",update)});
 update();

 function esc(s){return String(s).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]))}
 function exportHtml(){
   const clone=content.cloneNode(true);
   clone.querySelectorAll("button,.practice-save-note,.lesson-actions,.back-top").forEach(el=>el.remove());
   clone.querySelectorAll("textarea,input,select").forEach(el=>{
     let val="";
     if(el.matches("select")){
       val=el.options[el.selectedIndex]?.text||"";
       if(!el.value)val="";
     }else if(el.matches('input[type="radio"],input[type="checkbox"]')){
       val=el.checked?(el.closest("label")?.textContent||el.value):"";
     }else val=el.value||"";
     const box=document.createElement(el.closest("td")?"div":"p");
     box.className="pdf-answer";
     box.textContent=val||"Не заповнено";
     el.replaceWith(box);
   });
   clone.querySelectorAll("label").forEach(l=>{
     if(!l.querySelector("input,select,textarea")&&l.textContent.trim()==="")l.remove();
   });
   return clone.innerHTML;
 }

 btn.addEventListener("click",()=>{
   update();
   const missing=fields.filter(f=>valueOf(f)==="").length;
   if(!name.value.trim()||!cls.value.trim()){
     status.textContent="Перед експортом заповніть прізвище та ім’я, а також клас.";
     status.className="practice-export-status is-warning";
     (!name.value.trim()?name:cls).focus();
     return;
   }
   status.textContent=missing
     ?"PDF буде сформовано. Незаповнених полів: "+missing+". У документі вони будуть позначені як «Не заповнено»."
     :"Усі поля заповнено. PDF готовий до формування.";
   status.className="practice-export-status "+(missing?"is-warning":"is-complete");
   const w=window.open("","_blank");
   if(!w){
     status.textContent="Браузер заблокував вікно експорту. Дозвольте спливаючі вікна для HUB 56 і повторіть.";
     status.className="practice-export-status is-warning";
     return;
   }
   const safeName=name.value.trim().replace(/[\\/:*?"<>|]+/g,"_");
   const docTitle=`HUB56_${safeName}_урок_${lesson||""}`;
   w.document.open();
   w.document.write(`<!doctype html><html lang="uk"><head><meta charset="utf-8"><title>${esc(docTitle)}</title>
   <style>
   @page{size:A4;margin:14mm}
   *{box-sizing:border-box}body{font-family:Arial,"Segoe UI",sans-serif;color:#172b50;background:#fff;font-size:11pt;line-height:1.45;margin:0}
   h1{font-size:20pt;margin:0 0 6px}h2{font-size:15pt;margin:18px 0 9px;border-bottom:1px solid #ccd8e6;padding-bottom:5px}h3{font-size:12.5pt}
   .meta{border:1px solid #cbd8e8;border-radius:10px;padding:12px 14px;margin:14px 0 20px;background:#f7fbff}
   .meta p{margin:4px 0}.eyebrow,.practice-aside,.practice-side-nav{display:none!important}
   .lesson-card{page-break-inside:auto;margin:0 0 16px;padding:0}.module-task{page-break-before:auto}
   .practice-box,.code-step,.task-line{border:1px solid #d2dce8;border-radius:8px;padding:10px;margin:9px 0;background:#fbfdff;page-break-inside:avoid}
   ul,ol{padding-left:24px}li{margin:5px 0}.pdf-answer{border:1px solid #93abc5;border-radius:6px;padding:7px 9px;margin:6px 0;background:#fff;font-weight:600;white-space:pre-wrap;min-height:30px}
   table{width:100%;border-collapse:collapse;font-size:9pt;margin:10px 0}th,td{border:1px solid #9fb0c2;padding:5px;vertical-align:top}th{background:#eef4fa}.pdf-answer{overflow-wrap:anywhere}
   a{color:inherit;text-decoration:none}
   </style></head><body>
   <h1>${esc(title)}</h1>
   <div class="meta"><p><strong>Учень/учениця:</strong> ${esc(name.value.trim())}</p><p><strong>Клас:</strong> ${esc(cls.value.trim())}</p><p><strong>HUB 56 · Інформатика · Урок №${esc(lesson)}</strong></p></div>
   ${exportHtml()}
   <script>window.addEventListener("load",()=>setTimeout(()=>window.print(),250));<\/script>
   </body></html>`);
   w.document.close();
 });
});
})();