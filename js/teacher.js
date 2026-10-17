import { app } from "./firebase-init.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
const status = document.querySelector("#teacher-status");
const dashboard = document.querySelector("#teacher-dashboard");
const auth = getAuth(app);
onAuthStateChanged(auth, async user => {
  dashboard.hidden = true;
  if (!user) {
    status.textContent = "Необхідно увійти в обліковий запис. Перейдіть на сторінку входу.";
    return;
  }
  try {
    // Не довіряємо ролі з localStorage, параметрів URL або полів форми.
    // Серверне призначення custom claim потрібне окремо.
    const token = await user.getIdTokenResult(true);
    if (token.claims.role !== "teacher") {
      status.textContent = "Обліковий запис активний, але право доступу вчителя не призначено.";
      return;
    }
    status.textContent = "Роль учителя підтверджено. Це попередня сторінка без доступу до учнівських даних.";
    dashboard.hidden = false;
  } catch {
    status.textContent = "Не вдалося перевірити права доступу. Спробуйте пізніше.";
  }
}, () => { status.textContent = "Помилка перевірки сеансу."; dashboard.hidden = true; });