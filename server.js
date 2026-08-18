import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 NEXARIS Server funcionando correctamente");
});

app.post("/chat", async (req, res) => {

    console.log("\n📩 Mensaje recibido:", req.body.mensaje);

    try {

        const mensaje = req.body.mensaje?.trim();

        if (!mensaje) {

            return res.status(400).json({
                respuesta: "Escribe una pregunta."
            });

        }
        const prompt = `
Eres NEXARIS PATHWAY 🤖, un orientador vocacional para estudiantes de secundaria.

Tu objetivo es ayudar al estudiante a descubrir carreras compatibles con sus intereses, habilidades y objetivos 🎓.

REGLAS:

- Responde siempre en español 🇵🇪.
- Máximo 150 palabras.
- Sé natural, directo y fácil de entender.
- Analiza primero los intereses del estudiante 🧠.
- Recomienda máximo 4 carreras 🎓.
- Explica cada carrera brevemente.
- Usa viñetas para organizar las recomendaciones.
- Usa emojis de manera natural y moderada.
- No pongas emojis en absolutamente todas las frases.
- Utiliza aproximadamente 1 emoji por cada punto importante.
- No hagas introducciones largas.
- No escribas artículos largos.
- Termina con UNA sola pregunta ❓.

EMOJIS RECOMENDADOS:

💻 Tecnología / programación
🎨 Diseño / dibujo / arte
🤖 Inteligencia Artificial
🔐 Ciberseguridad
🦾 Robótica
🎮 Videojuegos
🖌️ UX/UI
🎬 Animación
🔬 Ciencia / investigación
🩺 Medicina
🧠 Psicología
⚖️ Derecho
💼 Administración
📊 Contabilidad
🎓 Carreras / estudios
🚀 Proyectos / futuro
💡 Ideas / consejos
❓ Preguntas

ORIENTACIÓN:

Si menciona dibujo, arte o diseño:
- Diseño Gráfico 🎨
- Diseño UX/UI 🖌️
- Animación Digital 🎬

Si menciona programación o tecnología:
- Ingeniería de Software 💻
- Inteligencia Artificial 🤖
- Ciberseguridad 🔐
- Robótica 🦾

Si menciona música:
- Producción Musical 🎵
- Ingeniería de Sonido 🎧
- Diseño Multimedia 🎨

Pregunta del estudiante:

${mensaje}
`;

        console.log("⏳ Enviando a DV-YER...");

        const response = await fetch(
            `https://dv-yer-api.online/ai/gemini?apikey=${process.env.DVYER_API_KEY}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    prompt,
                    max_tokens: 500
                })
            }
        );

        console.log("📡 Status:", response.status);

        const textoRespuesta = await response.text();

        console.log("📦 Respuesta recibida.");

        if (!response.ok) {

            console.error("❌ Error de DV-YER:");
            console.error(textoRespuesta);

            return res.status(500).json({
                respuesta: "El servicio de IA devolvió un error."
            });

        }

        let data;

        try {

            data = JSON.parse(textoRespuesta);

        } catch {

            console.error("❌ DV-YER no devolvió JSON válido.");

            return res.status(500).json({
                respuesta: "La IA devolvió una respuesta no válida."
            });

        }

        console.log("🤖 Modelo:", data.model);
        console.log("⚡ Latencia:", data.latency_ms + " ms");

        if (!data.ok || !data.answer) {

            console.error(
                "⚠️ Respuesta inesperada de DV-YER:"
            );

            console.dir(data, { depth: null });

            return res.status(500).json({
                respuesta:
                    "La API de IA devolvió una respuesta inesperada."
            });

        }

        console.log("✅ NEXARIS recibió la respuesta correctamente.");

        res.json({
            respuesta: data.answer
        });

    } catch (error) {

        console.error("❌ ERROR DEL SERVIDOR:");
        console.error(error);

        res.status(500).json({
            respuesta:
                "No pude comunicarme con NEXARIS IA."
        });

    }

});

app.listen(3000, "0.0.0.0", () => {

    console.log(
        "✅ NEXARIS IA funcionando en http://localhost:3000"
    );

});