riacion' la desviación máxima en puntos porcentuales (±).
 */
const BOTS_PROFILES = [
  // --- Nivel Inicial (2 bots ~60-66%) ---
  { id: 1, nombre: "Bot_01", verbal: { base: 62, variacion: 3 }, numerica: { base: 60, variacion: 4 } },
  { id: 2, nombre: "Bot_02", verbal: { base: 60, variacion: 4 }, numerica: { base: 65, variacion: 3 } },

  // --- Nivel Medio-Bajo (5 bots ~67-72%) ---
  { id: 3, nombre: "Bot_03", verbal: { base: 68, variacion: 3 }, numerica: { base: 71, variacion: 4 } },
  { id: 4, nombre: "Bot_04", verbal: { base: 71, variacion: 4 }, numerica: { base: 67, variacion: 3 } },
  { id: 5, nombre: "Bot_05", verbal: { base: 69, variacion: 3 }, numerica: { base: 70, variacion: 4 } },
  { id: 6, nombre: "Bot_06", verbal: { base: 72, variacion: 3 }, numerica: { base: 68, variacion: 3 } },
  { id: 7, nombre: "Bot_07", verbal: { base: 67, variacion: 4 }, numerica: { base: 72, variacion: 3 } },

  // --- Nivel Medio (7 bots ~73-79%) ---
  { id: 8, nombre: "Bot_08", verbal: { base: 74, variacion: 3 }, numerica: { base: 78, variacion: 3 } },
  { id: 9, nombre: "Bot_09", verbal: { base: 77, variacion: 3 }, numerica: { base: 73, variacion: 4 } },
  { id: 10, nombre: "Bot_10", verbal: { base: 75, variacion: 4 }, numerica: { base: 76, variacion: 3 } },
  { id: 11, nombre: "Bot_11", verbal: { base: 79, variacion: 3 }, numerica: { base: 74, variacion: 3 } },
  { id: 12, nombre: "Bot_12", verbal: { base: 73, variacion: 3 }, numerica: { base: 79, variacion: 3 } },
  { id: 13, nombre: "Bot_13", verbal: { base: 76, variacion: 3 }, numerica: { base: 75, variacion: 4 } },
  { id: 14, nombre: "Bot_14", verbal: { base: 78, variacion: 3 }, numerica: { base: 77, variacion: 3 } },

  // --- Nivel Alto (8 bots ~80-86%) ---
  { id: 15, nombre: "Bot_15", verbal: { base: 82, variacion: 3 }, numerica: { base: 80, variacion: 3 } },
  { id: 16, nombre: "Bot_16", verbal: { base: 80, variacion: 3 }, numerica: { base: 85, variacion: 3 } },
  { id: 17, nombre: "Bot_17", verbal: { base: 85, variacion: 3 }, numerica: { base: 81, variacion: 4 } },
  { id: 18, nombre: "Bot_18", verbal: { base: 81, variacion: 4 }, numerica: { base: 84, variacion: 3 } },
  { id: 19, nombre: "Bot_19", verbal: { base: 84, variacion: 3 }, numerica: { base: 82, variacion: 3 } },
  { id: 20, nombre: "Bot_20", verbal: { base: 83, variacion: 3 }, numerica: { base: 86, variacion: 2 } },
  { id: 21, nombre: "Bot_21", verbal: { base: 86, variacion: 2 }, numerica: { base: 83, variacion: 3 } },
  { id: 22, nombre: "Bot_22", verbal: { base: 81, variacion: 3 }, numerica: { base: 81, variacion: 3 } },

  // --- Nivel Sobresaliente (5 bots ~87-93%) ---
  { id: 23, nombre: "Bot_23", verbal: { base: 88, variacion: 3 }, numerica: { base: 92, variacion: 2 } },
  { id: 24, nombre: "Bot_24", verbal: { base: 91, variacion: 2 }, numerica: { base: 87, variacion: 3 } },
  { id: 25, nombre: "Bot_25", verbal: { base: 89, variacion: 3 }, numerica: { base: 90, variacion: 2 } },
  { id: 26, nombre: "Bot_26", verbal: { base: 93, variacion: 2 }, numerica: { base: 88, variacion: 3 } },
  { id: 27, nombre: "Bot_27", verbal: { base: 87, variacion: 3 }, numerica: { base: 93, variacion: 2 } },

  // --- Nivel Elite (2 bots ~94-98%) ---
  { id: 28, nombre: "Bot_28", verbal: { base: 96, variacion: 2 }, numerica: { base: 94, variacion: 2 } },
  { id: 29, nombre: "Bot_29", verbal: { base: 95, variacion: 2 }, numerica: { base: 97, variacion: 1 } }
];


 
export function generarBots(tipo, totalPreguntas) {
  if (!totalPreguntas || totalPreguntas <= 0) {
    return [];
  }

  const tipoNormalizado = (tipo || "").toLowerCase();

  return BOTS_PROFILES.map((bot) => {
    // Selección del perfil correspondiente según el tipo de examen
    const perfil = bot[tipoNormalizado] || bot.verbal;

    // Generar un factor aleatorio entre -variacion y +variacion
    const delta = (Math.random() * 2 - 1) * perfil.variacion;
    let porcentajeCalculado = perfil.base + delta;

    // Asegurar límites realistas (entre 0% y 100%)
    porcentajeCalculado = Math.max(0, Math.min(100, porcentajeCalculado));

    // Convertir el porcentaje a respuestas correctas
    const correctas = Math.min(
      totalPreguntas,
      Math.max(0, Math.round(totalPreguntas * (porcentajeCalculado / 100)))
    );

    // Calcular la nota real (porcentaje efectivo ajustado al número de preguntas)
    const nota = Math.round((correctas / totalPreguntas) * 100);

    return {
      id: bot.id,
      nombre: bot.nombre,
      correctas: correctas,
      total: totalPreguntas,
      nota: nota
    };
  });
}
