import { generarBots } from "./bots.js";

const CLAVE_ALMACENAMIENTO = "evaluacion_secuencial_temp";

// Lista oficial de los 17 exámenes de Matemáticas (Numérica)
const EXAMENES_MATE = [
  "numerica-examen1.html",
  "numerica-examen2.html",
  "numerica-examen3.html",
  "numerica-examen4.html",
  "numerica-examen5.html",
  "numerica-examen6.html",
  "numerica-examen7.html",
  "numerica-examen8.html",
  "numerica-examen9.html",
  "numerica-examen10.html",
  "numerica-examen11.html",
  "numerica-examen12.html",
  "numerica-examen13.html",
  "numerica-examen14.html",
  "numerica-examen15.html",
  "numerica-examen16.html",
  "numerica-examen17.html"
];

// Lista oficial de exámenes de Verbal
const EXAMENES_VERBAL = [
  "verbal-examen1.html",
  "verbal-examen2.html",
  "verbal-examen3.html",
  "verbal-examen4.html",
  "verbal-examen5.html",
  "verbal-examen6.html",
  "verbal-examen7.html",
  "verbal-examen8.html",
  "verbal-examen10.html"
];

/**
 * Inicia una nueva secuencia habilitando el modo de evaluación.
 */
export function iniciarSecuencia() {
  const datosIniciales = {
    modoActivo: true
  };
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datosIniciales));
}

/**
 * Verifica si actualmente se está ejecutando la evaluación continua.
 * @returns {boolean}
 */
export function esModoSecuencia() {
  const datos = JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO));
  return Boolean(datos && datos.modoActivo);
}

/**
 * Guarda los resultados del examen actual (Verbal o Numérica).
 */
export function guardarResultadoExamen(tipo, correctas, total) {
  const datosPrevios = JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO)) || { modoActivo: true };
  
  datosPrevios[tipo] = {
    correctas: Number(correctas),
    total: Number(total),
    porcentaje: Math.round((correctas / total) * 100)
  };

  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datosPrevios));
}

// Alias de apoyo para mantener compatibilidad
export const registrarResultadoEtapa = guardarResultadoExamen;

/**
 * Obtiene los datos guardados de la secuencia actual.
 */
export function obtenerEstadoSecuencia() {
  return JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO)) || {};
}

/**
 * Selecciona una URL de examen de matemáticas aleatoriamente.
 */
export function obtenerExamenMateAleatorio() {
  const indice = Math.floor(Math.random() * EXAMENES_MATE.length);
  return EXAMENES_MATE[indice];
}

// Alias de apoyo para mantener compatibilidad con llamados de la vista
export const obtenerExamenNumericoAleatorio = obtenerExamenMateAleatorio;

/**
 * Selecciona una URL de examen verbal aleatoriamente.
 */
export function obtenerExamenVerbalAleatorio() {
  const indice = Math.floor(Math.random() * EXAMENES_VERBAL.length);
  return EXAMENES_VERBAL[indice];
}

/**
 * Limpia el estado del modo evaluación al finalizar.
 */
export function finalizarSecuencia() {
  localStorage.removeItem(CLAVE_ALMACENAMIENTO);
}

/**
 * Procesa el resultado global combinando ambas etapas (Verbal + Numérica).
 */
export function calcularResultadoGlobal() {
  const datos = obtenerEstadoSecuencia();

  if (!datos.verbal || !datos.numerica) {
    return null; // Falta completar alguna de las dos etapas
  }

  const botsVerbal = generarBots("verbal", datos.verbal.total);
  const botsNumerica = generarBots("numerica", datos.numerica.total);

  const totalCorrectasUsuario = datos.verbal.correctas + datos.numerica.correctas;
  const totalPreguntasGlobal = datos.verbal.total + datos.numerica.total;
  const porcentajeGlobalUsuario = Math.round((totalCorrectasUsuario / totalPreguntasGlobal) * 100);

  const listaParticipantes = [];

  for (let i = 0; i < 29; i++) {
    const botV = botsVerbal[i];
    const botM = botsNumerica[i];

    const correctasBot = botV.correctas + botM.correctas;
    const notaBot = Math.round((correctasBot / totalPreguntasGlobal) * 100);

    listaParticipantes.push({
      nombre: botV.nombre,
      correctas: correctasBot,
      nota: notaBot,
      esUsuario: false
    });
  }

  listaParticipantes.push({
    nombre: "Tú",
    correctas: totalCorrectasUsuario,
    nota: porcentajeGlobalUsuario,
    esUsuario: true
  });

  listaParticipantes.sort((a, b) => b.nota - a.nota);

  const estrictamenteMenores = listaParticipantes.filter(p => porcentajeGlobalUsuario > p.nota).length;
  const iguales = listaParticipantes.filter(p => porcentajeGlobalUsuario === p.nota).length;

  let percentil = Math.round(((estrictamenteMenores + (0.5 * iguales)) / listaParticipantes.length) * 100);
  percentil = Math.max(1, Math.min(99, percentil));

  let nivel = "Muy bajo";
  if (percentil >= 90) nivel = "Excelente";
  else if (percentil >= 75) nivel = "Muy bueno";
  else if (percentil >= 60) nivel = "Bueno";
  else if (percentil >= 40) nivel = "Promedio";
  else if (percentil >= 20) nivel = "Bajo";

  return {
    usuario: {
      verbal: datos.verbal,
      numerica: datos.numerica,
      totalCorrectas: totalCorrectasUsuario,
      totalPreguntas: totalPreguntasGlobal,
      porcentajeGlobal: porcentajeGlobalUsuario,
      percentil: percentil,
      nivel: nivel
    },
    ranking: listaParticipantes
  };
}
