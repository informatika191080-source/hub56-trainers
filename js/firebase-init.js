// Публічна вебконфігурація Firebase (не адміністративний ключ).
// Авторизація й доступ до даних будуть налаштовані окремо.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyBfY6ERqIqoDBipoq_z1hFNhTwU-2mvFKQ",
  authDomain: "hub-56-education.firebaseapp.com",
  projectId: "hub-56-education",
  storageBucket: "hub-56-education.firebasestorage.app",
  messagingSenderId: "195368396844",
  appId: "1:195368396844:web:dc25763628b5d5d87b4989",
  measurementId: "G-GS7M4W4JDX"
};
export const app = initializeApp(firebaseConfig);
export const firebaseProjectId = app.options.projectId;
