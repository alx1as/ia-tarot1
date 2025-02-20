import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config(); // Solo necesario para el entorno local.

// Inicializar CohereClient
const client = new CohereClient({ token: process.env.COHERE_API_KEY });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint para interpretar las cartas
app.post("/api/interpretar", async (req, res) => {
  const { pregunta, cartas } = req.body;

  try {
    const cartaInfo = cartas.map((carta, index) =>
      `Carta ${index + 1}: ${carta.nombre} (${carta.posicion}).
      Simbolismo: ${carta.simbolismo}.
      Significado: ${
        carta.posicion === "derecho"
          ? carta.significado_derecho
          : carta.significado_invertido
      }`
    ).join("\n");

    const message = `
Pregunta del consultante: "${pregunta}".
Cartas extraídas:
${cartaInfo}.

Interpreta estas cartas con un estilo único: natural, directo, profesional y con una chispa de ironía y humor sutil. No te andes con rodeos; adapta el tono según la seriedad de la consulta, siendo siempre claro y cercano.

Formato de la interpretación:
- **Pasado:** La primera carta revela las huellas del pasado, sus ecos y cómo esas energías aún impactan el presente. Sé franco y, si es necesario, añade una pizca de ironía para ilustrar lo que ya quedó atrás.
- **Presente:** La carta del medio representa el aquí y ahora. Describe la situación actual con detalle, integrando referencias populares o retóricas para hacer la explicación amena. Puedes preguntar retóricamente, "¿No te suena a esa escena de película en la que...?" si encaja.
- **Futuro:** La última carta proyecta lo que podría venir, recordando que el futuro es flexible y depende de las decisiones. Si hay verdades incómodas, suéltalas con humor: un “No te lo voy a permitir” sutil o un “Dejate de joder” bien puesto, siempre con gracia.
- **Conclusión:** Conecta las tres lecturas en un consejo final o reflexión práctica. Cierra con una metáfora impactante o un chiste ligero que resuma la dirección a seguir, para que el consultante se sienta comprendido y animado.

Recuerda: cada respuesta debe sentirse como una charla honesta, en la que la sabiduría se mezcla con un toque irreverente, sin perder la claridad ni la empatía.
    `;

    const response = await client.chat({
      message,
      model: "command-r-plus-08-2024",
      temperature: 1,
      top_p: 1,
      preamble: `
Eres un lector de tarot moderno y perspicaz. Tu estilo es una mezcla perfecta entre profesionalismo, naturalidad y un toque irreverente. Sabes cuándo ser serio y cuándo dejar entrar una dosis de ironía y humor. Tu misión es iluminar la consulta con metáforas audaces y reflexiones profundas, sin caer en excesos. Usa frases como "No te lo voy a permitir" o "Dejate de joder" de forma sutil y con gracia, para que el consultante se sienta comprendido, animado y, sobre todo, que se caiga bien la respuesta.
      `
    });

    const interpretacion = response.text;

    res.json({
      interpretacion,
      cartas: cartaInfo,
    });
  } catch (error) {
    console.error("Error al interpretar las cartas:", error);
    res.status(500).json({ error: "Hubo un problema al procesar la interpretación." });
  }
});

export default app;
