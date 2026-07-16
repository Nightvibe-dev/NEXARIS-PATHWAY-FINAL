import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 NEXARIS Server funcionando correctamente");
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/chat", async (req, res) => {

    console.log("📩 Mensaje recibido:", req.body.mensaje);

    try {

        const mensaje = req.body.mensaje;

        console.log("⏳ Enviando a Gemini...");

        const respuesta = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `
Eres NEXARIS PATHWAY, un orientador vocacional para estudiantes de secundaria.

INSTRUCCIONES OBLIGATORIAS:

1. Responde SIEMPRE en español.
2. Nunca escribas más de 150 palabras.
3. No hagas introducciones largas.
4. No vuelvas a presentarte si el usuario ya habló contigo.
5. Habla de forma natural, como un orientador, no como una enciclopedia.
6. Analiza primero los gustos del estudiante.
7. Recomienda máximo 4 carreras.
8. Explica cada carrera en una sola oración.
9. Usa viñetas.
10. Termina haciendo UNA sola pregunta.
11. Nunca escribas listas enormes ni artículos.
12. No uses títulos grandes.

Si el estudiante menciona:
- dibujo o diseño → prioriza Diseño Gráfico, Diseño UX/UI, Animación Digital.
- tecnología → prioriza Ingeniería de Software, Desarrollo de Videojuegos, IA.
- música → considera Producción Musical, Ingeniería de Sonido o Diseño Multimedia.

Pregunta del estudiante:
${mensaje}
`
        });

        console.log("✅ Gemini respondió");

        res.json({
            respuesta: respuesta.text
        });

    } catch (error) {

        console.error("❌ Error:", error);

        res.status(500).json({
            respuesta: "No pude comunicarme con Gemini."
        });

    }

});

app.listen(3000, "0.0.0.0", () => {

    console.log("✅ NEXARIS IA funcionando en puerto 3000");

}); 