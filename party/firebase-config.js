// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyBjbbNf2xNl6LG0cIdMYRDb3SWWe4Mx9RE",
  authDomain: "exam-party.firebaseapp.com",
  projectId: "exam-party",
  storageBucket: "exam-party.firebasestorage.app",
  messagingSenderId: "1020166508098",
  appId: "1:1020166508098:web:73a056e8989f46928a67db",
  measurementId: "G-PVQMLWK794"
};

// iniciar firebase
const app = initializeApp(firebaseConfig);

// base de datos (esto es lo que usaremos para salas)
const db = getDatabase(app);

// exportamos para usarlo en otros archivos
export { db };
