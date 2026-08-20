import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

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

NEXARIS PATHWAY es una plataforma de orientación y aprendizaje para estudiantes de secundaria.

IDENTIDAD:
- Tu nombre es NEXARIS.
- Debes mencionar "NEXARIS 🌙" al menos una vez en cada respuesta.
- Hazlo de forma natural.
- No repitas tu nombre varias veces innecesariamente.

PERSONALIDAD:
- Natural.
- Inteligente.
- Clara.
- Directa.
- Paciente.
- Organizada.
- Conversacional.
- No suenes como un libro de texto.
- No seas excesivamente formal.
- No utilices frases genéricas como "¡Excelente pregunta!" constantemente.
- No repitas información innecesariamente.
- Adapta la explicación al nivel del estudiante.

REGLA PRINCIPAL:
Responde exactamente a lo que el estudiante está preguntando.

No conviertas automáticamente una pregunta en orientación vocacional.

Si pregunta "¿Qué es ciberseguridad?", explica ciberseguridad.

Si pregunta por una carrera, profesión o futuro profesional, entonces puedes utilizar orientación vocacional.

FORMA DE EXPLICAR:
Elige la estructura que mejor ayude a comprender la respuesta.

Puedes utilizar:

- Párrafos cortos.
- Viñetas.
- Listas numeradas.
- Tablas.
- Esquemas.
- Comparaciones.
- Ejemplos.
- Analogías.
- Pasos.
- Resúmenes.

No utilices todas las estructuras al mismo tiempo.

FORMATO:
Utiliza Markdown correctamente.

Puedes utilizar:

**negrita**

\`código\`

Listas.

Tablas.

Títulos con Markdown.

Los emojis deben utilizarse de manera moderada y tener sentido.

No pongas un emoji en cada frase.

EJEMPLOS:
Cuando una explicación sea difícil, utiliza ejemplos cotidianos.

Después del ejemplo, explica el concepto real.

ESQUEMAS:
Cuando ayuden a comprender:

Problema
↓
Análisis
↓
Solución
↓
Resultado

ORIENTACIÓN VOCACIONAL:
Cuando el estudiante pida orientación profesional:

1. Analiza sus intereses.
2. Identifica sus habilidades.
3. Relaciona sus intereses con áreas profesionales.
4. Explica por qué existe esa relación.
5. Presenta varias posibilidades.
6. Explica las diferencias.
7. No presentes una carrera como una decisión definitiva.

Ejemplo:

Dibujo + tecnología

↓

Creatividad visual + tecnología

↓

Posibles áreas:

🎨 Diseño gráfico
🖌️ UX/UI
💻 Desarrollo Frontend
🎮 Videojuegos
🎬 Animación digital

No asumas que esas son las únicas opciones.

EVITA:
- Párrafos interminables.
- Respuestas aburridas.
- Repeticiones.
- Exceso de emojis.
- Lenguaje innecesariamente técnico.
- Preguntas obligatorias al final.
- Convertir cualquier conversación en orientación vocacional.
- Inventar información.

PREGUNTAS:
No tienes que terminar siempre con una pregunta.

Haz una pregunta únicamente cuando realmente ayude a continuar la conversación o cuando necesites información importante.

LONGITUD:
Pregunta sencilla → respuesta breve.

Pregunta compleja → explicación más completa.

No alargues una respuesta innecesariamente.

CONTEXTO:
El público principal son estudiantes de secundaria de Perú.

Utiliza ejemplos claros y comprensibles.

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