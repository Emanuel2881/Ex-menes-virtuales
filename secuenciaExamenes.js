import { generarBots } from './bots.js';

/**
 * Activa o desactiva el modo de secuencia en localStorage.
 * @param {boolean} activar 
 */
export function toggleModoSecuencia(activar) {
  if (activar) {
    localStorage.setItem('modoSecuencia', 'true');
    // Reiniciar registro de notas al iniciar un nuevo flujo
    localStorage.removeItem('secuenciaResultados');
  } else {
    localStorage.removeItem('modoSecuencia');
    localStorage.removeItem('secuenciaResultados');
  }
}

/**
 * Consulta si el modo secuencia está activo.
 * @returns {boolean}
 */
export function esModoSecuencia() {
  return localStorage.getItem('modoSecuencia') === 'true';
}

/**
 * Guarda el resultado del examen actual en la secuencia.
 * @param {string} etapa - Identificador (ej. 'verbal', 'matematicas').
 * @param {number} correctas - Cantidad de aciertos.
 * @param {number} total - Total de preguntas.
 */
export function guardarResultadoExamen(etapa, correctas, total) {
  var datos = JSON.parse(localStorage.getItem('secuenciaResultados') || '{}');
  var porcentaje = Math.round((correctas / total) * 100);

  datos[etapa] = {
    correctas: correctas,
    total: total,
    porcentaje: porcentaje
  };

  localStorage.setItem('secuenciaResultados', JSON.stringify(datos));
}

/**
 * Selecciona aleatoriamente el siguiente examen de matemáticas disponible.
 * @returns {string} Ruta o nombre del archivo del examen de matemáticas.
 */
export function obtenerExamenMateAleatorio() {
  const examenesMate = [
    'mate-examen1.html',
    'mate-examen2.html'
  ];
  const indice = Math.floor(Math.random() * examenesMate.length);
  return examenesMate[indice];
}

/**
 * Calcula la nota global acumulada y genera el ranking con bots.
 * @returns {Object|null}
 */
export function obtenerResultadoGlobalConBots() {
  var datos = JSON.parse(localStorage.getItem('secuenciaResultados') || '{}');
  
  var totalCorrectas = 0;
  var totalPreguntas = 0;

  Object.keys(datos).forEach(function(etapa) {
    totalCorrectas += datos[etapa].correctas;
    totalPreguntas += datos[etapa].total;
  });

  if (totalPreguntas === 0) return null;

  var porcentajeGlobal = Math.round((totalCorrectas / totalPreguntas) * 100);
  
  // Generar ranking usando la función de bots.js
  var resultadoBots = generarBots(porcentajeGlobal);

  return {
    totalCorrectas: totalCorrectas,
    totalPreguntas: totalPreguntas,
    porcentajeGlobal: porcentajeGlobal,
    ranking: resultadoBots.ranking,
    percentil: resultadoBots.percentil,
    nivel: resultadoBots.nivel
  };
}
