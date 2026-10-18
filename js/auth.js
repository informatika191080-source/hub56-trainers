import { app } from "./firebase-init.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const auth = getAuth(app);
const form = document.querySelector("#login-form");
const message = document.querySelector("#auth-message");
const panel = document.querySelector("#account-panel");
const accountEmail = document.querySelector("#account-email");
const button = document.querySelector("#login-button");
const logout = document.querySelector("#logout-button");
const roleMessage = document.querySelector("#account-role-message");
const teacherLink = document.querySelector("#teacher-cabinet-link");
let authRevision = 0;

function notice(text) { message.textContent = text; }
function setBusy(busy) { button.disabled = busy; logout.disabled = busy; }
function readableError(error) {
  switch(error?.code) {
    case "auth/invalid-email": return "Перевірте формат електронної адреси.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "Невірна електронна адреса або пароль.";
    case "auth/too-many-requests": return "Забагато спроб входу. Повторіть пізніше.";
    case "auth/network-request-failed": return "Не вдалося встановити з'єднання з інтернетом.";
    case "auth/unauthorized-domain": return "Домен сайту не дозволений у Firebase Authentication.";
    default: return "Помилка входу. Повторіть спробу пізніше.";
  }
}

onAuthStateChanged(auth, async user => {
  const currentRevision = ++authRevision;
  form.hidden = Boolean(user);
  panel.hidden = !user;
  teacherLink.hidden = true;
  accountEmail.textContent = user?.email ?? "";
  if (!user) {
    roleMessage.textContent = "";
    notice("Увійдіть за тестовими обліковими даними.");
    return;
  }
  roleMessage.textContent = "Перевіряємо роль облікового запису…";
  notice("Вхід успішний. Перевіряємо права доступу…");
  try {
    const token = await user.getIdTokenResult();
    if (currentRevision !== authRevision || auth.currentUser?.uid !== user.uid) return;
    if (token.claims.teacher === true) {
      roleMessage.textContent = "Роль учителя підтверджена. Можна перейти до кабінету вчителя.";
      teacherLink.hidden = false;
      notice("Вхід успішний. Доступ до кабінету вчителя дозволено.");
    } else {
      roleMessage.textContent = "Роль учителя не підтверджена. Кабінет учителя недоступний для цього облікового запису.";
      notice("Вхід успішний. Для кабінету вчителя потрібні відповідні права.");
    }
  } catch {
    if (currentRevision !== authRevision || auth.currentUser?.uid !== user.uid) return;
    roleMessage.textContent = "Не вдалося перевірити роль. Спробуйте оновити сторінку.";
    notice("Вхід успішний, але перевірка прав доступу не завершилася.");
  }
}, () => {
  ++authRevision;
  teacherLink.hidden = true;
  notice("Не вдалося перевірити стан входу. Перевірте підключення.");
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  setBusy(true);
  notice("Перевіряємо дані…");
  try {
    await signInWithEmailAndPassword(auth, document.querySelector("#email").value.trim(), document.querySelector("#password").value);
    document.querySelector("#password").value = "";
  } catch(error) {
    notice(readableError(error));
  } finally { setBusy(false); }
});
logout.addEventListener("click", async () => {
  setBusy(true);
  try { await signOut(auth); notice("Ви вийшли з облікового запису."); }
  catch { notice("Не вдалося завершити сеанс. Спробуйте ще раз."); }
  finally { setBusy(false); }
});
