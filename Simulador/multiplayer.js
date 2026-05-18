import {
    db
} from "./firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";



const crearBtn = document.getElementById("crearBtn");
const unirseBtn = document.getElementById("unirseBtn");



// ======================
// CREAR SALA
// ======================

crearBtn.addEventListener("click", async()=>{

    const nombre =
    document.getElementById("nombreCrear").value;

    if(nombre.trim() === ""){

        alert("Ingresa tu nombre");
        return;
    }

    const codigo = generarCodigo();

    await setDoc(doc(db,"salas",codigo),{

        codigo,

        jugador1:nombre,

        jugador2:"",

        estado:"esperando"

    });

    localStorage.setItem("codigoSala", codigo);
    localStorage.setItem("jugador", nombre);

    document.getElementById("codigoSala")
    .textContent = codigo;

});



// ======================
// UNIRSE A SALA
// ======================

unirseBtn.addEventListener("click", async()=>{

    const nombre =
    document.getElementById("nombreUnirse").value;

    const codigo =
    document.getElementById("codigoInput")
    .value
    .toUpperCase();

    const salaRef = doc(db,"salas",codigo);

    const salaSnap = await getDoc(salaRef);

    if(!salaSnap.exists()){

        alert("La sala no existe");
        return;
    }

    const datos = salaSnap.data();

    if(datos.jugador2 !== ""){

        alert("La sala ya está llena");
        return;
    }

    await updateDoc(salaRef,{

        jugador2:nombre,

        estado:"listo"

    });

    localStorage.setItem("codigoSala", codigo);
    localStorage.setItem("jugador", nombre);

    window.location.href = "Verbal.html";

});



// ======================
// GENERAR CÓDIGO
// ======================

function generarCodigo(){

    const letras =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let codigo = "";

    for(let i = 0; i < 4; i++){

        codigo += letras[
            Math.floor(
                Math.random() * letras.length
            )
        ];
    }

    return codigo;
}
