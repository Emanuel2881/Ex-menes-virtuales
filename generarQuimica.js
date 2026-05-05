const fs = require('fs');

const AVOGADRO = 6.022e23;

function generarPregunta(id){
  const tipos = ["mol_moleculas","moleculas_mol","g_mol","mol_g","mixto"];
  const tipo = tipos[Math.floor(Math.random()*tipos.length)];

  const dificultades = ["facil","media","dificil"];
  const dificultad = dificultades[Math.floor(Math.random()*dificultades.length)];

  const mol = (Math.random()*5+1).toFixed(2);
  const moleculas = mol * AVOGADRO;

  return {
    id,
    tipo,
    dificultad,
    pregunta: `¿Cuántas moléculas hay en ${mol} mol de H2O?`,
    opciones: [
      (moleculas).toExponential(3),
      (moleculas*0.5).toExponential(3),
      (moleculas*2).toExponential(3),
      (moleculas*1.5).toExponential(3)
    ],
    correcta: 0,
    explicacion: "Se multiplica por el número de Avogadro."
  };
}

const preguntas = [];
for(let i=1;i<=200;i++){
  preguntas.push(generarPregunta(i));
}

const data = { estequiometria: preguntas };

fs.writeFileSync('./banco/quimica.json', JSON.stringify(data, null, 2));

console.log('Banco generado con 200 preguntas');