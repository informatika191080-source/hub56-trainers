import {renderQuiz} from "./quiz-engine.js";
import {renderMatching} from "./trainers/matching.js";
const app=document.getElementById("lesson-prototype");
if(app){
  const {lesson}=await import("../data/lessons/demo-9-00.js");
  const title=document.getElementById("lesson-prototype-title");title.textContent=lesson.title;
  document.getElementById("lesson-prototype-summary").textContent=lesson.summary;
  const menu=document.getElementById("lesson-prototype-menu");
  const panels=document.getElementById("lesson-prototype-panels");
  for(const section of lesson.sections){
    const a=document.createElement("a");a.className="lesson-template-link";a.href="#module-"+section.id;
    const name=document.createElement("strong");name.textContent=section.label;const desc=document.createElement("span");desc.textContent=section.description;a.append(name,desc);menu.append(a);
    const card=document.createElement("section");card.className="lesson-template-card";card.id="module-"+section.id;
    const heading=document.createElement("h2");heading.textContent=section.heading;card.append(heading);
    if(section.type==="content"){for(const t of section.paragraphs){const p=document.createElement("p");p.textContent=t;card.append(p)}}
    else if(section.type==="quiz"){renderQuiz(section,card)}
    else if(section.type==="matching"){renderMatching(section,card)}
    else if(section.type==="notice"){const p=document.createElement("p");p.className="lesson-template-note";p.textContent=section.message;card.append(p)}
    panels.append(card);
  }
}
