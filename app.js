alert("APP NUEVO");

// =====================================
// NEXARIS PATHWAY
// APP.JS
// =====================================

// ===============================
// NAVEGACIÓN
// ===============================

function mostrar(seccion) {

    document.querySelectorAll(".panel").forEach(panel => {
        panel.classList.add("oculto");
    });

    const destino = document.getElementById(seccion);

    if (destino) {
        destino.classList.remove("oculto");
    }

}



// ===============================
// REGISTRO
// ===============================

function entrarNexaris() {

    const nombre = document.getElementById("nombreUsuario").value.trim();

    const correo = document.getElementById("correoUsuario").value.trim();

    if (nombre === "" || correo === "") {

        alert("Completa todos los campos.");

        return;

    }

    localStorage.setItem("usuario", nombre);

    localStorage.setItem("correo", correo);

    document.getElementById("registro").style.display = "none";

    document.querySelector(".dashboard").style.display = "grid";

    mostrar("inicio");

    const fecha = new Date();

    const opciones = {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    };

    document.getElementById("fechaHoy").textContent =
        fecha.toLocaleDateString("es-ES", opciones);

    cargarCorreo();

}



// ===============================
// PERFIL
// ===============================

function cargarCorreo() {

    const usuario = localStorage.getItem("usuario") || "No registrado";

    const correo = localStorage.getItem("correo") || "No registrado";

    const nombre = document.getElementById("mostrarUsuario");

    const email = document.getElementById("mostrarCorreo");

    if (nombre) {

        nombre.textContent = usuario;

    }

    if (email) {

        email.textContent = correo;

    }

    const usuarioTop = document.getElementById("usuarioTop");

    if (usuarioTop) {

        usuarioTop.textContent = "👤 " + usuario;

    }

}



// ===============================
// TEST VOCACIONAL
// ===============================

let carrerasVisitadas = 0;
let consultasIA = 0;
let minutosUso = 0;

let puntos = {

    creativo: 0,

    tecnologico: 0,

    cientifico: 0,

    social: 0

};



function reiniciarTest() {

    puntos.creativo = 0;

    puntos.tecnologico = 0;

    puntos.cientifico = 0;

    puntos.social = 0;

    document.getElementById("resultado").innerHTML = "";

}



function sumarPerfil(tipo) {

    if (puntos[tipo] !== undefined) {

        puntos[tipo]++;

    }

}



function mostrarResultado() {

    const resultado = document.getElementById("resultado");

    const mayor = Math.max(

        puntos.creativo,

        puntos.tecnologico,

        puntos.cientifico,

        puntos.social

    );

    if (mayor === 0) {

        resultado.innerHTML = `
        <h3>⚠️ Aún no respondes el test</h3>
        <p>Selecciona las opciones para descubrir tu perfil.</p>
        `;

        document.getElementById("estadoTestPanel").textContent = "Completado ✅";

        document.getElementById("progresoTexto").textContent = "25%";

        return;

    }

    if (mayor === puntos.creativo) {

        resultado.innerHTML = `

        <h2>🎨 Perfil Creativo</h2>

        <p>
        Destacas por tu imaginación, innovación y capacidad para diseñar.
        </p>

        <b>Carreras recomendadas:</b>

        <br>🎨 Diseño Gráfico
        <br>🏛️ Arquitectura
        <br>🎬 Animación Digital
        <br>🎮 Desarrollo de Videojuegos

        `;
        document.getElementById("estadoTestPanel").textContent = "Completado ✅";

        document.getElementById("progresoTexto").textContent = "25%";

        return;

    }

    if (mayor === puntos.tecnologico) {

        resultado.innerHTML = `

        <h2>💻 Perfil Tecnológico</h2>

        <p>
        Tienes facilidad para resolver problemas mediante la tecnología.
        </p>

        <b>Carreras recomendadas:</b>

        <br>💻 Ingeniería de Software
        <br>🤖 Inteligencia Artificial
        <br>🔐 Ciberseguridad
        <br>⚙️ Robótica

        `;

        document.getElementById("estadoTestPanel").textContent = "Completado ✅";

        document.getElementById("progresoTexto").textContent = "25%";

        return;

    }

    if (mayor === puntos.cientifico) {

        resultado.innerHTML = `

        <h2>🔬 Perfil Científico</h2>

        <p>
        Disfrutas investigar y comprender cómo funciona el mundo.
        </p>

        <b>Carreras recomendadas:</b>

        <br>🩺 Medicina
        <br>🧬 Biología
        <br>🔭 Investigación
        <br>🌱 Ciencias Ambientales

        `;
        document.getElementById("estadoTestPanel").textContent = "Completado ✅";

        document.getElementById("progresoTexto").textContent = "25%";

        return;

    }

    resultado.innerHTML = `

    <h2>🤝 Perfil Social</h2>

    <p>
    Tu fortaleza es comprender, orientar y ayudar a otras personas.
    </p>

    <b>Carreras recomendadas:</b>

    <br>🧠 Psicología
    <br>📚 Educación
    <br>⚖️ Derecho
    <br>🌎 Trabajo Social

    `;

}

// ===============================
// EXPLORADOR DE CARRERAS
// ===============================

function verProfesion(profesion) {

    const info = document.getElementById("info");

    if (!info) return;

    const carreras = {

        software: {
            titulo: "💻 Ingeniería de Software",
            descripcion: "Desarrolla aplicaciones, sitios web, videojuegos y sistemas inteligentes.",
            habilidades: "Programación, lógica, creatividad y trabajo en equipo.",
            campo: "Empresas tecnológicas, startups, videojuegos, IA y desarrollo web."
        },

        medicina: {
            titulo: "🩺 Medicina",
            descripcion: "Prevención, diagnóstico y tratamiento de enfermedades.",
            habilidades: "Empatía, responsabilidad, comunicación y ciencias.",
            campo: "Hospitales, clínicas e investigación."
        },

        diseno: {
            titulo: "🎨 Diseño Gráfico",
            descripcion: "Comunica ideas mediante imágenes, ilustraciones y contenido visual.",
            habilidades: "Creatividad, dibujo y manejo de software de diseño.",
            campo: "Publicidad, marketing, redes sociales y empresas."
        },

        psicologia: {
            titulo: "🧠 Psicología",
            descripcion: "Estudia el comportamiento humano y la salud mental.",
            habilidades: "Empatía, escucha y análisis.",
            campo: "Colegios, hospitales y empresas."
        },

        arquitectura: {
            titulo: "🏛️ Arquitectura",
            descripcion: "Diseña edificios y espacios funcionales.",
            habilidades: "Creatividad, matemáticas y dibujo técnico.",
            campo: "Constructoras y estudios de arquitectura."
        },

        derecho: {
            titulo: "⚖️ Derecho",
            descripcion: "Protege la justicia y aplica las leyes.",
            habilidades: "Comunicación, ética y argumentación.",
            campo: "Estudios jurídicos y entidades públicas."
        },

        robotica: {
            titulo: "🤖 Robótica e IA",
            descripcion: "Diseña robots y sistemas inteligentes.",
            habilidades: "Programación, electrónica y matemáticas.",
            campo: "Industria, automatización e investigación."
        }

        ,

        ciberseguridad: {
            titulo: "🔐 Ciberseguridad",
            descripcion: "Protege sistemas y datos frente a ataques informáticos.",
            habilidades: "Programación, análisis y seguridad.",
            campo: "Empresas tecnológicas, bancos y gobierno."
        },

        ia: {
            titulo: "🤖 Inteligencia Artificial",
            descripcion: "Desarrolla sistemas capaces de aprender y tomar decisiones.",
            habilidades: "Matemáticas, programación y lógica.",
            campo: "Tecnología, investigación y automatización."
        },

        uxui: {
            titulo: "🖌️ Diseño UX/UI",
            descripcion: "Diseña interfaces fáciles y atractivas para los usuarios.",
            habilidades: "Creatividad, diseño y comunicación.",
            campo: "Empresas de software y diseño digital."
        },

        animacion: {
            titulo: "🎬 Animación Digital",
            descripcion: "Crea películas, videojuegos y contenido audiovisual.",
            habilidades: "Dibujo, creatividad y software de animación.",
            campo: "Estudios de animación y videojuegos."
        },

        marketing: {
            titulo: "📈 Marketing Digital",
            descripcion: "Promociona productos y marcas usando Internet.",
            habilidades: "Creatividad, comunicación y análisis.",
            campo: "Empresas y agencias."
        },

        enfermeria: {
            titulo: "💉 Enfermería",
            descripcion: "Brinda atención y cuidado a los pacientes.",
            habilidades: "Empatía y responsabilidad.",
            campo: "Hospitales y clínicas."
        },

        odontologia: {
            titulo: "🦷 Odontología",
            descripcion: "Previene y trata enfermedades bucales.",
            habilidades: "Precisión y atención al detalle.",
            campo: "Consultorios y hospitales."
        },

        civil: {
            titulo: "🏗️ Ingeniería Civil",
            descripcion: "Diseña y construye obras de infraestructura.",
            habilidades: "Matemáticas y planificación.",
            campo: "Constructoras y proyectos públicos."
        },

        industrial: {
            titulo: "⚙️ Ingeniería Industrial",
            descripcion: "Optimiza procesos en empresas.",
            habilidades: "Gestión y análisis.",
            campo: "Industria y fábricas."
        },

        mecatronica: {
            titulo: "⚡ Mecatrónica",
            descripcion: "Integra mecánica, electrónica y programación.",
            habilidades: "Robótica y tecnología.",
            campo: "Automatización industrial."
        },

        contabilidad: {
            titulo: "📊 Contabilidad",
            descripcion: "Administra la información financiera.",
            habilidades: "Matemáticas y organización.",
            campo: "Empresas y bancos."
        },

        administracion: {
            titulo: "💼 Administración",
            descripcion: "Gestiona empresas y organizaciones.",
            habilidades: "Liderazgo y planificación.",
            campo: "Empresas públicas y privadas."
        },

        educacion: {
            titulo: "📚 Educación",
            descripcion: "Forma y guía el aprendizaje de estudiantes.",
            habilidades: "Comunicación y paciencia.",
            campo: "Instituciones educativas."
        },

        veterinaria: {
            titulo: "🐶 Medicina Veterinaria",
            descripcion: "Cuida la salud de los animales.",
            habilidades: "Biología y empatía.",
            campo: "Clínicas veterinarias y zoológicos."
        }
    };

    if (!carreras[profesion]) {

        info.innerHTML = "";

        return;

    }

    const carrera = carreras[profesion];

    info.innerHTML = `

        <h2>${carrera.titulo}</h2>

        <p>${carrera.descripcion}</p>

        <h3>🧠 Habilidades</h3>

        <p>${carrera.habilidades}</p>

        <h3>💼 Campo laboral</h3>

        <p>${carrera.campo}</p>

    `;

}



// ===============================
// RECURSOS
// ===============================

function abrirRecurso(url) {

    window.open(url, "_blank");

}



// ===============================
// MI RUTA
// ===============================

function generarRuta() {

    const ruta = document.getElementById("rutaResultado");

    if (!ruta) return;

    ruta.innerHTML = `

    <h2>🚀 Tu Ruta Profesional</h2>

    <p>
    Completa el test vocacional, conversa con NEXARIS IA y explora distintas carreras para descubrir cuál se adapta mejor a ti.
    </p>

    <ol>

        <li>✅ Realiza el Test Vocacional.</li>

        <li>✅ Habla con NEXARIS IA.</li>

        <li>✅ Explora diferentes profesiones.</li>

        <li>✅ Investiga universidades e institutos.</li>

        <li>🎯 Define una meta profesional.</li>

    </ol>

    `;

}

// ===============================
// NEXARIS IA (GEMINI)
// ===============================

async function chat() {

    const input = document.getElementById("pregunta");
    const chatBox = document.getElementById("chat-box");

    const mensaje = input.value.trim();

    if (mensaje === "") return;

    // Mensaje del usuario
    chatBox.innerHTML += `
        <div class="message user">
            ${mensaje}
        </div>
    `;

    input.value = "";

    // Crear mensaje "Pensando..."
    const mensajeIA = document.createElement("div");
    mensajeIA.className = "message nexaris";
    mensajeIA.innerHTML = "🤖 Pensando...";

    chatBox.appendChild(mensajeIA);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const respuesta = await fetch("http://localhost:3000/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mensaje
            })

        });

        const datos = await respuesta.json();

        mensajeIA.innerHTML = "🤖 " + datos.respuesta;

    }

    catch (error) {

        console.error(error);

        mensajeIA.innerHTML =
            "⚠️ No pude comunicarme con Gemini.";

    }

    chatBox.scrollTop = chatBox.scrollHeight;

}



// ===============================
// ENTER PARA ENVIAR
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("pregunta");

    if (input) {

        input.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {

                e.preventDefault();

                chat();

            }

        });

    }

});


function actualizarHora() {

    const ahora = new Date();

    const hora = ahora.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

    const reloj = document.getElementById("horaActual");

    if (reloj) {

        reloj.textContent = hora;

    }

}

setInterval(actualizarHora, 1000);

actualizarHora();