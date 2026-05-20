// ======================
// FINALIZAR EXAMEN
// ======================

function finalizarExamen(){

    // ocultar examen
    document.getElementById("examen")
    .classList.add("oculto");

    // mostrar resultados
    document.getElementById("resultados")
    .classList.remove("oculto");



    // ======================
    // CALCULAR NOTA
    // ======================

    const nota = Math.round(

        (puntaje / preguntas.length) * 100

    );



    // ======================
    // GUARDAR NOTA
    // ======================

    // CAMBIA ESTO EN CADA EXAMEN
    // ejemplo:
    // numerica-examen1
    // verbal-examen4

    const nombreExamen =
    "numerica-examen1";

    localStorage.setItem(

        nombreExamen,
        nota

    );



    // ======================
    // LISTAS DE EXÁMENES
    // ======================

    const examenesNumerica = [

        "numerica",

        "numerica-examen1",
        "numerica-examen2",
        "numerica-examen3",
        "numerica-examen4",
        "numerica-examen5",
        "numerica-examen6",
        "numerica-examen7",
        "numerica-examen8",
        "numerica-examen9"

    ];



    const examenesVerbal = [

        "verbal",

        "verbal-examen1",
        "verbal-examen2",
        "verbal-examen3",
        "verbal-examen4",
        "verbal-examen5",
        "verbal-examen6",
        "verbal-examen7",
        "verbal-examen8",
        "verbal-examen9",
        "verbal-examen10"

    ];



    // ======================
    // MEJORES NOTAS
    // ======================

    const mejorNumerica = Math.max(

        ...examenesNumerica.map(

            examen => Number(

                localStorage.getItem(examen)

            ) || 0

        )

    );



    const mejorVerbal = Math.max(

        ...examenesVerbal.map(

            examen => Number(

                localStorage.getItem(examen)

            ) || 0

        )

    );



    // ======================
    // PROMEDIO
    // ======================

    const promedio = Math.round(

        (mejorNumerica + mejorVerbal) / 2

    );



    // ======================
    // MOSTRAR DATOS
    // ======================

    document.getElementById("verbal")
    .textContent = mejorVerbal;

    document.getElementById("numerica")
    .textContent = mejorNumerica;

    document.getElementById("promedio")
    .textContent = promedio;



    // ======================
    // GENERAR BOTS
    // ======================

    const bots = [];

    for(let i = 1; i <= 40; i++){

        let notaBot;

        const r = Math.random();

        if(r < 0.10){

            notaBot = random(20,45);

        }

        else if(r < 0.65){

            notaBot = random(46,75);

        }

        else if(r < 0.92){

            notaBot = random(76,92);

        }

        else{

            notaBot = random(93,100);

        }

        bots.push({

            nombre:`Bot_${i}`,
            nota:notaBot

        });

    }



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



    ranking.sort(

        (a,b) => b.nota - a.nota

    );



    // ======================
    // PERCENTIL
    // ======================

    let debajo = ranking.filter(

        persona => promedio > persona.nota

    ).length;



    let iguales = ranking.filter(

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



    // ======================
    // NIVEL
    // ======================

    let nivel = "Muy bajo";

    if(percentil >= 95){

        nivel = "Sobresaliente";

    }

    else if(percentil >= 85){

        nivel = "Excelente";

    }

    else if(percentil >= 70){

        nivel = "Muy bueno";

    }

    else if(percentil >= 55){

        nivel = "Bueno";

    }

    else if(percentil >= 40){

        nivel = "Promedio";

    }

    else if(percentil >= 20){

        nivel = "Bajo";
    }



    document.getElementById("nivel")
    .textContent = nivel;



    // ======================
    // RENDER RANKING
    // ======================

    const rankingDiv =
    document.getElementById("ranking");

    rankingDiv.innerHTML = "";



    ranking.forEach((persona,index)=>{

        const fila =
        document.createElement("div");

        fila.classList.add("fila");



        if(persona.usuario){

            fila.classList.add("usuario");
        }



        fila.innerHTML = `

            <div class="posicion">

                <div class="numero">
                    #${index + 1}
                </div>

                <div class="nombre">
                    ${persona.nombre}
                </div>

            </div>

            <div class="nota">
                ${persona.nota}
            </div>

        `;

        rankingDiv.appendChild(fila);

    });

}



function random(min,max){

    return Math.floor(

        Math.random()
        * (max - min + 1)

    ) + min;

}
