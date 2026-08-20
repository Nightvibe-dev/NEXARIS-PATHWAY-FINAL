// ======================================================
// NEXARIS PATHWAY v3.0
// Sistema Principal
// ======================================================

"use strict";

// ======================================================
// CONFIGURACIÓN
// ======================================================

const CONFIG = {

    VERSION: "3.0",

    API_URL: "https://nexaris-pathway-api.onrender.com/chat",

    STORAGE: "perfilNexaris"

};

// ======================================================
// ESTADO GLOBAL
// =====================================================

const APP = {

    perfil: null,

    puntos: {
        creativo: 0,
        tecnologico: 0,
        cientifico: 0,
        social: 0
    },

    estadisticas: {
        carrerasVisitadas: 0,
        consultasIA: 0,
        minutosUso: 0
    }

};

// ======================================================
// UTILIDADES
// ======================================================

function $(id) {

    return document.getElementById(id);

}

function guardarPerfil() {

    if (!APP.perfil) return;

    APP.perfil.estadisticas = APP.estadisticas;

    localStorage.setItem(
        CONFIG.STORAGE,
        JSON.stringify(APP.perfil)
    );

}

function cargarPerfil() {

    const datos = localStorage.getItem(CONFIG.STORAGE);

    APP.perfil = datos ? JSON.parse(datos) : null;

    if (APP.perfil) {

        APP.estadisticas = APP.perfil.estadisticas || {
            carrerasVisitadas: 0,
            consultasIA: 0,
            minutosUso: 0
        };

    }

}

// ======================================================
// NAVEGACIÓN
// ======================================================

function mostrar(seccion) {

    document

        .querySelectorAll(".panel")

        .forEach(panel => panel.classList.add("oculto"));

    const destino = $(seccion);

    if (destino) {

        destino.classList.remove("oculto");

    }

}

// ======================================================
// REGISTRO
// ======================================================

function entrarNexaris() {

    const nombre = $("nombreUsuario").value.trim();

    const correo = $("correoUsuario").value.trim();

    const grado = $("gradoUsuario").value;

    if (

        !nombre ||

        !correo ||

        grado === "Selecciona tu grado"

    ) {

        alert("Completa todos los campos.");

        return;

    }

    APP.perfil = {

        nombre,
        correo,
        grado,

        fechaRegistro: new Date().toLocaleDateString("es-PE"),

        version: CONFIG.VERSION,

        nivel: 1,

        xp: 0,

        carrerasFavoritas: [],

        testCompletado: false,

        estadisticas: {
            carrerasVisitadas: 0,
            consultasIA: 0,
            minutosUso: 0
        }

    };

    guardarPerfil();

    iniciarDashboard();

    agregarXP(10);

}


// ======================================================
// PERFIL
// ======================================================
function actualizarPerfil() {

    if (!APP.perfil) return;

    if ($("mostrarUsuario"))

        $("mostrarUsuario").textContent = APP.perfil.nombre;

    if ($("mostrarCorreo"))

        $("mostrarCorreo").textContent = APP.perfil.correo;

    if ($("usuarioTop"))

        $("usuarioTop").textContent = "👤 " + APP.perfil.nombre;

    if ($("nombreSidebar"))

        $("nombreSidebar").textContent = APP.perfil.nombre;

}

// ======================================================
// SALUDO
// ======================================================

function saludo() {

    if (!APP.perfil) return;

    const frase = $("fraseInicio");

    if (frase) {

        const hora = new Date().getHours();

        let mensaje = "";

        if (hora < 12) {

            mensaje = "☀️ Buenos días";

        } else if (hora < 18) {

            mensaje = "🌤 Buenas tardes";

        } else {

            mensaje = "🌙 Buenas noches";

        }

        frase.textContent =
            `${mensaje}, ${APP.perfil.nombre}. ¡Listo para descubrir tu futuro?`;

    }

}

// ======================================================
// DASHBOARD
// ======================================================

function iniciarDashboard() {

    $("registro").style.display = "none";

    document.querySelector(".dashboard").style.display = "grid";

    actualizarPerfil();

    saludo();

    actualizarDashboard();

    actualizarXP();

    mostrar("inicio");

}

// ======================================================
// ESTADÍSTICAS
// ======================================================

function sumarCarrera() {

    APP.estadisticas.carrerasVisitadas++;

    guardarPerfil();

    actualizarDashboard();

}

function sumarConsultaIA() {

    APP.estadisticas.consultasIA++;

    guardarPerfil();

    actualizarDashboard();

}

// ======================================================
// ACTUALIZAR ESTADÍSTICAS
// ======================================================

function actualizarDashboard() {

    if (!APP.perfil) return;

    if ($("contadorCarreras")) {
        $("contadorCarreras").textContent = APP.estadisticas.carrerasVisitadas;
    }

    if ($("contadorIA")) {
        $("contadorIA").textContent = APP.estadisticas.consultasIA;
    }

    if ($("tiempoUso")) {
        $("tiempoUso").textContent = APP.estadisticas.minutosUso + " min";
    }

    if ($("estadoTestPanel")) {
        $("estadoTestPanel").textContent =
            APP.perfil.testCompletado ? "Completado ✅" : "Pendiente";
    }

    if ($("nivelUsuario")) {
        $("nivelUsuario").textContent = APP.perfil.nivel;
    }

    if ($("xpUsuario")) {
        $("xpUsuario").textContent = APP.perfil.xp + " / 100 XP";
    }

}

// ======================================================
// SISTEMA XP
// ======================================================

function agregarXP(cantidad) {

    if (!APP.perfil) return;

    APP.perfil.xp += cantidad;

    while (APP.perfil.xp >= 100) {

        APP.perfil.xp -= 100;
        APP.perfil.nivel++;

    }

    guardarPerfil();

    actualizarXP();

}

function actualizarXP() {

    if (!APP.perfil) return;

    if ($("nivelUsuario")) {

        $("nivelUsuario").textContent = APP.perfil.nivel;

    }

    if ($("xpUsuario")) {

        $("xpUsuario").textContent =
            APP.perfil.xp + " / 100 XP";

    }

    const barra = document.querySelector(".xp-fill");

    if (barra) {

        barra.style.width = APP.perfil.xp + "%";

    }

}

// ======================================================
// TEST VOCACIONAL NEXARIS
// ======================================================

const TEST_VOCACIONAL = [

    {
        pregunta: "¿Qué actividad te resulta más interesante?",

        opciones: [
            {
                texto: "Crear aplicaciones, páginas web o sistemas",
                perfil: "tecnologico"
            },
            {
                texto: "Diseñar dibujos, imágenes o contenido visual",
                perfil: "creativo"
            },
            {
                texto: "Investigar cómo funcionan las cosas",
                perfil: "cientifico"
            },
            {
                texto: "Ayudar, orientar o trabajar con personas",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "Cuando tienes un problema difícil, ¿qué haces primero?",

        opciones: [
            {
                texto: "Busco una solución lógica y estructurada",
                perfil: "tecnologico"
            },
            {
                texto: "Pienso en una solución diferente o creativa",
                perfil: "creativo"
            },
            {
                texto: "Investigo información antes de decidir",
                perfil: "cientifico"
            },
            {
                texto: "Pregunto a otras personas y considero sus opiniones",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué proyecto preferirías realizar?",

        opciones: [
            {
                texto: "Crear un videojuego o aplicación",
                perfil: "tecnologico"
            },
            {
                texto: "Diseñar una campaña visual",
                perfil: "creativo"
            },
            {
                texto: "Realizar un experimento científico",
                perfil: "cientifico"
            },
            {
                texto: "Crear una campaña para ayudar a la comunidad",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué asignatura suele llamarte más la atención?",

        opciones: [
            {
                texto: "Computación o tecnología",
                perfil: "tecnologico"
            },
            {
                texto: "Arte o comunicación",
                perfil: "creativo"
            },
            {
                texto: "Ciencia o matemática",
                perfil: "cientifico"
            },
            {
                texto: "Ciencias sociales o comunicación",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué habilidad te gustaría desarrollar?",

        opciones: [
            {
                texto: "Programación y tecnología",
                perfil: "tecnologico"
            },
            {
                texto: "Diseño e imaginación",
                perfil: "creativo"
            },
            {
                texto: "Investigación y análisis",
                perfil: "cientifico"
            },
            {
                texto: "Comunicación y liderazgo",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Cómo prefieres trabajar?",

        opciones: [
            {
                texto: "Construyendo soluciones con tecnología",
                perfil: "tecnologico"
            },
            {
                texto: "Creando y diseñando",
                perfil: "creativo"
            },
            {
                texto: "Analizando información y datos",
                perfil: "cientifico"
            },
            {
                texto: "Colaborando y ayudando a otros",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué problema de tu comunidad te gustaría ayudar a resolver?",

        opciones: [
            {
                texto: "Problemas relacionados con tecnología",
                perfil: "tecnologico"
            },
            {
                texto: "Problemas de comunicación y expresión",
                perfil: "creativo"
            },
            {
                texto: "Problemas relacionados con ciencia o ambiente",
                perfil: "cientifico"
            },
            {
                texto: "Problemas sociales o educativos",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué tipo de resultado te produciría más satisfacción?",

        opciones: [
            {
                texto: "Ver funcionando algo que programé",
                perfil: "tecnologico"
            },
            {
                texto: "Ver una creación visual terminada",
                perfil: "creativo"
            },
            {
                texto: "Descubrir o demostrar algo",
                perfil: "cientifico"
            },
            {
                texto: "Saber que ayudé a alguien",
                perfil: "social"
            }
        ]
    }

];

let preguntaActual = 0;


// ======================================================
// INICIAR TEST
// ======================================================

function iniciarTest() {

    reiniciarTest();

    preguntaActual = 0;

    mostrarPregunta();

}


// ======================================================
// REINICIAR TEST
// ======================================================

function reiniciarTest() {

    APP.puntos = {

        creativo: 0,
        tecnologico: 0,
        cientifico: 0,
        social: 0

    };

    const resultado = $("resultado");

    if (resultado) {

        resultado.innerHTML = "";

    }

}


// ======================================================
// MOSTRAR PREGUNTA
// ======================================================

function mostrarPregunta() {

    const resultado = $("resultado");

    if (!resultado) return;


    if (preguntaActual >= TEST_VOCACIONAL.length) {

        finalizarTest();

        return;

    }


    const pregunta = TEST_VOCACIONAL[preguntaActual];


    resultado.innerHTML = `

        <div class="test-question">

            <h2>
                Pregunta ${preguntaActual + 1}
                de ${TEST_VOCACIONAL.length}
            </h2>

            <h3>
                ${pregunta.pregunta}
            </h3>

            <div class="test-options">

                ${pregunta.opciones.map((opcion, indice) => `

                    <button
                        onclick="responderTest('${opcion.perfil}')"
                    >
                        ${indice + 1}. ${opcion.texto}
                    </button>

                `).join("")}

            </div>

        </div>

    `;

}


// ======================================================
// RESPONDER TEST
// ======================================================

function responderTest(perfil) {

    if (APP.puntos[perfil] === undefined) return;


    APP.puntos[perfil]++;


    preguntaActual++;


    agregarXP(3);


    mostrarPregunta();

}


// ======================================================
// FINALIZAR TEST
// ======================================================

function finalizarTest() {

    if (!APP.perfil) return;


    APP.perfil.testCompletado = true;


    const resultados = calcularPerfil();


    APP.perfil.perfilVocacional = resultados;


    guardarPerfil();


    actualizarDashboard();


    mostrarResultado(resultados);

}


// ======================================================
// CALCULAR PERFIL
// ======================================================

function calcularPerfil() {

    const puntos = APP.puntos;


    const total =

        puntos.creativo +

        puntos.tecnologico +

        puntos.cientifico +

        puntos.social;


    const porcentaje = {


        creativo: total
            ? Math.round((puntos.creativo / total) * 100)
            : 0,


        tecnologico: total
            ? Math.round((puntos.tecnologico / total) * 100)
            : 0,


        cientifico: total
            ? Math.round((puntos.cientifico / total) * 100)
            : 0,


        social: total
            ? Math.round((puntos.social / total) * 100)
            : 0

    };


    const perfiles = [

        {
            id: "tecnologico",
            nombre: "Tecnológico",
            icono: "💻",
            puntos: puntos.tecnologico
        },

        {
            id: "creativo",
            nombre: "Creativo",
            icono: "🎨",
            puntos: puntos.creativo
        },

        {
            id: "cientifico",
            nombre: "Científico",
            icono: "🔬",
            puntos: puntos.cientifico
        },

        {
            id: "social",
            nombre: "Social",
            icono: "🤝",
            puntos: puntos.social
        }

    ];


    perfiles.sort((a, b) => b.puntos - a.puntos);


    return {

        dominante: perfiles[0],

        segundo: perfiles[1],

        porcentajes: porcentaje,

        puntos: { ...puntos }

    };

}


// ======================================================
// MOSTRAR RESULTADO
// ======================================================

function mostrarResultado(perfil) {

    const resultado = $("resultado");

    if (!resultado) return;

    const carreras = obtenerCarrerasRecomendadas(perfil);

    resultado.innerHTML = `

        <div class="test-result">

            <h2>
                🎯 Tu perfil vocacional
            </h2>

            <h1>
                ${perfil.dominante.icono}
                ${perfil.dominante.nombre}
            </h1>

            <div class="perfil-barras">

                <p>
                    💻 Tecnológico:
                    <strong>
                        ${perfil.porcentajes.tecnologico}%
                    </strong>
                </p>

                <p>
                    🎨 Creativo:
                    <strong>
                        ${perfil.porcentajes.creativo}%
                    </strong>
                </p>

                <p>
                    🔬 Científico:
                    <strong>
                        ${perfil.porcentajes.cientifico}%
                    </strong>
                </p>

                <p>
                    🤝 Social:
                    <strong>
                        ${perfil.porcentajes.social}%
                    </strong>
                </p>

            </div>

            <h3>
                🎓 Carreras compatibles
            </h3>

            <div class="recommended-careers">

                ${carreras.map(carrera => `

                    <button
                        onclick="verProfesion('${carrera.id}')"
                    >
                        ${carrera.icono}
                        ${carrera.nombre}
                    </button>

                `).join("")}

            </div>

            <button
                class="primary"
                onclick="iniciarTest()"
            >
                🔄 Repetir test
            </button>

        </div>

    `;

}


// ======================================================
// VER PROFESIÓN
// ======================================================

function verProfesion(id) {

    let carreraEncontrada = null;

    for (const categoria of CARRERAS) {

        const carrera = categoria.carreras.find(
            c => c.id === id
        );

        if (carrera) {

            carreraEncontrada = carrera;
            break;

        }

    }

    if (!carreraEncontrada) {

        console.error("Carrera no encontrada:", id);
        return;

    }

    APP.estadisticas.carrerasVisitadas++;

    agregarXP(5);

    guardarPerfil();

    const resultado = $("resultado");

    if (!resultado) return;

    resultado.innerHTML = `

        <div class="career-detail">

            <h2>
                ${carreraEncontrada.icono}
                ${carreraEncontrada.nombre}
            </h2>

            <p>
                ${carreraEncontrada.descripcion}
            </p>

            <h3>🌐 Ramas profesionales</h3>

            <ul>
                ${carreraEncontrada.ramas
            .map(rama => `<li>${rama}</li>`)
            .join("")}
            </ul>

            <h3>🧠 Habilidades</h3>

            <ul>
                ${carreraEncontrada.habilidades
            .map(habilidad => `<li>${habilidad}</li>`)
            .join("")}
            </ul>

            <h3>🎓 Universidades</h3>

            <ul>
                ${carreraEncontrada.universidades
            .map(u => `<li>${u}</li>`)
            .join("")}
            </ul>

            <h3>📚 Cursos recomendados</h3>

            <ul>
                ${carreraEncontrada.cursos
            .map(curso => `<li>${curso}</li>`)
            .join("")}
            </ul>

            <h3>🚀 Ideas de proyectos</h3>

            <ul>
                ${carreraEncontrada.proyectos
            .map(proyecto => `<li>${proyecto}</li>`)
            .join("")}
            </ul>

            <p>
                💰 Salario referencial:
                <strong>
                    ${carreraEncontrada.salario}
                </strong>
            </p>

            <button
                class="primary"
                onclick="mostrarResultado(APP.perfil.perfilVocacional)"
            >
                ← Volver a resultados
            </button>

        </div>

    `;

    actualizarDashboard();

}


// ======================================================
// RECOMENDADOR DE CARRERAS
// ======================================================

function obtenerCarrerasRecomendadas(perfil) {

    const dominante = perfil.dominante.id;


    const mapa = {

        tecnologico: [
            "software",
            "ciberseguridad",
            "inteligencia-artificial",
            "robotica",
            "mecatronica"
        ],

        creativo: [
            "diseno-grafico",
            "uxui",
            "animacion"
        ],

        cientifico: [
            "inteligencia-artificial",
            "medicina",
            "enfermeria",
            "civil",
            "mecatronica"
        ],

        social: [
            "psicologia",
            "derecho",
            "administracion",
            "enfermeria",
            "contabilidad"
        ]

    };


    const ids = mapa[dominante] || [];


    const recomendadas = [];


    for (const categoria of CARRERAS) {

        for (const carrera of categoria.carreras) {

            if (ids.includes(carrera.id)) {

                recomendadas.push(carrera);

            }

        }

    }


    return recomendadas;

}

// ======================================================
// BIBLIOTECA DE CARRERAS
// NEXARIS PATHWAY v3.0
// ======================================================

const CARRERAS = [

    // ==================================================
    // TECNOLOGÍA
    // ==================================================

    {
        categoria: "Tecnología",

        carreras: [

            {
                id: "software",
                nombre: "Ingeniería de Software",
                icono: "💻",

                descripcion:
                    "Diseña, desarrolla y mantiene aplicaciones, plataformas, videojuegos y sistemas informáticos.",

                ramas: [
                    "Frontend",
                    "Backend",
                    "Full Stack",
                    "Desarrollo móvil",
                    "Videojuegos",
                    "DevOps",
                    "Cloud Computing",
                    "QA y Testing"
                ],

                habilidades: [
                    "Lógica",
                    "Programación",
                    "Resolución de problemas",
                    "Trabajo en equipo",
                    "Pensamiento estructurado"
                ],

                universidades: [
                    "UNI",
                    "PUCP",
                    "UTEC",
                    "UPC"
                ],

                cursos: [
                    "HTML y CSS",
                    "JavaScript",
                    "Python",
                    "Git y GitHub",
                    "Node.js"
                ],

                proyectos: [
                    "Crear una página web",
                    "Crear una aplicación",
                    "Crear un videojuego",
                    "Crear un bot"
                ],

                salario: "S/ 3,500 - S/ 9,000"
            },


            {
                id: "ciberseguridad",
                nombre: "Ciberseguridad",
                icono: "🔐",

                descripcion:
                    "Protege sistemas, redes, aplicaciones y datos frente a amenazas y ataques informáticos.",

                ramas: [
                    "Ethical Hacking",
                    "Pentesting",
                    "Seguridad Web",
                    "Seguridad de Redes",
                    "Forense Digital",
                    "SOC Analyst",
                    "Seguridad Cloud"
                ],

                habilidades: [
                    "Pensamiento analítico",
                    "Redes",
                    "Linux",
                    "Resolución de problemas",
                    "Ética profesional"
                ],

                universidades: [
                    "UNI",
                    "UTEC",
                    "UPC"
                ],

                cursos: [
                    "Redes",
                    "Linux",
                    "Seguridad informática",
                    "Ethical Hacking"
                ],

                proyectos: [
                    "Crear un laboratorio de seguridad",
                    "Analizar una red",
                    "Crear un sistema de protección",
                    "Realizar una auditoría"
                ],

                salario: "S/ 4,000 - S/ 12,000"
            },


            {
                id: "inteligencia-artificial",
                nombre: "Inteligencia Artificial",
                icono: "🤖",

                descripcion:
                    "Desarrolla sistemas capaces de analizar información, reconocer patrones y realizar tareas inteligentes.",

                ramas: [
                    "Machine Learning",
                    "Deep Learning",
                    "Procesamiento de lenguaje natural",
                    "Visión artificial",
                    "Robótica inteligente",
                    "IA generativa",
                    "Ciencia de datos"
                ],

                habilidades: [
                    "Matemática",
                    "Programación",
                    "Pensamiento lógico",
                    "Análisis de datos",
                    "Creatividad"
                ],

                universidades: [
                    "UTEC",
                    "PUCP",
                    "UNI"
                ],

                cursos: [
                    "Python",
                    "Matemática",
                    "Machine Learning",
                    "Deep Learning"
                ],

                proyectos: [
                    "Crear un chatbot",
                    "Entrenar un modelo",
                    "Crear un sistema de recomendación",
                    "Analizar datos"
                ],

                salario: "S/ 5,000 - S/ 15,000"
            },


            {
                id: "robotica",
                nombre: "Robótica",
                icono: "🦾",

                descripcion:
                    "Combina programación, electrónica y mecánica para diseñar sistemas y robots capaces de realizar tareas.",

                ramas: [
                    "Robótica industrial",
                    "Robótica educativa",
                    "Automatización",
                    "Robótica móvil",
                    "Drones",
                    "Sistemas autónomos"
                ],

                habilidades: [
                    "Matemática",
                    "Programación",
                    "Electrónica",
                    "Creatividad",
                    "Resolución de problemas"
                ],

                universidades: [
                    "UNI",
                    "UTEC",
                    "PUCP"
                ],

                cursos: [
                    "Arduino",
                    "Electrónica",
                    "Python",
                    "Programación"
                ],

                proyectos: [
                    "Construir un robot",
                    "Crear un brazo robótico",
                    "Automatizar una tarea",
                    "Crear un vehículo autónomo"
                ],

                salario: "S/ 3,500 - S/ 10,000"
            }

        ]
    },


    // ==================================================
    // DISEÑO Y CREATIVIDAD
    // ==================================================

    {
        categoria: "Diseño y Creatividad",

        carreras: [

            {
                id: "diseno-grafico",
                nombre: "Diseño Gráfico",
                icono: "🎨",

                descripcion:
                    "Comunica ideas mediante elementos visuales, identidad gráfica y composición.",

                ramas: [
                    "Branding",
                    "Identidad visual",
                    "Ilustración",
                    "Diseño editorial",
                    "Publicidad",
                    "Diseño digital"
                ],

                habilidades: [
                    "Creatividad",
                    "Composición",
                    "Comunicación visual",
                    "Tipografía",
                    "Pensamiento creativo"
                ],

                universidades: [
                    "PUCP",
                    "UPC",
                    "USIL"
                ],

                cursos: [
                    "Diseño visual",
                    "Illustrator",
                    "Photoshop",
                    "Tipografía"
                ],

                proyectos: [
                    "Crear una identidad de marca",
                    "Diseñar un afiche",
                    "Crear una revista",
                    "Diseñar una campaña"
                ],

                salario: "S/ 2,000 - S/ 7,000"
            },


            {
                id: "uxui",
                nombre: "Diseño UX/UI",
                icono: "🖌️",

                descripcion:
                    "Diseña experiencias digitales fáciles de utilizar, accesibles y centradas en las necesidades de las personas.",

                ramas: [
                    "UX Research",
                    "UI Design",
                    "Product Design",
                    "Interaction Design",
                    "Design Systems"
                ],

                habilidades: [
                    "Empatía",
                    "Creatividad",
                    "Investigación",
                    "Diseño visual",
                    "Resolución de problemas"
                ],

                universidades: [
                    "PUCP",
                    "UPC",
                    "UTEC"
                ],

                cursos: [
                    "Figma",
                    "UX Research",
                    "Diseño de interfaces",
                    "Prototipado"
                ],

                proyectos: [
                    "Diseñar una aplicación",
                    "Crear un prototipo",
                    "Realizar una investigación UX",
                    "Rediseñar una página web"
                ],

                salario: "S/ 2,500 - S/ 8,000"
            },


            {
                id: "animacion",
                nombre: "Animación Digital",
                icono: "🎬",

                descripcion:
                    "Crea personajes, escenas y contenidos audiovisuales mediante técnicas de animación.",

                ramas: [
                    "Animación 2D",
                    "Animación 3D",
                    "Motion Graphics",
                    "Modelado 3D",
                    "Efectos visuales"
                ],

                habilidades: [
                    "Dibujo",
                    "Creatividad",
                    "Narrativa",
                    "Diseño visual",
                    "Paciencia"
                ],

                universidades: [
                    "PUCP",
                    "UPC",
                    "Toulouse Lautrec"
                ],

                cursos: [
                    "Blender",
                    "Animación 2D",
                    "Modelado 3D",
                    "Motion Graphics"
                ],

                proyectos: [
                    "Crear una animación corta",
                    "Modelar un personaje",
                    "Crear un cortometraje",
                    "Crear una escena 3D"
                ],

                salario: "S/ 2,000 - S/ 7,000"
            }

        ]
    },


    // ==================================================
    // CIENCIAS DE LA SALUD
    // ==================================================

    {
        categoria: "Ciencias de la Salud",

        carreras: [

            {
                id: "medicina",
                nombre: "Medicina",
                icono: "🩺",

                descripcion:
                    "Estudia la prevención, diagnóstico y tratamiento de enfermedades y condiciones de salud.",

                ramas: [
                    "Medicina interna",
                    "Cirugía",
                    "Pediatría",
                    "Cardiología",
                    "Neurología",
                    "Psiquiatría"
                ],

                habilidades: [
                    "Disciplina",
                    "Empatía",
                    "Pensamiento científico",
                    "Responsabilidad",
                    "Toma de decisiones"
                ],

                universidades: [
                    "UNMSM",
                    "UPCH",
                    "UPC"
                ],

                cursos: [
                    "Biología",
                    "Química",
                    "Anatomía",
                    "Fisiología"
                ],

                proyectos: [
                    "Investigación científica",
                    "Campañas de prevención",
                    "Educación en salud"
                ],

                salario: "Variable según especialidad y experiencia"
            },


            {
                id: "psicologia",
                nombre: "Psicología",
                icono: "🧠",

                descripcion:
                    "Estudia el comportamiento y los procesos mentales para comprender y apoyar a las personas.",

                ramas: [
                    "Psicología clínica",
                    "Psicología educativa",
                    "Psicología organizacional",
                    "Psicología social",
                    "Neuropsicología"
                ],

                habilidades: [
                    "Empatía",
                    "Comunicación",
                    "Escucha activa",
                    "Análisis",
                    "Responsabilidad"
                ],

                universidades: [
                    "UNMSM",
                    "PUCP",
                    "UPCH"
                ],

                cursos: [
                    "Psicología general",
                    "Desarrollo humano",
                    "Neurociencia",
                    "Investigación"
                ],

                proyectos: [
                    "Campañas educativas",
                    "Investigación social",
                    "Programas de orientación"
                ],

                salario: "Variable según especialidad y experiencia"
            },


            {
                id: "enfermeria",
                nombre: "Enfermería",
                icono: "💉",

                descripcion:
                    "Proporciona cuidados de salud y participa en la prevención, atención y recuperación de pacientes.",

                ramas: [
                    "Enfermería clínica",
                    "Enfermería pediátrica",
                    "Emergencias",
                    "Salud comunitaria",
                    "Cuidados intensivos"
                ],

                habilidades: [
                    "Empatía",
                    "Responsabilidad",
                    "Trabajo en equipo",
                    "Organización",
                    "Comunicación"
                ],

                universidades: [
                    "UNMSM",
                    "UPCH"
                ],

                cursos: [
                    "Biología",
                    "Anatomía",
                    "Primeros auxilios",
                    "Salud comunitaria"
                ],

                proyectos: [
                    "Campañas de prevención",
                    "Educación sanitaria",
                    "Promoción de hábitos saludables"
                ],

                salario: "Variable según institución y experiencia"
            }

        ]
    },


    // ==================================================
    // INGENIERÍA
    // ==================================================

    {
        categoria: "Ingeniería",

        carreras: [

            {
                id: "civil",
                nombre: "Ingeniería Civil",
                icono: "🏗️",

                descripcion:
                    "Diseña, construye y supervisa infraestructura como edificios, carreteras, puentes y sistemas hidráulicos.",

                ramas: [
                    "Estructuras",
                    "Construcción",
                    "Geotecnia",
                    "Hidráulica",
                    "Transportes",
                    "Gestión de proyectos"
                ],

                habilidades: [
                    "Matemática",
                    "Física",
                    "Planificación",
                    "Resolución de problemas",
                    "Trabajo en equipo"
                ],

                universidades: [
                    "UNI",
                    "PUCP",
                    "UNMSM"
                ],

                cursos: [
                    "Matemática",
                    "Física",
                    "AutoCAD",
                    "Estructuras"
                ],

                proyectos: [
                    "Diseñar un puente",
                    "Diseñar una estructura",
                    "Modelar una vivienda",
                    "Proyecto hidráulico"
                ],

                salario: "S/ 3,000 - S/ 10,000"
            },


            {
                id: "industrial",
                nombre: "Ingeniería Industrial",
                icono: "⚙️",

                descripcion:
                    "Optimiza procesos, recursos y sistemas para mejorar la productividad de organizaciones.",

                ramas: [
                    "Gestión de operaciones",
                    "Logística",
                    "Calidad",
                    "Procesos",
                    "Gestión empresarial",
                    "Seguridad industrial"
                ],

                habilidades: [
                    "Análisis",
                    "Matemática",
                    "Organización",
                    "Liderazgo",
                    "Gestión"
                ],

                universidades: [
                    "UNI",
                    "PUCP",
                    "UPC"
                ],

                cursos: [
                    "Excel",
                    "Estadística",
                    "Gestión de procesos",
                    "Logística"
                ],

                proyectos: [
                    "Optimizar un proceso",
                    "Diseñar un sistema logístico",
                    "Analizar una empresa"
                ],

                salario: "S/ 3,000 - S/ 10,000"
            },


            {
                id: "mecatronica",
                nombre: "Ingeniería Mecatrónica",
                icono: "⚡",

                descripcion:
                    "Integra mecánica, electrónica, programación y control para desarrollar sistemas automatizados.",

                ramas: [
                    "Automatización",
                    "Robótica",
                    "Control",
                    "Electrónica",
                    "Sistemas inteligentes"
                ],

                habilidades: [
                    "Matemática",
                    "Física",
                    "Programación",
                    "Electrónica",
                    "Pensamiento lógico"
                ],

                universidades: [
                    "UNI",
                    "PUCP",
                    "UTEC"
                ],

                cursos: [
                    "Arduino",
                    "Electrónica",
                    "Programación",
                    "Control automático"
                ],

                proyectos: [
                    "Crear un robot",
                    "Automatizar una máquina",
                    "Crear un sistema inteligente"
                ],

                salario: "S/ 3,500 - S/ 10,000"
            }

        ]
    },


    // ==================================================
    // CIENCIAS SOCIALES Y NEGOCIOS
    // ==================================================

    {
        categoria: "Ciencias Sociales y Negocios",

        carreras: [

            {
                id: "derecho",
                nombre: "Derecho",
                icono: "⚖️",

                descripcion:
                    "Estudia las normas jurídicas y su aplicación para resolver conflictos y proteger derechos.",

                ramas: [
                    "Derecho penal",
                    "Derecho civil",
                    "Derecho laboral",
                    "Derecho empresarial",
                    "Derecho constitucional",
                    "Derecho internacional"
                ],

                habilidades: [
                    "Argumentación",
                    "Comunicación",
                    "Análisis",
                    "Investigación",
                    "Pensamiento crítico"
                ],

                universidades: [
                    "PUCP",
                    "UNMSM",
                    "USMP"
                ],

                cursos: [
                    "Introducción al Derecho",
                    "Constitución",
                    "Argumentación",
                    "Investigación jurídica"
                ],

                proyectos: [
                    "Debates",
                    "Investigación jurídica",
                    "Campañas de derechos"
                ],

                salario: "Variable según especialidad y experiencia"
            },


            {
                id: "administracion",
                nombre: "Administración",
                icono: "💼",

                descripcion:
                    "Gestiona recursos, personas y procesos para alcanzar objetivos dentro de una organización.",

                ramas: [
                    "Gestión empresarial",
                    "Recursos humanos",
                    "Marketing",
                    "Finanzas",
                    "Emprendimiento",
                    "Negocios internacionales"
                ],

                habilidades: [
                    "Liderazgo",
                    "Organización",
                    "Comunicación",
                    "Análisis",
                    "Toma de decisiones"
                ],

                universidades: [
                    "UNMSM",
                    "PUCP",
                    "UPC"
                ],

                cursos: [
                    "Gestión",
                    "Marketing",
                    "Finanzas",
                    "Emprendimiento"
                ],

                proyectos: [
                    "Crear un emprendimiento",
                    "Diseñar un plan empresarial",
                    "Crear una estrategia de marketing"
                ],

                salario: "S/ 2,500 - S/ 9,000"
            },


            {
                id: "contabilidad",
                nombre: "Contabilidad",
                icono: "📊",

                descripcion:
                    "Registra, analiza e interpreta información financiera para apoyar la toma de decisiones.",

                ramas: [
                    "Contabilidad financiera",
                    "Auditoría",
                    "Tributación",
                    "Contabilidad empresarial",
                    "Finanzas"
                ],

                habilidades: [
                    "Matemática",
                    "Organización",
                    "Análisis",
                    "Precisión",
                    "Responsabilidad"
                ],

                universidades: [
                    "UNMSM",
                    "PUCP",
                    "UPC"
                ],

                cursos: [
                    "Contabilidad básica",
                    "Excel",
                    "Finanzas",
                    "Tributación"
                ],

                proyectos: [
                    "Crear un presupuesto",
                    "Analizar una empresa",
                    "Diseñar un plan financiero"
                ],

                salario: "S/ 2,500 - S/ 8,000"
            }

        ]
    }

];

// ======================================================
// CONTADOR DE TIEMPO
// ======================================================

setInterval(() => {

    if (!APP.perfil) return;

    APP.estadisticas.minutosUso++;

    guardarPerfil();

    actualizarDashboard();

}, 60000);


// ======================================================
// INICIO
// ======================================================

window.addEventListener("DOMContentLoaded", () => {

    cargarPerfil();

    if (APP.perfil) {
        iniciarDashboard();
    }

});

// ======================================================
// NEXARIS IA
// ======================================================

async function chat() {

    const input = $("pregunta");
    const chatBox = $("chat-box");

    if (!input || !chatBox) return;

    const mensaje = input.value.trim();

    if (!mensaje) return;

    // Mostrar mensaje del usuario

    chatBox.innerHTML += `
        <div class="message usuario">
            👤 ${mensaje}
        </div>
    `;

    input.value = "";

    // Indicador de escritura

    const loading = document.createElement("div");

    loading.className = "message nexaris";

    loading.id = "nexaris-loading";

    loading.innerHTML = `
        🤖 NEXARIS está pensando...
    `;

    chatBox.appendChild(loading);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch(
            `${CONFIG.API_URL}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    mensaje
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `Servidor respondió ${response.status}`
            );
        }

        const data = await response.json();

        loading.remove();

        const respuestaIA = data.answer || data.respuesta;

        if (!respuestaIA) {
            throw new Error("La API no devolvió ningún texto.");
        }

        chatBox.innerHTML += `
    <div class="message nexaris">
        🤖 ${formatearRespuesta(respuestaIA)}
    </div>
`;

        APP.estadisticas.consultasIA++;

        agregarXP(5);

        guardarPerfil();

        actualizarDashboard();

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {

        console.error("❌ Error en NEXARIS IA:", error);

        loading.remove();

        chatBox.innerHTML += `
            <div class="message nexaris">
                ⚠️ No pude conectarme con NEXARIS IA.
                <br><br>
                Verifica que el servidor esté funcionando.
            </div>
        `;

    }

}


// ======================================================
// FORMATEAR RESPUESTA IA
// ======================================================

function formatearRespuesta(texto) {

    if (!texto) {
        return "No recibí una respuesta.";
    }

    let html = texto;

    // Escapar HTML para evitar que la IA inserte etiquetas directamente
    html = html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Bloques de código
    html = html.replace(
        /```([\s\S]*?)```/g,
        '<pre class="codigo"><code>$1</code></pre>'
    );

    // Código inline
    html = html.replace(
        /`([^`]+)`/g,
        '<code>$1</code>'
    );

    // Títulos Markdown
    html = html.replace(
        /^### (.*)$/gm,
        '<h4>$1</h4>'
    );

    html = html.replace(
        /^## (.*)$/gm,
        '<h3>$1</h3>'
    );

    html = html.replace(
        /^# (.*)$/gm,
        '<h2>$1</h2>'
    );

    // Negrita
    html = html.replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
    );

    // Cursiva
    html = html.replace(
        /\*(.*?)\*/g,
        '<em>$1</em>'
    );

    // Listas con guion
    html = html.replace(
        /^- (.*)$/gm,
        '<li>$1</li>'
    );

    // Convertir grupos de <li> en listas
    html = html.replace(
        /(<li>.*<\/li>)/gs,
        '<ul>$1</ul>'
    );

    // Saltos de línea
    html = html.replace(/\n/g, "<br>");

    return html;
}