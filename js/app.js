"use strict";
// На першому етапі каталог не містить персональних даних.
const classes = [5, 6, 7, 8, 9];
const grid = document.querySelector("#class-grid");
for (const grade of classes) {
  const card = document.createElement("article");
  card.className = "class-card";
  const number = document.createElement("span");
  number.className = "number";
  number.textContent = "ІНФОРМАТИКА";
  const title = document.createElement("h3");
  title.textContent = grade + " клас";
  const description = document.createElement("p");
  description.textContent = "Інтерактивні навчальні матеріали";
  const status = document.createElement("div");
  status.className = "coming";
  status.textContent = grade === 9 ? "Урок №18 уже доступний" : "Наповнюємо незабаром";
  if (grade === 9) {
    const link = document.createElement("a");
    link.href = "pilot-lesson18.html";
    link.className = "primary";
    link.textContent = "Відкрити урок №18 →";
    card.append(number, title, description, status, link);
  } else { card.append(number, title, description, status); }
  grid.append(card);
}