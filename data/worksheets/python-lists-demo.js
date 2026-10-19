// Demonstration worksheet; not a graded curriculum assessment.
export const worksheet={
 title:"Місія: дослідник списків",subtitle:"4 міністанції · Python · 9 клас",
 lead:"Згадай основні операції зі списками. Виконуй міністанції у зручному темпі й отримай підсумок.",
 activities:[
  {id:"quiz",type:"quiz",icon:"🧠",label:"Станція 01",heading:"Обери правильну відповідь",description:"Один вибір — одна маленька перемога",
   questions:[{text:"Який індекс має перший елемент списку a = [4, 8, 12]?",options:["1","0","4"],correct:1,explanation:"У Python індексація елементів списку починається з нуля."}]},
  {id:"matching",type:"matching",icon:"🔗",label:"Станція 02",heading:"З'єднай поняття",description:"Знайди відповідність між командою та її дією",
   pairs:[{id:"len",left:"len(a)",right:"Визначає кількість елементів списку a"},{id:"print",left:"print(a)",right:"Виводить список a на екран"},{id:"append",left:"a.append(5)",right:"Додає число 5 в кінець списку a"}]},
  {id:"order",type:"ordering",icon:"🧩",label:"Станція 03",heading:"Побудуй алгоритм",description:"Розташуй кроки введення двох чисел до списку",
   steps:["Створити порожній список numbers = [].","Повторити введення 2 рази за допомогою циклу for.","На кожному повторенні зчитати ціле число за допомогою int(input()).","Додати введене число до списку методом append()."],initialOrder:[2,0,3,1]},
  {id:"blanks",type:"fill-blanks",icon:"⌨️",label:"Станція 04",heading:"Віднови пропущені команди",description:"Підказки допоможуть згадати синтаксис",
   items:[
    {prompt:"Яка функція визначає кількість елементів списку?",answers:["len()"],clue:"Шаблон: l__().",hint:"Доповніть запис: l__().",explanation:"Функція len() повертає кількість елементів."},
    {prompt:"Який метод додає елемент у кінець списку?",answers:["append()"],clue:"Шаблон: a_____().",hint:"Доповніть запис: a_____().",explanation:"Метод append() додає елемент до списку."},
    {prompt:"Яка функція виводить дані на екран?",answers:["print()"],clue:"Шаблон: p____().",hint:"Доповніть запис: p____().",explanation:"Функція print() виводить дані."}
   ]}
 ]
};