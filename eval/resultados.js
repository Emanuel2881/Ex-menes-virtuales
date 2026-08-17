// Helper aleatorio
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ======================
// 1. OBTENER DATOS LOCALES
// ======================
const verbal = Number(localStorage.getItem("verbal")) || 0;
const numerica = Number(localStorage.getItem("numerica")) || 0;
const promedio = Math.round((verbal + numerica) / 2);

// ======================
// 2. MOSTRAR RESULTADOS
// ======================
document.getElementById("verbal").textContent = verbal;
document.getElementById("numerica").textContent = numerica;
document.getElementById("promedio").textContent = promedio;

// ======================
// 3. GENERAR BOTS SIMULADOS
// ======================
const bots = [];

for(let i = 1; i <= 30; i++){
    let nota;
    const r = Math.random();

    if(r < 0.15){
        nota = random(30, 55);
    } else if(r < 0.75){
        nota = random(56, 80);
    } else if(r < 0.95){
        nota = random(81, 92);
    } else {
        nota = random(93, 100);
    }

    bots.push({
        nombre: `Bot_${i}`,
        nota
    });
}

const ranking = [
    ...bots,
    {
        nombre: "Tú",
        nota: promedio,
        usuario: true
    }
];

ranking.sort((a, b) => b.nota - a.nota);

// ======================
// 4. CALCULAR PERCENTIL Y NIVEL
// ======================
let debajo = ranking.filter(persona => promedio > persona.nota).length;
let iguales = ranking.filter(persona => promedio === persona.nota).length;

let percentil = Math.round(((debajo + (0.5 * iguales)) / ranking.length) * 100);

if(percentil < 1) percentil = 1;
if(percentil > 99) percentil = 99;

document.getElementById("percentil").textContent = `${percentil}%`;

let nivel = "Muy bajo";
if(percentil >= 90){
    nivel = "Excelente";
} else if(percentil >= 75){
    nivel = "Muy bueno";
} else if(percentil >= 60){
    nivel = "Bueno";
} else if(percentil >= 40){
    nivel = "Promedio";
} else if(percentil >= 20){
    nivel = "Bajo";
}

document.getElementById("nivel").textContent = nivel;

// ======================
// 5. RENDERIZAR TABLA DE RANKING
// ======================
const rankingDiv = document.getElementById("ranking");

function renderRanking(){
    rankingDiv.innerHTML = "";

    ranking.forEach((persona, index) => {
        const fila = document.createElement("div");
        fila.classList.add("fila");

        if(persona.usuario){
            fila.classList.add("usuario");
        }

        fila.innerHTML = `
            <span>#${index + 1} - ${persona.nombre}</span>
            <span>${persona.nota}</span>
        `;

        rankingDiv.appendChild(fila);
    });
}

renderRanking();

// ======================
// 6. BOTÓN REINICIAR
// ======================
document.getElementById("reiniciarBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "verbal-eval-1.html"; // o la página principal de inicio
});
