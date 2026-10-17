import { app } from "./firebase-init.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const status = document.querySelector("#teacher-status");
const dashboard = document.querySelector("#teacher-dashboard");
const auth = getAuth(app);
const tabs = [...document.querySelectorAll(".teacher-tab")];
const panels = [...document.querySelectorAll(".teacher-panel")];

function selectTab(key) {
  for (const tab of tabs) {
    const selected = tab.dataset.tab === key;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  for (const panel of panels) panel.hidden = panel.id !== "panel-" + key;
}
tabs.forEach(tab => tab.addEventListener("click", () => selectTab(tab.dataset.tab)));
selectTab("overview");

const gradePreview = document.querySelector("#grade-preview");
document.querySelectorAll(".class-selector").forEach(button => {
  button.addEventListener("click", () => {
    for (const option of document.querySelectorAll(".class-selector")) {
      option.setAttribute("aria-pressed", String(option === button));
    }
    const grade = button.dataset.grade;
    gradePreview.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = grade + " клас";
    const description = document.createElement("p");
    description.textContent = "Тут згодом з’являться тренажери, вікторини та інтерактивні аркуші для " + grade + " класу. Навчальних даних поки немає.";
    gradePreview.append(heading, description);
  });
});

onAuthStateChanged(auth, async user => {
  dashboard.hidden = true;
  if (!user) {
    status.textContent = "Необхідно увійти в обліковий запис. Перейдіть на сторінку входу.";
    return;
  }
  try {
    // Роль перевіряється через Firebase ID token, а не через URL чи localStorage.
    // Це лише клієнтське обмеження інтерфейсу. Захист даних забезпечать Firestore Security Rules.
    const token = await user.getIdTokenResult(true);
    if (auth.currentUser?.uid !== user.uid) return;
    if (token.claims.role !== "teacher") {
      status.textContent = "Обліковий запис активний, але право доступу вчителя не призначено.";
      return;
    }
    status.textContent = "Роль учителя підтверджено. Демонстраційний кабінет відкрито; учнівські дані не підключено.";
    dashboard.hidden = false;
  } catch {
    status.textContent = "Не вдалося перевірити права доступу. Спробуйте пізніше.";
  }
}, () => {
  status.textContent = "Помилка перевірки сеансу.";
  dashboard.hidden = true;
});