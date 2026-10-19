// HUB 56 reusable fill-in-the-blanks trainer. Local feedback only.
export function renderFillBlanks(section,container){
 const items=section.items;
 if(!Array.isArray(items)||items.length===0||items.some(item=>typeof item.prompt!=="string"||!item.prompt.trim()||!Array.isArray(item.answers)||!item.answers.length||item.answers.some(a=>typeof a!=="string"||!a.trim()))){
  const error=document.createElement("p");error.textContent="Вправу налаштовано некоректно.";container.append(error);return;
 }
 const intro=document.createElement("p");intro.textContent="Введіть пропущені слова або команди й перевірте відповіді.";container.append(intro);
 const form=document.createElement("form");form.className="fill-blanks-form";
 const controls=[];const result=document.createElement("p");result.className="lesson-template-feedback";result.setAttribute("role","status");
 items.forEach((item,index)=>{
  const box=document.createElement("div");box.className="fill-blanks-item";
  const label=document.createElement("label");const id="blank-"+section.id+"-"+index;label.htmlFor=id;label.textContent=(index+1)+". "+item.prompt;
  const input=document.createElement("input");input.id=id;input.type="text";input.autocomplete="off";input.spellcheck=false;input.className="fill-blanks-input";
  const clue=document.createElement("p");clue.className="fill-blanks-clue";clue.id=id+"-clue";clue.textContent=item.clue||"Запишіть назву команди та перевірте її синтаксис.";
  input.setAttribute("aria-describedby",clue.id);
  const feedback=document.createElement("p");feedback.className="fill-blanks-feedback";feedback.setAttribute("aria-live","polite");
  input.addEventListener("input",()=>{feedback.textContent="";result.textContent=""});
  box.append(label,clue,input,feedback);form.append(box);controls.push({item,input,feedback});
 });
 const actions=document.createElement("div");actions.className="matching-actions";
 const check=document.createElement("button");check.type="submit";check.className="lesson-template-button";check.textContent="Перевірити пропуски";
 const reset=document.createElement("button");reset.type="button";reset.className="matching-reset";reset.textContent="Почати заново";
 actions.append(check,reset);form.append(actions,result);container.append(form);
 const normalize=value=>value.trim().replace(/\s+/g,"").toLowerCase();
 form.addEventListener("submit",event=>{
  event.preventDefault();let correct=0,answered=0;
  for(const {item,input,feedback} of controls){
   const answer=input.value.trim();
   if(!answer){feedback.textContent="Уведіть відповідь.";continue}
   answered++;
   if(item.answers.some(expected=>normalize(answer)===normalize(expected))){correct++;feedback.textContent="Правильно. "+(item.explanation||"")}
   else feedback.textContent="Спробуйте ще раз. "+(item.hint||"Перевірте правильність команди.");
  }
  result.textContent="Результат: "+correct+" із "+items.length+". Відповідей надано: "+answered+" із "+items.length+".";
 });
 reset.addEventListener("click",()=>{form.reset();for(const item of controls)item.feedback.textContent="";result.textContent="";controls[0].input.focus()});
}
