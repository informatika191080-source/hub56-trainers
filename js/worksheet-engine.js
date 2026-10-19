import {worksheet} from "../data/worksheets/python-lists-demo.js";
import {renderQuiz} from "./quiz-engine.js";
import {renderMatching} from "./trainers/matching.js";
import {renderOrdering} from "./trainers/ordering.js";
import {renderFillBlanks} from "./trainers/fill-blanks.js";
const root=document.getElementById("worksheet-stations");
if(root){
 const renderers={quiz:renderQuiz,matching:renderMatching,ordering:renderOrdering,"fill-blanks":renderFillBlanks};
 const states=new Map();
 const total=worksheet.activities.reduce((acc,a)=>acc+(a.type==="quiz"?a.questions.length:a.type==="matching"?a.pairs.length:a.type==="ordering"?1:a.items.length),0);
 const progress=document.getElementById("ws-progress");const counter=document.getElementById("ws-count");const summary=document.getElementById("ws-summary");
 document.getElementById("ws-title").textContent=worksheet.title;
 document.getElementById("ws-subtitle").textContent=worksheet.subtitle;
 document.getElementById("ws-lead").textContent=worksheet.lead;
 const nav=document.getElementById("ws-shortcuts");
 function refresh(){
  let score=0,done=0,answered=0;
  states.forEach(value=>{if(value.score!==null){score+=value.score;answered+=value.answered;done++}});
  const percent=Math.round(done/worksheet.activities.length*100);
  progress.style.width=percent+"%";
  progress.parentElement.setAttribute("aria-valuenow",String(percent));
  counter.textContent=done+" із "+worksheet.activities.length+" станцій перевірено";
  if(done===0)summary.textContent="Виконуйте станції та натискайте кнопку перевірки в кожній із них.";
  else if(done<worksheet.activities.length)summary.textContent="Проміжний результат: "+score+" із "+total+" правильних відповідей. Перевірено станцій: "+done+" із "+worksheet.activities.length+".";
  else summary.textContent="Усі станції перевірено! Результат: "+score+" із "+total+". Заповнених відповідей: "+answered+" із "+total+". Ви можете виправити відповіді й перевірити станції ще раз.";
 }
 worksheet.activities.forEach((activity,i)=>{
  const card=document.createElement("section");card.className="ws-station";card.id="ws-"+activity.id;
  const top=document.createElement("div");top.className="ws-station-head";
  const icon=document.createElement("div");icon.className="ws-station-icon";icon.textContent=activity.icon;icon.setAttribute("aria-hidden","true");
  const text=document.createElement("div");
  const label=document.createElement("p");label.className="ws-station-label";label.textContent=activity.label;
  const title=document.createElement("h2");title.textContent=activity.heading;
  const desc=document.createElement("p");desc.className="ws-station-desc";desc.textContent=activity.description;
  text.append(label,title,desc);top.append(icon,text);card.append(top);
  const content=document.createElement("div");content.className="ws-station-body";
  states.set(activity.id,{score:null,answered:null});
  content.addEventListener("hub56:activity",event=>{
   event.stopPropagation();
   const {score,answered,total:sectionTotal}=event.detail;
   const expected=activity.type==="quiz"?activity.questions.length:activity.type==="matching"?activity.pairs.length:activity.type==="ordering"?1:activity.items.length;
   if(sectionTotal!==expected)return;
   states.set(activity.id,{score,answered});refresh();
  });
  renderers[activity.type](activity,content);card.append(content);root.append(card);
  const shortcut=document.createElement("a");shortcut.href="#"+card.id;shortcut.textContent=(i+1)+" · "+activity.heading;nav.append(shortcut);
 });
 document.getElementById("ws-reset").addEventListener("click",()=>{
  for(const card of root.children){const reset=[...card.querySelectorAll("button")].find(b=>b.textContent==="Почати заново");if(reset)reset.click();
   else {const form=card.querySelector("form");form?.reset();card.querySelectorAll(".lesson-template-feedback").forEach(el=>el.textContent="");}}
  states.forEach((_,id)=>states.set(id,{score:null,answered:null}));refresh();
  document.getElementById("ws-title").focus();
 });
 refresh();
}
