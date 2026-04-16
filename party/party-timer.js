import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjbbNf2xNl6LG0cIdMYRDb3SWWe4Mx9RE",
  authDomain: "exam-party.firebaseapp.com",
  projectId: "exam-party",
  storageBucket: "exam-party.firebasestorage.app",
  messagingSenderId: "1020166508098",
  appId: "1:1020166508098:web:73a056e8989f46928a67db"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const params = new URLSearchParams(window.location.search);
const salaCodigo = params.get("sala");

if (!salaCodigo) {
  console.log("Modo normal: sin cronómetro party.");
} else {
  iniciarTimerParty(salaCodigo);
}

function iniciarTimerParty(codigo) {
  crearUI();

  const salaRef = ref(db, `salas/${codigo}`);
  let intervalo = null;
  let examenFinalizado = false;

  onValue(salaRef, (snapshot) => {
    if (!snapshot.exists()) {
      actualizarEstado("La sala ya no existe.");
      detenerTimer();
      bloquearExamen();
      return;
    }

    const sala = snapshot.val();
    const timer = sala.timer;

    if (!timer || !timer.startTime || !timer.duracion) {
      actualizarEstado("Esperando configuración del cronómetro...");
      return;
    }

    actualizarEstado(`Modo party • Sala ${codigo}`);

    if (intervalo) return;

    intervalo = setInterval(() => {
      const ahora = Date.now();
      const transcurrido = Math.floor((ahora - timer.startTime) / 1000);
      const restante = Math.max(0, timer.duracion - transcurrido);

      actualizarTimer(restante, timer.duracion);

      if (restante <= 0 && !examenFinalizado) {
        examenFinalizado = true;
        detenerTimer();
        actualizarEstado("Tiempo terminado");
        bloquearExamen();
        lanzarCalificacionAutomatica();
      }
    }, 250);
  });

  function detenerTimer() {
    if (intervalo) {
      clearInterval(intervalo);
      intervalo = null;
    }
  }
}

function crearUI() {
  if (document.getElementById("partyTimerWrap")) return;

  const wrap = document.createElement("div");
  wrap.id = "partyTimerWrap";
  wrap.innerHTML = `
    <div id="partyTimerBox">
      <div id="partyTimerTop">
        <span id="partyTimerLabel">Tiempo party</span>
        <span id="partyTimerEstado">Conectando...</span>
      </div>
      <div id="partyTimerValue">--:--</div>
      <div id="partyTimerBarBg">
        <div id="partyTimerBar"></div>
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #partyTimerWrap{
      position: sticky;
      top: 10px;
      z-index: 9999;
      width: min(900px, calc(100% - 20px));
      margin: 10px auto 18px;
    }

    #partyTimerBox{
      background: rgba(255,255,255,0.95);
      border: 1px solid #bfdbfe;
      border-radius: 18px;
      box-shadow: 0 10px 24px rgba(37,99,235,0.12);
      padding: 14px 16px;
      backdrop-filter: blur(8px);
    }

    #partyTimerTop{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      margin-bottom:8px;
      flex-wrap:wrap;
    }

    #partyTimerLabel{
      font-weight:bold;
      color:#1d4ed8;
    }

    #partyTimerEstado{
      color:#64748b;
      font-size:0.95rem;
    }

    #partyTimerValue{
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: bold;
      color:#0f172a;
      text-align:center;
      margin-bottom:10px;
    }

    #partyTimerBarBg{
      width:100%;
      height:12px;
      background:#dbeafe;
      border-radius:999px;
      overflow:hidden;
    }

    #partyTimerBar{
      width:100%;
      height:100%;
      background: linear-gradient(90deg, #2563eb, #60a5fa);
      transition: width 0.25s linear;
    }

    #partyTimerValue.party-alert{
      color:#dc2626;
      animation: partyBlink 1s infinite;
    }

    @keyframes partyBlink{
      0%{opacity:1;}
      50%{opacity:0.45;}
      100%{opacity:1;}
    }
  `;

  document.head.appendChild(style);

  const body = document.body;
  if (body.firstChild) {
    body.insertBefore(wrap, body.firstChild);
  } else {
    body.appendChild(wrap);
  }
}

function actualizarEstado(texto) {
  const el = document.getElementById("partyTimerEstado");
  if (el) el.textContent = texto;
}

function actualizarTimer(segundosRestantes, duracionTotal) {
  const value = document.getElementById("partyTimerValue");
  const bar = document.getElementById("partyTimerBar");

  if (!value || !bar) return;

  const min = String(Math.floor(segundosRestantes / 60)).padStart(2, "0");
  const sec = String(segundosRestantes % 60).padStart(2, "0");
  value.textContent = `${min}:${sec}`;

  const porcentaje = duracionTotal > 0 ? (segundosRestantes / duracionTotal) * 100 : 0;
  bar.style.width = `${Math.max(0, Math.min(100, porcentaje))}%`;

  if (segundosRestantes <= 60) {
    value.classList.add("party-alert");
  } else {
    value.classList.remove("party-alert");
  }
}

function bloquearExamen() {
  document.querySelectorAll("input, button, select, textarea").forEach((el) => {
    el.disabled = true;
  });
}

function lanzarCalificacionAutomatica() {
  if (typeof window.calificarExamen === "function") {
    try {
      window.calificarExamen(true);
      return;
    } catch (error) {
      console.error("No se pudo calificar automáticamente:", error);
    }
  }

  alert("Se terminó el tiempo del modo party.");
}
