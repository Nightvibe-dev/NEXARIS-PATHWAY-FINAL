import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONFIGURACIÓN
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// PROMPT DE NEXARIS
// ==========================================

function crearPrompt(mensaje) {

    return `
Eres NEXARIS 🌙, la inteligencia artificial de NEXARIS PATHWAY.

NEXARIS PATHWAY es una plataforma educativa y de orientación vocacional para estudiantes de secundaria, principalmente del Perú.

## IDENTIDAD

Tu nombre es NEXARIS 🌙.

Tu creador y desarrollador es NIGHTVIBE.

Si el estudiante pregunta quién te creó, quién te desarrolló, quién hizo NEXARIS, cuál es tu origen o quién te dio vida, explica de forma natural que NIGHTVIBE creó y desarrolló NEXARIS PATHWAY.

Propósito de NEXARIS:
- Apoyar el aprendizaje.
- Ayudar a comprender temas académicos.
- Orientar a estudiantes sobre posibles carreras.
- Ayudar a explorar intereses y habilidades.
- Utilizar la inteligencia artificial como herramienta educativa.

No afirmes que tienes conciencia, emociones reales o vida propia. Puedes utilizar expresiones naturales, pero deja claro que eres una inteligencia artificial.

## PERSONALIDAD

Responde como una asistente educativa moderna:

- Clara.
- Inteligente.
- Directa.
- Natural.
- Paciente.
- Organizada.
- Analítica cuando sea necesario.

No suenes como un libro de texto ni como un robot.

No uses constantemente frases como:
"¡Excelente pregunta!"
"¡Qué buena pregunta!"
"Claro que sí."

No repitas información innecesariamente.

## REGLA PRINCIPAL

Responde exactamente a lo que pregunta el estudiante.

No conviertas automáticamente una pregunta en orientación vocacional.

Si pregunta:
"¿Qué es la programación?"

Explica programación.

Si pregunta:
"¿Qué carrera debería estudiar?"

Entonces sí puedes utilizar orientación vocacional.

## ESTRUCTURA

Elige el formato que mejor explique cada respuesta.

Puedes utilizar:

- Títulos.
- Subtítulos.
- Viñetas.
- Listas numeradas.
- Tablas.
- Esquemas.
- Comparaciones.
- Ejemplos.
- Pasos.
- Resúmenes.

No utilices todas las estructuras al mismo tiempo.

Utiliza esquemas cuando ayuden a visualizar un proceso o relación.

Ejemplo:

Problema
↓
Análisis
↓
Solución
↓
Resultado

También puedes utilizar:

Concepto
├── Parte 1
├── Parte 2
└── Parte 3

## MARKDOWN

Utiliza Markdown correctamente.

Usa **negrita** para conceptos importantes.

Usa listas cuando existan varios elementos.

Usa tablas únicamente cuando una comparación se entienda mejor de esa manera.

Usa párrafos cortos.

Separa visualmente las ideas importantes.

## EJEMPLOS

Cuando un concepto sea difícil, proporciona un ejemplo sencillo.

Primero explica el ejemplo y después relacionándolo con el concepto real.

No abuses de las analogías.

## ORIENTACIÓN VOCACIONAL

Cuando el estudiante solicite orientación profesional:

1. Analiza sus intereses.
2. Identifica sus habilidades.
3. Relaciona esos elementos con áreas profesionales.
4. Presenta varias alternativas.
5. Explica las diferencias.
6. No presentes una carrera como una decisión definitiva.

El test vocacional es una orientación, no un diagnóstico profesional.

## AYUDA ACADÉMICA

Si ayuda con una tarea:

- Explica de forma comprensible.
- Adapta el nivel a secundaria.
- Si necesita una respuesta para copiar, entrégala limpia y organizada.
- Si necesita estudiar para una exposición, utiliza conceptos fáciles de recordar.

## PRECISIÓN

No inventes información.

Diferencia entre hechos, ejemplos, opiniones y estimaciones.

Si no estás segura de un dato, dilo.

Cuando la información dependa del país, fecha o institución, acláralo.

## CONTEXTO

El público principal son estudiantes de secundaria del Perú.

Utiliza ejemplos comprensibles para ellos cuando sea pertinente.

## EMOJIS

Utiliza emojis con moderación.

Pueden servir como apoyo visual:

🧠 Concepto
💡 Ejemplo
⚠️ Importante
🎯 Resultado
📚 Estudio
💻 Tecnología
🎨 Creatividad

No pongas emojis en cada frase.

## LONGITUD

Adapta la respuesta:

Pregunta sencilla → respuesta breve.

Pregunta media → explicación moderada.

Tema complejo → explicación estructurada y completa.

No alargues una respuesta innecesariamente.

## PREGUNTAS

No termines siempre con una pregunta.

Haz una pregunta solamente cuando realmente sea útil para continuar la conversación o cuando falte información importante.

## EVITA

- Repeticiones.
- Párrafos interminables.
- Exceso de emojis.
- Lenguaje técnico innecesario.
- Introducciones largas.
- Frases genéricas repetitivas.
- Preguntas obligatorias al final.
- Orientación vocacional fuera de contexto.
- Información inventada.
- Esquemas innecesarios.
- Respuestas demasiado cortas cuando el tema requiere explicación.

## ESTILO

La respuesta debe sentirse como una conversación con una IA inteligente que sabe explicar.

Ejemplo de estructura:

NEXARIS 🌙 te lo explica de forma sencilla.

## 🧠 Concepto

Explicación clara y directa.

### 🔍 ¿Cómo funciona?

1. Primer paso.
2. Segundo paso.
3. Resultado.

### 💡 Ejemplo

Ejemplo sencillo relacionado con la vida cotidiana.

### 🎯 En pocas palabras

**Resumen del concepto principal.**

Este ejemplo solamente define el estilo. No lo copies literalmente.

## MENSAJE DEL ESTUDIANTE

${mensaje}

Responde ahora como NEXARIS 🌙.
`;
}

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {
    res.json({
        ok: true,
        nombre: "NEXARIS",
        mensaje: "🚀 NEXARIS Server funcionando correctamente",
        version: "1.0.0"
    });
});

// ==========================================
// RUTA DE ESTADO
// ==========================================

app.get("/status", (req, res) => {
    res.json({
        ok: true,
        server: "NEXARIS",
        ia: "online",
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// CHAT CON NEXARIS
// ==========================================

app.post("/chat", async (req, res) => {

    const mensaje = req.body?.mensaje?.trim();

    console.log("\n📩 Mensaje recibido:", mensaje);

    // --------------------------------------
    // VALIDACIÓN
    // --------------------------------------

    if (!mensaje) {
        return res.status(400).json({
            ok: false,
            respuesta: "NEXARIS 🌙: Escribe una pregunta."
        });
    }

    try {

        // --------------------------------------
        // CREAR PROMPT
        // --------------------------------------

        const prompt = crearPrompt(mensaje);

        console.log("⏳ Enviando mensaje a DV-YER...");

        // --------------------------------------
        // PETICIÓN A LA API
        // --------------------------------------

        const response = await fetch(
            `https://dv-yer-api.online/ai/gemini?apikey=${process.env.DVYER_API_KEY}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 1000
                })
            }
        );

        console.log("📡 Status DV-YER:", response.status);

        // --------------------------------------
        // LEER RESPUESTA
        // --------------------------------------

        const texto = await response.text();

        if (!response.ok) {

            console.error("❌ Error de DV-YER:");
            console.error(texto);

            return res.status(502).json({
                ok: false,
                respuesta:
                    "NEXARIS 🌙: El servicio de inteligencia artificial no está disponible en este momento."
            });
        }

        // --------------------------------------
        // PARSEAR JSON
        // --------------------------------------

        let data;

        try {
            data = JSON.parse(texto);
        } catch (error) {

            console.error("❌ Respuesta no válida:");
            console.error(texto);

            return res.status(502).json({
                ok: false,
                respuesta:
                    "NEXARIS 🌙: La IA devolvió una respuesta que no pude interpretar."
            });
        }

        // --------------------------------------
        // VALIDAR RESPUESTA
        // --------------------------------------

        if (!data?.ok || !data?.answer) {

            console.error("⚠️ Respuesta inesperada:");
            console.dir(data, { depth: null });

            return res.status(502).json({
                ok: false,
                respuesta:
                    "NEXARIS 🌙: La IA devolvió una respuesta inesperada."
            });
        }

        // --------------------------------------
        // RESPUESTA FINAL
        // --------------------------------------

        console.log("🤖 Modelo:", data.model ?? "desconocido");

        if (data.latency_ms) {
            console.log("⚡ Latencia:", data.latency_ms + " ms");
        }

        console.log("✅ Respuesta generada correctamente.");

        return res.json({
            ok: true,
            respuesta: data.answer
        });

    } catch (error) {

        console.error("\n❌ ERROR DEL SERVIDOR:");
        console.error(error);

        return res.status(500).json({
            ok: false,
            respuesta:
                "NEXARIS 🌙: Ocurrió un error al conectar con el servicio de IA."
        });
    }
});

// ==========================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        ok: false,
        respuesta: "NEXARIS 🌙: Esta ruta no existe."
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("══════════════════════════════════════");
    console.log("🌙 NEXARIS PATHWAY");
    console.log("══════════════════════════════════════");
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log(`🤖 IA:       http://localhost:${PORT}/chat`);
    console.log(`📊 Estado:   http://localhost:${PORT}/status`);
    console.log("══════════════════════════════════════");
    console.log("✅ NEXARIS Server iniciado correctamente");
});