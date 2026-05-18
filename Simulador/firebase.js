// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// Configuración Firebase
const firebaseConfig = {

  apiKey: "AIzaSyDAzvolB1KPpHTC2iN4gexb5mm_SJqyIqg",

  authDomain: "simulador-aebd7.firebaseapp.com",

  projectId: "simulador-aebd7",

  storageBucket: "simulador-aebd7.firebasestorage.app",

  messagingSenderId: "625035090415",

  appId: "1:625035090415:web:583501533489f81f4c7e1a",

  measurementId: "G-LDD4L0FZTE"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);


// Base de datos
const db = getFirestore(app);


// exportar
export { db };
