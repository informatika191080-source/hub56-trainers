// Reusable match-the-pairs activity for HUB 56. All checks are local.
export function renderMatching(section, container) {
  const pairs=section.pairs;
  if(!Array.isArray(pairs)||pairs.length<2||pairs.some(p=>!p.id||!p.left||!p.right)||new Set(pairs.map(p=>p.id)).size!==pairs.length){
    const error=document.createElement("p");error.textContent="Вправу налаштовано некоректно.";container.append(error);return;
  }
  const instructions=document.createElement("p");instructions.textContent="Для кожного поняття оберіть правильне пояснення.";container.append(instructions);
  const form=document.createElement("form");form.className="matching-form";
  const choices=[...pairs].reverse(); // deliberately different order for a meaningful match
  const controls=[];
  pairs.forEach((pair,index)=>{
    const row=document.createElement("div");row.className="matching-row";
    const label=document.createElement("label");const id="matching-"+section.id+"-"+index;
    label.htmlFor=id;label.className="matching-term";label.textContent=pair.left;
    const select=document.createElement("select");select.id=id;select.className="matching-select";select.required=false;
    const placeholder=document.createElement("option");placeholder.value="";placeholder.textContent="Оберіть відповідність";select.append(placeholder);
    choices.forEach(choice=>{const option=document.createElement("option");option.value=choice.id;option.textContent=choice.right;select.append(option)});
    const feedback=document.createElement("span");feedback.className="matching-feedback";feedback.setAttribute("aria-live","polite");
    select.addEventListener("change",()=>{feedback.textContent="";result.textContent=""});
    row.append(label,select,feedback);form.append(row);controls.push({pair,select,feedback});
  });
  const actions=document.createElement("div");actions.className="matching-actions";
  const check=document.createElement("button");check.type="submit";check.className="lesson-template-button";check.textContent="Перевірити відповідності";
  const reset=document.createElement("button");reset.type="button";reset.className="matching-reset";reset.textContent="Почати заново";
  const result=document.createElement("p");result.className="lesson-template-feedback";result.setAttribute("role","status");
  actions.append(check,reset);form.append(actions,result);container.append(form);
  form.addEventListener("submit",event=>{
    event.preventDefault();
    let correct=0,answered=0;
    controls.forEach(({pair,select,feedback})=>{
      if(!select.value){feedback.textContent="Оберіть варіант.";return}
      answered++;
      if(select.value===pair.id){correct++;feedback.textContent="Правильно."}
      else feedback.textContent="Спробуйте ще раз.";
    });
    result.textContent="Результат: "+correct+" із "+pairs.length+". Відповідей надано: "+answered+" із "+pairs.length+".";
  });
  reset.addEventListener("click",()=>{
    form.reset();controls.forEach(c=>c.feedback.textContent="");result.textContent="";
    controls[0].select.focus();
  });
}
