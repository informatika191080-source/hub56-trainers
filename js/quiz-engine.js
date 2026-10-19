// Self-check quiz. Does not save or transmit student answers.
export function renderQuiz(section, container) {
  const form=document.createElement("form");
  const emit=(score,answered)=>container.dispatchEvent(new CustomEvent("hub56:activity",{bubbles:true,detail:{score,answered,total:section.questions.length}}));
  const details=[];
  section.questions.forEach((question,i)=>{
    const fieldset=document.createElement("fieldset");fieldset.className="lesson-template-fieldset";
    const legend=document.createElement("legend");legend.textContent=question.text;fieldset.append(legend);
    const title=document.createElement("div");title.className="lesson-template-question";title.textContent=(i+1)+". "+question.text;title.setAttribute("aria-hidden","true");fieldset.append(title);
    question.options.forEach((option,j)=>{
      const label=document.createElement("label");label.className="lesson-template-option";
      const radio=document.createElement("input");radio.type="radio";radio.name="q"+i;radio.value=String(j);
      label.append(radio,document.createTextNode(" "+option));fieldset.append(label);
    });
    const feedback=document.createElement("p");feedback.className="lesson-template-feedback";feedback.setAttribute("aria-live","polite");fieldset.append(feedback);details.push(feedback);
    fieldset.addEventListener("change",()=>{feedback.textContent="";result.textContent="";emit(null,null);});
    form.append(fieldset);
  });
  const check=document.createElement("button");check.type="submit";check.className="lesson-template-button";check.textContent="Перевірити тест";form.append(check);
  const result=document.createElement("p");result.className="lesson-template-feedback";result.setAttribute("role","status");form.append(result);
  form.addEventListener("submit",event=>{
    event.preventDefault();let score=0;let answered=0;
    section.questions.forEach((q,i)=>{
      const selected=form.querySelector('input[name="q'+i+'"]:checked');
      if(!selected){details[i].textContent="Оберіть відповідь.";return}
      answered++;
      if(Number(selected.value)===q.correct){score++;details[i].textContent="Правильно. "+q.explanation}
      else details[i].textContent="Спробуйте ще раз. "+q.explanation;
    });
    result.textContent="Результат: "+score+" із "+section.questions.length+". Відповідей надано: "+answered+".";emit(score,answered);
  });
  container.append(form);
}
