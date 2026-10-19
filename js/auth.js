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
const studentLink = document.querySelector("#student-space-link");
const roleOptions = [...document.querySelectorAll('input[name="login-role"]')];
let chosenRole = document.querySelector('input[name="login-role"]:checked')?.value || "student";
let verifiedTeacher = false;
function refreshDestination(){
 teacherLink.hidden = !(auth.currentUser && chosenRole === "teacher" && verifiedTeacher);
 studentLink.hidden = !(auth.currentUser && chosenRole === "student");
}
roleOptions.forEach(option=>option.addEventListener("change",()=>{
 chosenRole = document.querySelector('input[name="login-role"]:checked')?.value || "student";
 refreshDestination();
 if(auth.currentUser){
  if(chosenRole === "student") notice("Вхід активний. Можна перейти до вибору класу.");
  else notice(verifiedTeacher?"Роль учителя підтверджена. Перейдіть до кабінету.":"Для входу в кабінет потрібна роль учителя.");
 }
}));
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
  verifiedTeacher = false;
  refreshDestination();
  accountEmail.textContent = user?.email ?? "";
  if (!user) {
    roleMessage.textContent = "";
    notice("Увійдіть за наданими обліковими даними.");
    return;
  }
  roleMessage.textContent = "Перевіряємо роль облікового запису…";
  notice("Вхід успішний. Перевіряємо права доступу…");
  try {
    const token = await user.getIdTokenResult(true);
    if (currentRevision !== authRevision || auth.currentUser?.uid !== user.uid) return;
    verifiedTeacher = token.claims.role === "teacher";
    refreshDestination();
    if(chosenRole === "student") {
      roleMessage.textContent = "Оберіть свій клас на головній сторінці.";
      notice("Вхід активний. Можна перейти до вибору класу.");
    } else if (verifiedTeacher) {
      roleMessage.textContent = "Роль учителя підтверджена.";
      notice("Вхід успішний. Доступ до кабінету вчителя дозволено.");
    } else {
      roleMessage.textContent = "Цей обліковий запис не має ролі вчителя.";
      notice("Для кабінету вчителя потрібні відповідні права.");
    }
  } catch {
    if (currentRevision !== authRevision || auth.currentUser?.uid !== user.uid) return;
    roleMessage.textContent = "Не вдалося перевірити роль. Спробуйте оновити сторінку.";
    notice("Вхід успішний, але перевірка прав доступу не завершилася.");
  }
}, () => {
  ++authRevision;
  verifiedTeacher = false;
  refreshDestination();
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
