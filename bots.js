export function generarBots(porcentajeUsuario) {
  var rangosBots = [
    {min:50,max:64},{min:50,max:64},
    {min:65,max:74},{min:65,max:74},{min:65,max:74},{min:65,max:74},
    {min:75,max:84},{min:75,max:84},{min:75,max:84},{min:75,max:84},{min:75,max:84},{min:75,max:84},{min:75,max:84},{min:75,max:84},{min:75,max:84},
    {min:85,max:94},{min:85,max:94},{min:85,max:94},{min:85,max:94},{min:85,max:94},{min:85,max:94},{min:85,max:94},{min:85,max:94},{min:85,max:94},{min:85,max:94},
    {min:95,max:100},{min:95,max:100},{min:95,max:100},{min:95,max:100},{min:95,max:100}
  ];
  
  rangosBots.sort(function() { return Math.random() - 0.5; });

  var bots = [];
  for (var i = 1; i <= 30; i++) {
    var rango = rangosBots[i - 1];
    bots.push({
      nombre: "Bot_" + i,
      nota: Math.floor(Math.random() * (rango.max - rango.min + 1)) + rango.min
    });
  }

  var ranking = bots.concat([{ nombre: "Tú", nota: porcentajeUsuario, usuario: true }]);
  ranking.sort(function(a, b) { return b.nota - a.nota; });

  var debajo = ranking.filter(function(p) { return porcentajeUsuario > p.nota; }).length;
  var iguales = ranking.filter(function(p) { return porcentajeUsuario === p.nota; }).length;
  var percentil = Math.round(((debajo + (0.5 * iguales)) / ranking.length) * 100);

  percentil = Math.max(1, Math.min(99, percentil));

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
