// eval/eval-bots.js

// Lista oficial de 30 nombres únicos para los bots competitivos
const NOMBRES_BOTS = [
  "Astra_99", "Nexus_Mind", "Valeria_S", "Olympo_88", "Kaiser_V",
  "Sigma_Master", "Cronos_X", "Atenea_Quiz", "Titan_Verbal", "Hyperion_01",
  "Minerva_Tech", "Vector_Prime", "Lumina_A", "Apex_Predict", "Delfos_77",
  "Socrates_AI", "Zeus_Cognitive", "Eos_Scholar", "Vortex_Core", "Quantum_Gen",
  "Phoenix_09", "Cerebro_Top", "Apolo_Logic", "Vanguard_99", "Electra_Mind",
  "Helios_Peak", "Aegis_Verbal", "Orion_Ace", "Nirvana_Code", "Genesis_Max"
];

/**
 * Genera el listado de 30 bots con notas difíciles (rango de 60% a 100%).
 * @param {number} totalPreguntas - Número total de preguntas evaluadas hasta el examen actual.
 * @returns {Array} Array de objetos bot con nombre, aciertos y nota (%).
 */
export function obtener30BotsEvaluacion(totalPreguntas) {
  return NOMBRES_BOTS.map((nombre) => {
    // Puntuación aleatoria entre 60% y 100%
    const porcentaje = Math.floor(Math.random() * 41) + 60; 
    const aciertos = Math.round((porcentaje / 100) * totalPreguntas);

    return {
      nombre,
      aciertos,
      nota: porcentaje
    };
  });
}

/**
 * Calcula el Percentil Global y el Ranking de 31 participantes (30 bots + Usuario).
 * @param {number} aciertosUsuario - Aciertos acumulados por el usuario.
 * @param {number} totalPreguntas - Preguntas totales evaluadas hasta el momento.
 * @returns {Object} Objeto con ranking ordenado, percentil, nivel y porcentaje del usuario.
 */
export function calcularPercentilGlobal(aciertosUsuario, totalPreguntas) {
  const porcentajeUsuario = Math.round((aciertosUsuario / totalPreguntas) * 100);
  const bots = obtener30BotsEvaluacion(totalPreguntas);

  const usuario = {
    nombre: "Tú (Usuario)",
    aciertos: aciertosUsuario,
    nota: porcentajeUsuario,
    usuario: true
  };

  // Combinar usuario con los 30 bots y ordenar descendentemente por nota
  const ranking = [...bots, usuario];
  ranking.sort((a, b) => b.nota - a.nota);

  // Cálculo de percentil
  const debajo = ranking.filter(p => porcentajeUsuario > p.nota).length;
  const iguales = ranking.filter(p => porcentajeUsuario === p.nota).length;

  let percentil = Math.round((debajo + (0.5 * iguales)) / ranking.length * 100);
  if (percentil < 1) percentil = 1;
  if (percentil > 99) percentil = 99;

  // Asignación de nivel académico
  let nivel = "Bajo";
  if (percentil >= 90) nivel = "Sobresaliente";
  else if (percentil >= 75) nivel = "Muy Bueno";
  else if (percentil >= 60) nivel = "Competitivo";
  else if (percentil >= 40) nivel = "Promedio";

  return {
    ranking,
    percentil,
    nivel,
    porcentajeUsuario
  };
}
