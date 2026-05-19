import {
   db,
   collection,
   addDoc
} from "./firebase.js";

import {
   doc,
   updateDoc,
   getDoc,
   onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";



// ======================
// DATOS
// ======================

const verbal =
Number(localStorage.getItem("verbal")) || 0;

const numerica =
Number(localStorage.getItem("numerica")) || 0;

const promedio =
Math.round((verbal + numerica) / 2);

const modo =
localStorage.getItem("modo");

const codigoSala =
localStorage.getItem("codigoSala");

const jugador =
localStorage.getItem("jugador");



// ======================
// MOSTRAR RESULTADOS
// ======================

document.getElementById("verbal")
.textContent = verbal;

document.getElementById("numerica")
.textContent = numerica;

document.getElementById("promedio")
.textContent = promedio;



// ======================
// GENERAR BOTS
// ======================

const bots = [];

for(let i = 1; i <= 30; i++){

    let nota;

    const r = Math.random();

    // pocos muy bajos
    if(r < 0.15){

        nota = random(30,55);

    }

    // mayoría promedio
    else if(r < 0.75){

        nota = random(56,80);

    }

    // buenos
    else if(r < 0.95){

        nota = random(81,92);

    }

    // pocos excelentes
    else{

        nota = random(93,100);
    }

    bots.push({

        nombre:`Bot_${i}`,

        nota

    });

}


const ranking = [

    ...bots,

    {

        nombre:"Tú",

        nota:promedio,

        usuario:true

    }

];


ranking.sort(
    (a,b) => b.nota - a.nota
);


let debajo =
ranking.filter(
    persona => promedio > persona.nota
).length;


let iguales =
ranking.filter(
    persona => promedio === persona.nota
).length;


let percentil = Math.round(

    (
        debajo + (0.5 * iguales)
    )

    / ranking.length

    * 100

);


if(percentil < 1){

    percentil = 1;
}

if(percentil > 99){

    percentil = 99;
}


document.getElementById("percentil")
.textContent = `${percentil}%`;



let nivel = "Muy bajo";

if(percentil >= 90){

    nivel = "Excelente";

}else if(percentil >= 75){

    nivel = "Muy bueno";

}else if(percentil >= 60){

    nivel = "Bueno";

}else if(percentil >= 40){

    nivel = "Promedio";

}else if(percentil >= 20){

    nivel = "Bajo";
}

document.getElementById("nivel")
.textContent = nivel;




guardarResultado();

async function guardarResultado(){

    try{

        await addDoc(

            collection(db, "rankings"),

            {

                nombre:
                jugador || "Invitado",

                verbal,

                numerica,

                promedio,

                percentil,

                nivel,

                modo:
                modo || "individual",

                fecha:
                new Date().toLocaleString()

            }

        );

        console.log("Resultado guardado");

    }catch(error){

        console.error(
            "Error guardando:",
            error
        );

    }

}


if(modo === "multiplayer"){

    guardarResultadoMultiplayer();

    leerRival();

}


async function guardarResultadoMultiplayer(){

    try{

        const salaRef =
        doc(db,"salas",codigoSala);

        const salaSnap =
        await getDoc(salaRef);

        const datos =
        salaSnap.data();

        if(datos.jugador1 === jugador){

            await updateDoc(salaRef,{

                resultado1:promedio

            });

        }else{

            await updateDoc(salaRef,{

                resultado2:promedio

            });

        }

        console.log(
            "Resultado multiplayer guardado"
        );

    }catch(error){

        console.error(error);

    }

}



function leerRival(){

    const salaRef =
    doc(db,"salas",codigoSala);

    onSnapshot(salaRef,(docSnap)=>{

        const datos =
        docSnap.data();

        let rival = null;

        if(datos.jugador1 === jugador){

            rival = datos.resultado2;

        }else{

            rival = datos.resultado1;
        }

        if(rival){

            agregarRival(rival);

        }

    });

}



function agregarRival(notaRival){

    const existe =
    ranking.some(
        p => p.nombre === "Rival"
    );

    if(existe) return;

    ranking.push({

        nombre:"Rival",

        nota:notaRival

    });

    ranking.sort(
        (a,b)=> b.nota - a.nota
    );


    let debajo =
    ranking.filter(
        persona => promedio > persona.nota
    ).length;

    let iguales =
    ranking.filter(
        persona => promedio === persona.nota
    ).length;

    percentil =
    Math.round(

        (
            debajo + (0.5 * iguales)
        )

        / ranking.length

        * 100

    );

    if(percentil < 1){

        percentil = 1;
    }

    if(percentil > 99){

        percentil = 99;
    }

    document.getElementById("percentil")
    .textContent = `${percentil}%`;



    renderRanking();

}



const rankingDiv =
document.getElementById("ranking");

renderRanking();

function renderRanking(){

    rankingDiv.innerHTML = "";

    ranking.forEach((persona,index)=>{

        const fila =
        document.createElement("div");

        fila.classList.add("fila");

        if(persona.usuario){

            fila.classList.add("usuario");
        }

        fila.innerHTML = `
        
            <span>
                #${index + 1}
                - ${persona.nombre}
            </span>

            <span>
                ${persona.nota}
            </span>
        
        `;

        rankingDiv.appendChild(fila);

    });

}


document.getElementById("reiniciarBtn")
.addEventListener("click",()=>{

    localStorage.clear();

    window.location.href =
    "../Simulador de habilidades.html";

});



function random(min,max){

    return Math.floor(

        Math.random()
        * (max - min + 1)

    ) + min;

}
