import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjbbNf2xNl6LG0cIdMYRDb3SWWe4Mx9RE",
  authDomain: "exam-party.firebaseapp.com",
  databaseURL: "https://exam-party-default-rtdb.firebaseio.com",
  projectId: "exam-party",
  storageBucket: "exam-party.firebasestorage.app",
  messagingSenderId: "1020166508098",
  appId: "1:1020166508098:web:73a056e8989f46928a67db"
};

// 🔥 evita reinicializar (esto lo hiciste bien)
const app = getApps().length === 0 
  ? initializeApp(firebaseConfig)
  : getApp();

const db = getDatabase(app);

export { db };
