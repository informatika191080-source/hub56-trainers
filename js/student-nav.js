"use strict";
// A single class-scoped navigation component for HUB 56 student pages.
(function(){
 const root=document.getElementById("student-navigation");
 if(!root)return;
 const grade=Number(document.body.dataset.grade);
 const lesson=Number(document.body.dataset.lesson||0);
 const courseRoot=document.body.dataset.courseRoot||"";
 if(![5,6,7,8,9].includes(grade))return;
 const current=location.pathname.split("/").pop()||"index.html";
 const classPath=courseRoot+"class"+grade+".html";
 const sections=lesson>0?[
  ["Урок №"+lesson,"pilot-lesson"+lesson+".html"],
  ["Теорія","lesson"+lesson+"-theory.html"],
  ["Питання","lesson"+lesson+"-questions.html"],
  ["Практика","lesson"+lesson+"-practice.html"],
  ["Інтерактив","lesson"+lesson+"-interactive.html"],
  ["Домашнє","lesson"+lesson+"-homework.html"]
 ]:[];
 const items=[["Уроки "+grade+" класу",classPath],...sections];
 const header=document.createElement("header");header.className="student-header";
 const bar=document.createElement("div");bar.className="shell student-bar";
 const brand=document.createElement("a");brand.className="student-brand";brand.href=courseRoot+"index.html";brand.setAttribute("aria-label","HUB 56 — повернутися на головну");
 const logo=document.createElement("span");logo.className="brand-mark";logo.textContent="56";logo.setAttribute("aria-hidden","true");
 const brandText=document.createElement("span");brandText.innerHTML='<strong class="student-brand-title">HUB 56</strong><small class="student-brand-sub">Інформатика · '+grade+' клас</small>';
 brand.append(logo,brandText);bar.append(brand);
 function addLinks(parent){items.forEach(([name,url])=>{const a=document.createElement("a");a.href=url;a.textContent=name;if(url===current)a.setAttribute("aria-current","page");parent.append(a)})}
 const desktop=document.createElement("nav");desktop.className="student-desktop-nav";desktop.setAttribute("aria-label","Навігація "+grade+" класу");addLinks(desktop);bar.append(desktop);
 const mobile=document.createElement("details");mobile.className="student-mobile";
 const summary=document.createElement("summary");summary.textContent="☰ Меню";summary.setAttribute("aria-label","Відкрити меню "+grade+" класу");
 const menu=document.createElement("nav");menu.className="student-mobile-menu";menu.setAttribute("aria-label","Мобільне меню "+grade+" класу");addLinks(menu);
 mobile.append(summary,menu);bar.append(mobile);header.append(bar);
 root.replaceWith(header);
})();
