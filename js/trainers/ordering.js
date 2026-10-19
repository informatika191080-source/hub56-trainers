// Reusable ordered-steps activity. No network requests or student records.
export function renderOrdering(section, container){
  const steps=section.steps;
  const emit=(score,answered)=>container.dispatchEvent(new CustomEvent("hub56:activity",{bubbles:true,detail:{score,answered,total:1}}));
  if(!Array.isArray(steps)||steps.length<2||steps.some(x=>typeof x!=="string"||!x.trim())){
    const p=document.createElement("p");p.textContent="Вправу налаштовано некоректно.";container.append(p);return;
  }
  const intro=document.createElement("p");intro.textContent="Розташуйте дії в правильній послідовності за допомогою кнопок «Вгору» і «Вниз».";container.append(intro);
  const initial=Array.isArray(section.initialOrder)&&section.initialOrder.length===steps.length&&new Set(section.initialOrder).size===steps.length&&section.initialOrder.every(i=>Number.isInteger(i)&&i>=0&&i<steps.length)
    ? [...section.initialOrder] : [...steps.keys()].reverse();
  let order=[...initial];
  const list=document.createElement("ol");list.className="ordering-list";container.append(list);
  const actions=document.createElement("div");actions.className="matching-actions";
  const check=document.createElement("button");check.type="button";check.className="lesson-template-button";check.textContent="Перевірити порядок";
  const reset=document.createElement("button");reset.type="button";reset.className="matching-reset";reset.textContent="Почати заново";
  const result=document.createElement("p");result.className="lesson-template-feedback";result.setAttribute("role","status");
  actions.append(check,reset);container.append(actions,result);
  function redraw(focusIndex=null,focusDirection=null){
    list.replaceChildren();
    order.forEach((stepIndex,index)=>{
      const li=document.createElement("li");li.className="ordering-item";
      const text=document.createElement("span");text.className="ordering-step";text.textContent=steps[stepIndex];
      const controls=document.createElement("div");controls.className="ordering-controls";
      for(const [direction,label,delta] of [["up","Вгору",-1],["down","Вниз",1]]){
        const button=document.createElement("button");button.type="button";button.className="matching-reset";button.textContent=label;
        button.setAttribute("aria-label",label+": "+steps[stepIndex]);button.disabled=index+delta<0||index+delta>=order.length;
        button.dataset.direction=direction;
        button.addEventListener("click",()=>{
          const next=index+delta;
          [order[index],order[next]]=[order[next],order[index]];
          result.textContent="";emit(null,null);
          redraw(next,direction);
        });
        controls.append(button);
      }
      li.append(text,controls);list.append(li);
      if(index===focusIndex&&focusDirection){
        const b=controls.querySelector('[data-direction="'+focusDirection+'"]');
        if(b&&!b.disabled)b.focus();
        else controls.querySelector("button:not(:disabled)")?.focus();
      }
    });
  }
  check.addEventListener("click",()=>{
    const correct=order.every((value,index)=>value===index);
    result.textContent=correct?"Правильно! Послідовність установлено.":"Порядок поки неправильний. Спробуйте ще раз.";emit(correct?1:0,1);
  });
  reset.addEventListener("click",()=>{order=[...initial];result.textContent="";emit(null,null);redraw();list.querySelector("button:not(:disabled)")?.focus()});
  redraw();
}
