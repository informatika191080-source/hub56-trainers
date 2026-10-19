// Self-contained demonstration worksheet. No tracking, storage or network transmission.
(()=>{
 const forms=[...document.querySelectorAll(".sheet-task")];
 const scores=new Map(),max={discover:1,connect:3,sequence:1,restore:3};
 const steps=[...document.querySelectorAll(".sheet-steps a")];
 const labels=[
 "Створити порожній список numbers = [].",
 "Повторити введення двічі за допомогою циклу for.",
 "Під час кожного повторення зчитати ціле число через int(input()).",
 "Додати введене число до списку методом append()."
 ];
 const initial=[2,0,3,1];let order=[...initial];
 const seqList=document.getElementById("sequence-list");
 const feedback=form=>form.querySelector(".task-feedback");
 const clean=v=>v.trim().replace(/\s+/g,"").toLowerCase();
 function progress(){
  let score=0;for(const v of scores.values())score+=v;
  document.getElementById("progress-label").textContent=scores.size+" / 4";
  document.getElementById("progress-fill").style.width=(scores.size/4*100)+"%";
  document.getElementById("sheet-progress-track").setAttribute("aria-valuenow",String(scores.size));
  steps.forEach(a=>{const key=a.hash.slice(1);a.classList.toggle("is-complete",scores.has(key))});
  document.getElementById("sheet-result").textContent=scores.size===0?"Виконай і перевір усі чотири етапи — тут з'явиться загальний результат.":scores.size<4?"Перевірено "+scores.size+" із 4 етапів. Поточний результат: "+score+" із 8. Продовжуй роботу!":"Усі етапи перевірено. Правильних відповідей: "+score+" із 8. Можна виправити помилки та перевірити ще раз.";
 }
 function invalidate(form){scores.delete(form.dataset.task);feedback(form).textContent="";progress()}
 function drawSequence(){
  seqList.replaceChildren();
  order.forEach((step,index)=>{
   const li=document.createElement("li"),text=document.createElement("span");text.className="sequence-text";text.textContent=labels[step];
   const controls=document.createElement("div");controls.className="sequence-controls";
   for(const [label,delta,icon] of [["Перемістити вгору",-1,"↑"],["Перемістити вниз",1,"↓"]]){
    const btn=document.createElement("button");btn.type="button";btn.textContent=icon;btn.setAttribute("aria-label",label+": "+labels[step]);btn.disabled=index+delta<0||index+delta>=order.length;
    btn.addEventListener("click",()=>{const next=index+delta;[order[index],order[next]]=[order[next],order[index]];invalidate(document.querySelector('[data-task="sequence"]'));drawSequence();const focused=seqList.children[next]?.querySelectorAll("button")[delta<0?0:1];if(focused&&!focused.disabled)focused.focus();else seqList.children[next]?.querySelector("button:not(:disabled)")?.focus()});controls.append(btn);
   }li.append(text,controls);seqList.append(li);
  });
 }
 drawSequence();
 const discovery=document.querySelector('[data-task="discover"]');
 discovery.addEventListener("change",()=>invalidate(discovery));
 discovery.addEventListener("submit",e=>{e.preventDefault();const selected=discovery.querySelector('input[name="index"]:checked');if(!selected){feedback(discovery).textContent="Спочатку обери відповідь.";return}const correct=selected.value==="99";scores.set("discover",correct?1:0);feedback(discovery).textContent=correct?"Правильно! Після присвоювання numbers[2] = 99 елемент із індексом 2 має значення 99.":"Згадай: присвоювання змінює значення елемента за вказаним індексом.";progress()});
 const connect=document.querySelector('[data-task="connect"]');connect.addEventListener("change",()=>invalidate(connect));
 connect.addEventListener("submit",e=>{e.preventDefault();const selects=[...connect.querySelectorAll("select")];if(selects.some(s=>!s.value)){feedback(connect).textContent="Обери результат для кожного виразу.";return}const expected=["three","six","eight"];const score=selects.filter((s,i)=>s.value===expected[i]).length;scores.set("connect",score);feedback(connect).textContent=score===3?"Чудово! Усі три відповідності правильні.":"Правильно: "+score+" із 3. Обчисли кожен вираз окремо, враховуючи індекси.";progress()});
 const sequence=document.querySelector('[data-task="sequence"]');
 sequence.addEventListener("submit",e=>{e.preventDefault();const correct=order.every((v,i)=>i===v);scores.set("sequence",correct?1:0);feedback(sequence).textContent=correct?"Послідовність правильна! Ти відновив алгоритм.":"Порядок ще неправильний. Спробуй почати зі створення списку.";progress()});
 const restore=document.querySelector('[data-task="restore"]');restore.addEventListener("input",()=>invalidate(restore));
 restore.addEventListener("submit",e=>{e.preventDefault();const inputs=[...restore.querySelectorAll("input")];if(inputs.some(i=>!i.value.trim())){feedback(restore).textContent="Заповни усі три поля.";return}const expected=["12","15","2"];const score=inputs.filter((x,i)=>clean(x.value)===expected[i]).length;scores.set("restore",score);feedback(restore).textContent=score===3?"Усі пропущені значення правильні!":"Правильно: "+score+" із 3. Перевір числа та індекси у фрагментах коду.";progress()});
 document.getElementById("restart-all").addEventListener("click",()=>{forms.forEach(f=>{f.reset();feedback(f).textContent=""});order=[...initial];drawSequence();scores.clear();progress();document.getElementById("discover").scrollIntoView({behavior:"instant",block:"start"})});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){const index=steps.findIndex(a=>a.hash==="#"+entry.target.id);if(index>=0)steps.forEach((a,i)=>a.classList.toggle("is-current",i===index))}}},{rootMargin:"-15% 0px -65% 0px"});
 document.querySelectorAll(".sheet-section").forEach(section=>observer.observe(section));
 progress();
})();