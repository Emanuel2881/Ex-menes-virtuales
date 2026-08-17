/**
 * Genera una lista de 30 bots con notas simuladas y calcula el ranking,
 * percentil y nivel del usuario respecto al grupo.
 * 
 * @param {number} porcentajeUsuario - Nota del usuario en porcentaje (0 a 100).
 * @returns {Object} Objeto con ranking ordenado, percentil y nivel.
 */
export function generarBots(porcentajeUsuario) {
  // Rangos de notas predefinidos para simular una curva de distribución normal
  var rangosBots = [
    { min: 50, max: 64 }, { min: 50, max: 64 },
    { min: 65, max: 74 }, { min: 65, max: 74 }, { min: 65, max: 74 }, { min: 65, max: 74 },
    { min: 75, max: 84 }, { min: 75, max: 84 }, { min: 75, max: 84 }, { min: 75, max: 84 }, { min: 75, max: 84 }, { min: 75, max: 84 }, { min: 75, max: 84 }, { min: 75, max: 84 }, { min: 75, max: 84 },
    { min: 85, max: 94 }, { min: 85, max: 94 }, { min: 85, max: 94 }, { min: 85, max: 94 }, { min: 85, max: 94 }, { min: 85, max: 94 }, { min: 85, max: 94 }, { min: 85, max: 94 }, { min: 85, max: 94 }, { min: 85, max: 94 },
    { min: 95, max: 100 }, { min: 95, max: 100 }, { min: 95, max: 100 }, { min: 95, max: 100 }, { min: 95, max: 100 }
  ];

  // Mezclar los rangos aleatoriamente
  rangosBots.sort(function () {
    return Math.random() - 0.5;
  });

  // Generar los 30 bots con notas dentro de los rangos
  var bots = [];
  for (var i = 1; i <= 30; i++) {
    var rango = rangosBots[i - 1];
    bots.push({
      nombre: "Bot_" + i,
      nota: Math.floor(Math.random() * (rango.max - rango.min + 1)) + rango.min
    });
  }

  // Insertar al usuario en la lista y ordenar de mayor a menor nota
  var ranking = bots.concat([{ nombre: "Tú", nota: porcentajeUsuario, usuario: true }]);
  ranking.sort(function (a, b) {
    return b.nota - a.nota;
  });

  // Cálculo del percentil
  var debajo = ranking.filter(function (p) {
    return porcentajeUsuario > p.nota;
  }).length;
  
  var iguales = ranking.filter(function (p) {
    return porcentajeUsuario === p.nota;
  }).length;

  var percentil = Math.round(((debajo + (0.5 * iguales)) / ranking.length) * 100);

  // Asegurar que el percentil esté en el rango [1, 99]
  percentil = Math.max(1, Math.min(99, percentil));

  // Asignación de nivel según el percentil obtenido
  var nivel = "Muy bajo";
  if (percentil >= 90) nivel = "Excelente";
  else if (percentil >= 75) nivel = "Muy bueno";
  else if (percentil >= 60) nivel = "Bueno";
  else if (percentil >= 40) nivel = "Promedio";
  else if (percentil >= 20) nivel = "Bajo";

  return {
    ranking: ranking,
    percentil: percentil,
    nivel: nivel
  };
}
