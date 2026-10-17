// HUB 56: адміністративне призначення ролі. НЕ запускається у браузері.
// Виконувати лише у довіреному середовищі з Application Default Credentials.
// Запуск: node assign-teacher.mjs FIREBASE_UID [--apply]
// Без --apply сценарій тільки перевіряє користувача; змін не вносить.
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = "hub-56-education";
const uid = process.argv[2];
const apply = process.argv[3] === "--apply";
if (!uid || uid.startsWith("-") || process.argv.length > 4 ||
    (process.argv[3] && !apply)) {
  console.error("Використання: node assign-teacher.mjs FIREBASE_UID [--apply]");
  process.exit(2);
}
initializeApp({ credential: applicationDefault(), projectId });
try {
  const auth = getAuth();
  const user = await auth.getUser(uid);
  const currentClaims = user.customClaims || {};
  console.log("Проєкт:", projectId);
  console.log("UID:", user.uid);
  console.log("Поточна роль:", currentClaims.role ?? "(не задано)");
  if (currentClaims.role && currentClaims.role !== "teacher") {
    throw Error("Обліковий запис уже має іншу роль. Потрібна окрема перевірка.");
  }
  if (!apply) {
    console.log("ПЕРЕВІРКА: змін не внесено. Для підтвердження додайте --apply.");
    process.exit(0);
  }
  await auth.setCustomUserClaims(uid, { ...currentClaims, role: "teacher" });
  console.log("Роль teacher призначено. Попросіть користувача переввійти.");
} catch (error) {
  console.error("Операцію не завершено:", error.message);
  process.exit(1);
}
