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
        .forEach(panel => {
            panel.classList.add("oculto");
        });

    const destino = $(seccion);

    if (!destino) {
        console.error(
            `NEXARIS: No existe el panel "${seccion}"`
        );
        return;
    }

    destino.classList.remove("oculto");

    // Si el usuario entra al Test Vocacional,
    // iniciar inmediatamente la primera pregunta.
    if (seccion === "test") {
    const testContainer = $("test-container");

    if (testContainer) {
        testContainer.style.display = "block";
    }

    mostrarPregunta();
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
        pregunta: "¿Qué actividad realizarías con mayor interés?",
        opciones: [
            {
                texto: "Crear una aplicación, página web o sistema",
                perfil: "tecnologico"
            },
            {
                texto: "Diseñar una ilustración, logo o contenido visual",
                perfil: "creativo"
            },
            {
                texto: "Investigar cómo funciona un fenómeno",
                perfil: "cientifico"
            },
            {
                texto: "Ayudar a una persona a resolver un problema",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "Cuando encuentras un problema difícil, ¿qué haces primero?",
        opciones: [
            {
                texto: "Busco una solución lógica paso a paso",
                perfil: "tecnologico"
            },
            {
                texto: "Intento encontrar una solución diferente",
                perfil: "creativo"
            },
            {
                texto: "Investigo información para comprenderlo",
                perfil: "cientifico"
            },
            {
                texto: "Converso con otras personas para conocer sus ideas",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué proyecto te gustaría desarrollar?",
        opciones: [
            {
                texto: "Un videojuego o aplicación",
                perfil: "tecnologico"
            },
            {
                texto: "Una campaña visual o animación",
                perfil: "creativo"
            },
            {
                texto: "Un experimento o investigación",
                perfil: "cientifico"
            },
            {
                texto: "Un proyecto para ayudar a la comunidad",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué tipo de actividad te resulta más satisfactoria?",
        opciones: [
            {
                texto: "Resolver problemas utilizando tecnología",
                perfil: "tecnologico"
            },
            {
                texto: "Crear algo original que otras personas puedan apreciar",
                perfil: "creativo"
            },
            {
                texto: "Descubrir información que antes no conocías",
                perfil: "cientifico"
            },
            {
                texto: "Conseguir que otras personas mejoren o aprendan",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué habilidad te gustaría dominar?",
        opciones: [
            {
                texto: "Programación y desarrollo tecnológico",
                perfil: "tecnologico"
            },
            {
                texto: "Diseño, ilustración o animación",
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
        pregunta: "¿En qué ambiente preferirías trabajar?",
        opciones: [
            {
                texto: "Un laboratorio tecnológico o empresa de software",
                perfil: "tecnologico"
            },
            {
                texto: "Un estudio creativo o agencia de diseño",
                perfil: "creativo"
            },
            {
                texto: "Un laboratorio o centro de investigación",
                perfil: "cientifico"
            },
            {
                texto: "Una institución donde pueda trabajar con personas",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué problema te gustaría ayudar a resolver?",
        opciones: [
            {
                texto: "Problemas relacionados con tecnología y seguridad digital",
                perfil: "tecnologico"
            },
            {
                texto: "Problemas de comunicación y expresión visual",
                perfil: "creativo"
            },
            {
                texto: "Problemas relacionados con ciencia y ambiente",
                perfil: "cientifico"
            },
            {
                texto: "Problemas sociales y educativos",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué asignatura despierta más tu curiosidad?",
        opciones: [
            {
                texto: "Computación y tecnología",
                perfil: "tecnologico"
            },
            {
                texto: "Arte, diseño o comunicación",
                perfil: "creativo"
            },
            {
                texto: "Ciencia y matemática",
                perfil: "cientifico"
            },
            {
                texto: "Ciencias sociales",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué resultado te produciría mayor satisfacción?",
        opciones: [
            {
                texto: "Ver funcionando algo que programé",
                perfil: "tecnologico"
            },
            {
                texto: "Ver terminada una creación visual",
                perfil: "creativo"
            },
            {
                texto: "Demostrar o descubrir algo nuevo",
                perfil: "cientifico"
            },
            {
                texto: "Saber que ayudé a otra persona",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Cómo prefieres aprender algo nuevo?",
        opciones: [
            {
                texto: "Experimentando con herramientas y tecnología",
                perfil: "tecnologico"
            },
            {
                texto: "Practicando y creando proyectos",
                perfil: "creativo"
            },
            {
                texto: "Investigando y analizando información",
                perfil: "cientifico"
            },
            {
                texto: "Conversando y trabajando con otras personas",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué tipo de desafío elegirías?",
        opciones: [
            {
                texto: "Desarrollar una solución tecnológica",
                perfil: "tecnologico"
            },
            {
                texto: "Crear una identidad visual para una marca",
                perfil: "creativo"
            },
            {
                texto: "Resolver un problema mediante investigación",
                perfil: "cientifico"
            },
            {
                texto: "Organizar un proyecto para beneficiar a un grupo",
                perfil: "social"
            }
        ]
    },

    {
        pregunta: "¿Qué te gustaría conseguir con tu futura profesión?",
        opciones: [
            {
                texto: "Crear tecnología que resuelva problemas",
                perfil: "tecnologico"
            },
            {
                texto: "Crear ideas y experiencias originales",
                perfil: "creativo"
            },
            {
                texto: "Generar conocimiento y descubrir soluciones",
                perfil: "cientifico"
            },
            {
                texto: "Mejorar la vida de otras personas",
                perfil: "social"
            }
        ]
    }

];


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

// ======================================================
// MOTOR DEL TEST VOCACIONAL
// ======================================================

let preguntaActual = 0;
let respuestaSeleccionada = null;

function iniciarTest() {
    preguntaActual = 0;
    respuestaSeleccionada = null;

    APP.puntos = {
        creativo: 0,
        tecnologico: 0,
        cientifico: 0,
        social: 0
    };

    const resultado = $("resultado");
    const testContainer = $("test-container");

    if (resultado) {
        resultado.innerHTML = "";
        resultado.style.display = "none";
    }

    if (testContainer) {
        testContainer.style.display = "block";
    }

    mostrarPregunta();
}

function mostrarPregunta() {
    const preguntaBox = $("pregunta-test");
    const opcionesBox = $("opciones-test");
    const progreso = $("test-progreso");
    const barra = $("test-progress-fill");

    if (!preguntaBox || !opcionesBox) {
        console.error("NEXARIS: No se encontraron los elementos del test.");
        return;
    }

    const pregunta = TEST_VOCACIONAL[preguntaActual];

    if (!pregunta) {
        console.error("NEXARIS: Pregunta inexistente.");
        return;
    }

    respuestaSeleccionada = null;

    // PROGRESO
    if (progreso) {
        progreso.textContent =
            `Pregunta ${preguntaActual + 1} de ${TEST_VOCACIONAL.length}`;
    }

    if (barra) {
        const porcentaje =
            ((preguntaActual + 1) / TEST_VOCACIONAL.length) * 100;

        barra.style.width = `${porcentaje}%`;
    }

    // PREGUNTA
    preguntaBox.innerHTML = `
        <h3>${pregunta.pregunta}</h3>
    `;

    // OPCIONES
    opcionesBox.innerHTML = "";

    pregunta.opciones.forEach((opcion, indice) => {

        const boton = document.createElement("button");

        boton.className = "opcion-test";
        boton.type = "button";

        boton.innerHTML = `
            <span class="numero-opcion">
                ${String.fromCharCode(65 + indice)}
            </span>

            <span>
                ${opcion.texto}
            </span>
        `;

        boton.addEventListener("click", () => {
            seleccionarOpcion(boton, opcion);
        });

        opcionesBox.appendChild(boton);
    });

    // BOTÓN SIGUIENTE
    const siguiente = document.createElement("button");

    siguiente.className = "btn-siguiente";
    siguiente.type = "button";

    siguiente.textContent =
        preguntaActual === TEST_VOCACIONAL.length - 1
            ? "Ver resultado 🎯"
            : "Siguiente ➜";

    siguiente.addEventListener("click", avanzarPregunta);

    opcionesBox.appendChild(siguiente);
}

function seleccionarOpcion(boton, opcion) {

    document
        .querySelectorAll(".opcion-test")
        .forEach(btn => {
            btn.classList.remove("seleccionada");
        });

    boton.classList.add("seleccionada");

    respuestaSeleccionada = opcion;
}

function avanzarPregunta() {

    if (!respuestaSeleccionada) {
        alert("Selecciona una opción antes de continuar.");
        return;
    }

    APP.puntos[respuestaSeleccionada.perfil]++;

    if (preguntaActual >= TEST_VOCACIONAL.length - 1) {
        finalizarTest();
        return;
    }

    preguntaActual++;

    mostrarPregunta();
}

function finalizarTest() {

    const resultado = $("resultado");

    if (!resultado) {
        console.error("NEXARIS: No existe #resultado.");
        return;
    }

    // ORDENAR RESULTADOS
    const perfiles = Object.entries(APP.puntos);

    perfiles.sort((a, b) => b[1] - a[1]);

    const perfilPrincipal = perfiles[0][0];

    const nombresPerfil = {
        tecnologico: "Tecnológico 💻",
        creativo: "Creativo 🎨",
        cientifico: "Científico 🔬",
        social: "Social 🤝"
    };

    const descripciones = {
        tecnologico:
            "Tienes afinidad por la tecnología, la lógica y la resolución de problemas. Podrías explorar carreras relacionadas con programación, software, ciberseguridad, inteligencia artificial o robótica.",

        creativo:
            "Tienes afinidad por la creatividad, el diseño y la expresión visual. Podrías explorar carreras relacionadas con diseño gráfico, UX/UI, animación o comunicación.",

        cientifico:
            "Tienes afinidad por la investigación, el análisis y la búsqueda de conocimiento. Podrías explorar carreras científicas, de salud, ingeniería o investigación.",

        social:
            "Tienes afinidad por trabajar con personas, comunicar ideas y generar impacto social. Podrías explorar carreras como psicología, derecho, educación, administración o áreas sociales."
    };

    resultado.innerHTML = `
        <div class="resultado-card">

            <span class="hero-badge">
                🎯 RESULTADO NEXARIS
            </span>

            <h2>
                Tu perfil es:
            </h2>

            <h1>
                ${nombresPerfil[perfilPrincipal]}
            </h1>

            <p>
                ${descripciones[perfilPrincipal]}
            </p>

            <div class="resultado-puntos">

                <div>
                    💻 Tecnológico:
                    <strong>${APP.puntos.tecnologico}</strong>
                </div>

                <div>
                    🎨 Creativo:
                    <strong>${APP.puntos.creativo}</strong>
                </div>

                <div>
                    🔬 Científico:
                    <strong>${APP.puntos.cientifico}</strong>
                </div>

                <div>
                    🤝 Social:
                    <strong>${APP.puntos.social}</strong>
                </div>

            </div>

            <button
                class="primary"
                type="button"
                onclick="mostrar('profesiones')"
            >
                🎓 Explorar carreras
            </button>

        </div>
    `;

    resultado.style.display = "block";

    const testContainer = $("test-container");

    if (testContainer) {
        testContainer.style.display = "none";
    }

    // GUARDAR RESULTADO
    if (APP.perfil) {

        APP.perfil.testCompletado = true;

        agregarXP(20);

        guardarPerfil();

        actualizarDashboard();
    }
}