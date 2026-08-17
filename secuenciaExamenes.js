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
 * @param {string} etapa - Identificador (ej. 'verbal', 'numerica').
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
 * Selecciona aleatoriamente el siguiente examen de aptitud numérica disponible.
 * @returns {string} Nombre del archivo del examen de aptitud numérica.
 */
export function obtenerExamenMateAleatorio() {
  const examenesNumerica = [
    'numerica-examen1.html',
    'numerica-examen2.html',
    'numerica-examen3.html',
    'numerica-examen4.html',
    'numerica-examen5.html',
    'numerica-examen6.html',
    'numerica-examen7.html',
    'numerica-examen8.html',
    'numerica-examen9.html',
    'numerica-examen10.html',
    'numerica-examen11.html',
    'numerica-examen12.html',
    'numerica-examen13.html',
    'numerica-examen14.html',
    'numerica-examen15.html',
    'numerica-examen16.html',
    'numerica-examen17.html'
  ];
  
  const indice = Math.floor(Math.random() * examenesNumerica.length);
  return examenesNumerica[indice];
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
