/**
 * eval-bots.js
 * Módulo de bots y cálculo de percentiles dinámico.
 * Funciona para cualquier cantidad total de preguntas (15, 30, 150, etc.).
 * Rendimiento de bots: Rango [60% - 98%].
 */

// Nombres base para generar los 30 bots
const NOMBRES_BOTS = [
  "Sofía Martínez", "Carlos Mendoza", "Lucía Fernández", "Mateo Gómez",
  "Valeria Ríos", "Alejandro Torres", "Elena Navarro", "Gabriel Silva",
  "Camila Ortiz", "Diego Castro", "Isabella Morales", "Lucas Romero",
  "Mariana Delgado", "Javier Vargas", "Paula Benítez", "Adrián Peña",
  "Daniela Ramos", "Nicolás Medina", "Sara Aguilar", "Tomás Guerrero",
  "Beatriz Rojas", "Samuel Paredes", "Victoria Soria", "Gonzalo Lara",
  "Natalia Cruz", "Joaquín Ibáñez", "Claudia Prieto", "Hugo Blanco",
  "Irene Pastor", "Manuel Gallego"
];

/**
 * Genera una lista de bots con aciertos proporcionales al total de preguntas.
 * Rango de porcentaje: entre 60% y 98%.
 * 
 * @param {number} totalPreguntas - Número de preguntas de la prueba.
 * @returns {Array} Lista de bots ordenada de mayor a menor aciertos.
 */
export function generarBotsAdaptativos(totalPreguntas) {
  const minPorcentaje = 0.60;
  const maxPorcentaje = 0.98;
  const paso = (maxPorcentaje - minPorcentaje) / (NOMBRES_BOTS.length - 1);

  return NOMBRES_BOTS.map((nombre, idx) => {
    // Genera una distribución uniforme del 98% al 60%
    const pct = maxPorcentaje - (idx * paso);
    const aciertos = Math.round(totalPreguntas * pct);

    return {
      nombre,
      aciertos,
      porcentaje: Math.round(pct * 100)
    };
  }).sort((a, b) => b.aciertos - a.aciertos);
}

/**
 * Calcula el percentil, porcentaje global, nivel y ranking de forma totalmente dinámica.
 * 
 * @param {number} aciertosUsuario - Aciertos obtenidos por el usuario.
 * @param {number} totalPreguntas - Número total de preguntas reales de la evaluación.
 * @returns {Object} Un objeto con { porcentaje, percentil, nivel, posicion, ranking }
 */
export function calcularResultadoEval(aciertosUsuario, totalPreguntas) {
  const porcentaje = Math.round((aciertosUsuario / totalPreguntas) * 100);
  
  // Genera bots escalados exactamente a 'totalPreguntas'
  const listaBots = generarBotsAdaptativos(totalPreguntas);

  // Integrar al usuario en la lista
  const ranking = [
    ...listaBots,
    { nombre: "Tú", aciertos: aciertosUsuario, porcentaje, usuario: true }
  ];

  // Ordenar de mayor a menor aciertos
  ranking.sort((a, b) => b.aciertos - a.aciertos);

  // Encontrar la posición del usuario en el ranking (1-indexed)
  const posicion = ranking.findIndex(p => p.usuario) + 1;

  // Cálculo del percentil
  const debajo = ranking.filter(p => aciertosUsuario > p.aciertos).length;
  const iguales = ranking.filter(p => aciertosUsuario === p.aciertos).length;
  let percentil = Math.round(((debajo + 0.5 * iguales) / ranking.length) * 100);

  // Ajustes para evitar percentiles absolutos (0 o 100)
  if (percentil < 1) percentil = 1;
  if (percentil > 99) percentil = 99;

  // Clasificación de nivel basada en percentil
  let nivel = "Bajo";
  if (percentil >= 90) nivel = "Sobresaliente";
  else if (percentil >= 75) nivel = "Muy bueno";
  else if (percentil >= 60) nivel = "Competitivo";
  else if (percentil >= 40) nivel = "Promedio";

  return {
    porcentaje,
    percentil,
    nivel,
    posicion,
    totalPreguntas,
    ranking
  };
}
