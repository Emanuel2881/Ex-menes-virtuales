import { db } from "./firebase-config.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const codigoSala = params.get("sala");

if (!codigoSala) {
  // No está en modo party
} else {
  window.guardarResultadoParty = guardarResultadoParty;
  escucharResultadosParty();
}

function obtenerJugadorActual() {
  return localStorage.getItem("partyJugador") || sessionStorage.getItem("partyJugador") || "jugador1";
}

function obtenerNombreJugador() {
  return localStorage.getItem("partyNombre") || sessionStorage.getItem("partyNombre") || obtenerJugadorActual();
}

async function guardarResultadoParty(data) {
  const jugadorId = obtenerJugadorActual();
  const nombre = obtenerNombreJugador();

  const resultadoRef = ref(db, `salas/${codigoSala}/resultados/${jugadorId}`);

  await set(resultadoRef, {
    nombre,
    ...data,
    terminado: true,
    timestamp: Date.now()
  });
}

function escucharResultadosParty() {
  const resultadosRef = ref(db, `salas/${codigoSala}/resultados`);

  onValue(resultadosRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const jugadores = Object.values(data).filter(j => j && j.terminado);

    if (jugadores.length >= 2) {
      mostrarComparacion(jugadores[0], jugadores[1]);
    }
  });
}

function mostrarComparacion(j1, j2) {
  const contenedor = document.getElementById("partyResultadoContenido");
  const caja = document.getElementById("resultadoParty");

  if (!contenedor || !caja) return;

  let mensajeFinal = "";

  if (j1.porcentaje > j2.porcentaje) {
    mensajeFinal = `🏆 Ganó ${j1.nombre}`;
  } else if (j2.porcentaje > j1.porcentaje) {
    mensajeFinal = `🏆 Ganó ${j2.nombre}`;
  } else {
    mensajeFinal = "🤝 Empate";
  }

  contenedor.innerHTML = `
    <div class="party-grid">
      <div class="party-card">
        <h3>${j1.nombre}</h3>
        <p><strong>Correctas:</strong> ${j1.correctas}</p>
        <p><strong>Incorrectas:</strong> ${j1.incorrectas}</p>
        <p><strong>Sin responder:</strong> ${j1.sinResponder}</p>
        <p><strong>Nota:</strong> ${j1.porcentaje}%</p>
      </div>

      <div class="party-card">
        <h3>${j2.nombre}</h3>
        <p><strong>Correctas:</strong> ${j2.correctas}</p>
        <p><strong>Incorrectas:</strong> ${j2.incorrectas}</p>
        <p><strong>Sin responder:</strong> ${j2.sinResponder}</p>
        <p><strong>Nota:</strong> ${j2.porcentaje}%</p>
      </div>
    </div>

    <div class="party-winner">
      ${mensajeFinal}
    </div>
  `;

  caja.style.display = "block";
}
