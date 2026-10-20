(()=>{const forms=[...document.querySelectorAll(".sheet-task")],scores=new Map(),steps=[...document.querySelectorAll(".sheet-steps a")],MAX=20;
function progress(){let score=0;for(const v of scores.values())score+=v;document.getElementById("progress-label").textContent=scores.size+" / 8";document.getElementById("progress-fill").style.width=(scores.size/8*100)+"%";document.getElementById("sheet-progress-track").setAttribute("aria-valuenow",String(scores.size));steps.forEach(a=>a.classList.toggle("is-complete",scores.has(a.hash.slice(1))));document.getElementById("sheet-result").textContent=scores.size===0?"Виконай і перевір усі вісім етапів — тут з'явиться загальний результат.":scores.size<8?"Перевірено "+scores.size+" із 8 етапів. Поточний результат: "+score+" із "+MAX+". Продовжуй роботу!":"Усі етапи перевірено. Правильних відповідей: "+score+" із "+MAX+"."}
function clearScore(f){scores.delete(f.dataset.task);f.querySelector(".task-feedback").textContent="";progress()}
function radios(f,names,keys){let n=0;for(let i=0;i<names.length;i++){const x=f.querySelector('input[name="'+names[i]+'"]:checked');if(!x)return null;if(x.value===keys[i])n++;}return n}
function selects(f,keys){const a=[...f.querySelectorAll("select")];if(a.some(x=>!x.value))return null;return a.filter((x,i)=>x.value===keys[i]).length}
forms.forEach(f=>{f.addEventListener("change",()=>clearScore(f));f.addEventListener("submit",e=>{e.preventDefault();const id=f.dataset.task,fb=f.querySelector(".task-feedback");let n=null,max=0;
if(id==="software"){n=radios(f,["soft1","soft2"],["b","c"]);max=2}
if(id==="requirements"){n=selects(f,["ok-os","ok-ram","ok-space"]);max=3}
if(id==="compatibility"){n=radios(f,["comp1","comp2"],["d","a"]);max=2}
if(id==="licenses"){n=selects(f,["freeware","trial","commercial"]);max=3}
if(id==="drivers"){n=radios(f,["drv1","drv2"],["c","b"]);max=2}
if(id==="install"){n=radios(f,["safe1","safe2"],["d","a"]);max=2}
if(id==="accessibility"){n=selects(f,["zoom","voice","captions"]);max=3}
if(id==="final"){n=radios(f,["final1","final2","final3"],["a","c","b"]);max=3}
if(n===null){fb.textContent="Спочатку дай відповідь на всі завдання цього етапу.";return}
scores.set(id,n);fb.textContent=n===max?"Усі відповіді цього етапу правильні!":"Правильно: "+n+" із "+max+". Переглянь відповіді та спробуй ще раз.";progress()})});
document.getElementById("restart-all").addEventListener("click",()=>{forms.forEach(f=>{f.reset();f.querySelector(".task-feedback").textContent=""});scores.clear();progress();document.getElementById("software").scrollIntoView({behavior:"instant",block:"start"})});
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){const index=steps.findIndex(a=>a.hash==="#"+entry.target.id);if(index>=0)steps.forEach((a,i)=>a.classList.toggle("is-current",i===index))}}},{rootMargin:"-15% 0px -65% 0px"});document.querySelectorAll(".sheet-section").forEach(section=>observer.observe(section));progress()})();