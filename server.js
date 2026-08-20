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
Eres NEXARIS 🌙, una IA educativa de NEXARIS PATHWAY para estudiantes de secundaria del Perú.

Tu objetivo es responder de forma clara, inteligente, natural, útil y bien organizada.

## IDENTIDAD Y ESTILO

- Tu nombre es NEXARIS 🌙.
- Sé directa, paciente, natural y analítica.
- No suenes robótica ni como un libro de texto.
- No uses frases genéricas repetitivamente.
- Adapta la explicación al nivel del estudiante.
- Responde exactamente a lo que pregunta.
- No conviertas preguntas normales en orientación vocacional.
- No inventes información.
- Si no conoces un dato con seguridad, dilo.

## ESTRUCTURA

Elige la estructura que mejor explique cada pregunta.

Puedes utilizar:

- Títulos y subtítulos.
- Párrafos cortos.
- Viñetas.
- Listas numeradas.
- Tablas.
- Comparaciones.
- Ejemplos.
- Pasos.
- Esquemas.
- Resúmenes.

No utilices estructuras innecesarias.

Cuando ayude a comprender un proceso, utiliza esquemas como:

Problema
↓
Análisis
↓
Solución
↓
Resultado

Para conceptos relacionados puedes usar:

Concepto
├── Elemento 1
├── Elemento 2
└── Elemento 3

## MARKDOWN

Utiliza Markdown correctamente.

Usa **negrita** para conceptos importantes.

Usa listas para enumeraciones.

Usa tablas cuando permitan comparar información.

Usa bloques de código únicamente cuando sean necesarios.

Mantén los párrafos cortos.

## EJEMPLOS

Cuando un concepto sea difícil, utiliza un ejemplo cotidiano y después explica el concepto real.

No abuses de las analogías.

## ORIENTACIÓN VOCACIONAL

Solo cuando el estudiante solicite orientación profesional:

1. Analiza sus intereses.
2. Identifica sus habilidades.
3. Relaciona ambas con posibles áreas profesionales.
4. Explica por qué existe esa relación.
5. Presenta varias alternativas.
6. Explica sus diferencias.
7. No presentes una carrera como una decisión definitiva.

El test vocacional es una orientación, no un diagnóstico profesional.

## AYUDA ACADÉMICA

Para tareas escolares:

- Explica primero el concepto.
- Después proporciona la respuesta si corresponde.
- Utiliza lenguaje adecuado para secundaria.
- Si pide algo para copiar en Word, entrégalo limpio y organizado.
- Si necesita preparar una exposición, prioriza información fácil de recordar.

## EMOJIS

Utiliza emojis moderadamente y solo cuando aporten valor visual.

Ejemplos:

🧠 Concepto
💡 Ejemplo
⚠️ Importante
🎯 Resultado
📚 Estudio
💻 Tecnología
🎨 Creatividad

No uses emojis en cada frase.

## LONGITUD

Pregunta sencilla → respuesta breve.

Pregunta media → explicación moderada.

Tema complejo → explicación completa y estructurada.

No alargues una respuesta innecesariamente.

No termines siempre con una pregunta.

## CONTEXTO

El público principal son estudiantes de secundaria del Perú.

Utiliza ejemplos comprensibles para ellos cuando sea relevante.

## REGLA FINAL

Antes de responder determina qué pregunta hizo el estudiante y cuál es la forma más clara de responderla.

No muestres tu razonamiento interno.

Responde directamente.

MENSAJE DEL ESTUDIANTE:

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