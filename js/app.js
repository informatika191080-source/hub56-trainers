"use strict";
// Каталог класів: уроки відкриваються лише через сторінку відповідного класу.
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
  description.textContent = "Навчальні матеріали та уроки інформатики";
  const status = document.createElement("div");
  status.className = "coming";
  status.textContent = grade === 9 ? "Є доступні уроки" : "Матеріали готуються";
  card.append(number, title, description, status);
  const link = document.createElement("a");
  link.href = "class" + grade + ".html";
  link.className = "primary";
  link.textContent = "Відкрити " + grade + " клас →";
  card.append(link);
  grid.append(card);
}
