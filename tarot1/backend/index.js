import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";  // Importar dotenv

dotenv.config();




// Inicializar CohereClient
const client = new CohereClient({ token: process.env.COHERE_API_KEY });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint para interpretar las cartas
app.post("/api/interpretar", async (req, res) => {
  const { pregunta, cartas } = req.body;

  try {
    const cartaInfo = cartas.map(
      (carta, index) =>
        `Carta ${index + 1}: ${carta.nombre} (${carta.posicion}). 
        Simbolismo: ${carta.simbolismo}. 
        Significado: ${
          carta.posicion === "derecho"
            ? carta.significado_derecho
            : carta.significado_invertido
        }`
    ).join("\n");

    const message = `
      Pregunta del usuario: "${pregunta}".
      Las cartas obtenidas:
      ${cartaInfo}.
       Interpreta las cartas, considerando su posición y significado, y responde a la pregunta de manera clara y directa. Si la pregunta no es de si o no evita esa respuesta
    `;

    // Solicitud al endpoint de chat de Cohere
    const response = await client.chat({
      message,
      model: "command-r-03-2024", 
      preamble: `
     Eres un lector de Tarot con una profunda comprensión intuitiva de las cartas. Tu tarea es interpretar sus significados y simbolismos para proporcionar una guía directa y útil. Mantén un tono cálido y accesible, evitando tecnicismos complejos.
     Proporciona una respuesta clara y amplíala con lo que las cartas sugieren. Separa el texto en párrafos y ten una estructura organizada. Sé coherente y habla en español hispanoamericano.  Sé empático y cuidadoso con el análisis, sobretodo cuando se traten de temas de salud, infidelidad odesamor-
  Evita:
 
  - Respuestas excesivamente largas.
  - Interpretaciones ambiguas o vagas.
  - Respuestas demasiado generales, enfócate en lo específico que las cartas revelan.
  
  Estructura la interpretación de la siguiente manera:
  1. Respuesta directa a la pregunta planteada (sí o no, si es aplicable, con detalles de las cartas).
  2. Interpretación de las cartas según su posición (pasado, presente, futuro).
  3. Consejo final basado en la información de las cartas, con recomendaciones prácticas.
      `,
    });

    // Obtener la interpretación generada
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

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
