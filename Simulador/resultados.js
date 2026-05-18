import { db } from "./firebase.js";
const verbal = Number(localStorage.getItem("verbal")) || 0;
const numerica = Number(localStorage.getItem("numerica")) || 0;

const promedio = Math.round((verbal + numerica) / 2);

document.getElementById("verbal").textContent = verbal;
document.getElementById("numerica").textContent = numerica;
document.getElementById("promedio").textContent = promedio;



// ======================
// GENERAR BOTS
// ======================

const bots = [];

for(let i = 1; i <= 30; i++){

    let nota;

    // distribución más realista
    if(i <= 8){

        nota = random(40,60);

    }else if(i <= 20){

        nota = random(61,80);

    }else if(i <= 28){

        nota = random(81,92);

    }else{

        nota = random(93,100);
    }

    bots.push({
        nombre:`Bot_${i}`,
        nota
    });
}



// ======================
// PERCENTIL
// ======================

const debajo = bots.filter(bot => promedio > bot.nota).length;

let percentil = Math.round((debajo / bots.length) * 100);

// mínimo 50
if(percentil < 50){
    percentil = 50;
}

document.getElementById("percentil").textContent = `${percentil}%`;



// ======================
// NIVEL
// ======================

let nivel = "Promedio";

if(percentil >= 90){

    nivel = "Excelente";

}else if(percentil >= 75){

    nivel = "Muy bueno";

}else if(percentil >= 60){

    nivel = "Bueno";
}

document.getElementById("nivel").textContent = nivel;



// ======================
// RANKING
// ======================

const ranking = [

    ...bots,

    {
        nombre:"Tú",
        nota:promedio,
        usuario:true
    }

];



// ordenar de mayor a menor
ranking.sort((a,b) => b.nota - a.nota);



// ======================
// MOSTRAR RANKING
// ======================

const rankingDiv = document.getElementById("ranking");

ranking.forEach((persona,index)=>{

    const fila = document.createElement("div");

    fila.classList.add("fila");

    if(persona.usuario){
        fila.classList.add("usuario");
    }

    fila.innerHTML = `
    
        <span>
            #${index + 1} - ${persona.nombre}
        </span>

        <span>
            ${persona.nota}
        </span>
    
    `;

    rankingDiv.appendChild(fila);

});



// ======================
// REINICIAR
// ======================

document.getElementById("reiniciarBtn").addEventListener("click",()=>{

    localStorage.clear();

    window.location.href = "../index.html";

});



// ======================
// RANDOM
// ======================

function random(min,max){

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}
