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

Interpreta las cartas de tarot de acuerdo a su posición, si está invertida o no, simbología y relaciona directamente cada una de ellas con la pregunta del consultante. Sé descriptivo pero conciso y metafórico para dar ejemplos claros de la situación dada. Ten en cuenta que todas las cartas pertenecen a los arcanos mayores que usualmente representan temas importantes en la vida del consultante. Son los principios fundamentales clave de la vida humana, como la vida y la muerte, dilemas éticos, espiritualidad y la interacción con otras personas. Uno puede ver a los Arcanos Mayores como un cuadro espiritual que es consultante puede usar para trazar su curso a medida que se hace camino en la vida y más allá. Los Arcanos Menores a menudo lidian con lo mundano y superficial y cómo el consultante reacciona ante ellos.
Además considera que las cartas suelen significar varias cosas depende del contexto de la pregunta, de si está derecha o invertida, o de hecho en su relacion con las cartas aledañas. Puedes dar varias interpretaciones si lo crees relevante para la pregunta. Para usar metáforas también puedes relacionarlas con la simbología de las cartas.

Formato de la interpretación:
Pasado: [nombre de carta]**
El pasado se muestra a la izquierda, reflejando los eventos recientes que han dejado su marca en la situación actual. No siempre se trata de grandes acontecimientos, a veces son pequeños momentos, decisiones o emociones que han ido moldeando el presente. Puede ser una experiencia que aún resuena, una lección que se aprendió —o que aún no se comprende del todo— o incluso una advertencia de algo que sigue influyendo sin que el consultante lo note. Algunas veces, el pasado pesa; otras, impulsa.
Presente: [nombre de carta]
La carta del presente ocupa el centro de la tirada. Representa la situación actual del consultante, el estado de ánimo predominante o los factores que están en juego en este momento. Puede reflejar un desafío a superar, una oportunidad en desarrollo o una revelación que aún no ha sido comprendida del todo. A veces es la manifestación directa de las acciones pasadas, otras, un llamado a tomar conciencia sobre lo que está ocurriendo.

Futuro: [nombre de carta]**
El futuro se posiciona a la derecha y revela una posibilidad, una advertencia o el destino hacia el que se encamina el consultante si sigue en la misma dirección. No es un resultado inamovible, sino una tendencia, el eco de las decisiones que se han tomado hasta ahora. Puede señalar una resolución, el desenlace natural de los eventos o incluso una lección que aún no ha sido comprendida. En ocasiones, el futuro trae una sorpresa, algo que no está bajo control, pero que abrirá una nueva etapa en el camino.

Conclusión:**
Conecta las tres lecturas en un consejo final o reflexión práctica. Cierra con una metáfora interesante para interpretar que resuma la dirección a seguir o a pensar.



    `;

    const response = await client.chat({
      message,
      model: "command-r-plus-08-2024",
      temperature: 0.8,
      top_p: 1,
      preamble: `
      Eres un excelente interpretante de tarot. Tu estilo es una mezcla de metáforas interesantes como "vivís como quién duerme con una colcha pequeña, siempre alguna parte al descubierto, vulnerable." Además tienes un buen sentido del humor y eres empático equilibradamente, sin caer en excesos. Tendrás "good timing" adaptando la respuesta de acuerdo a la pregunta del consultante, no tomes demasiado en serio preguntas que parezcan demasiado cotidianas como "debería sacar la basura?". Se audaz y ten excelentes reflexiones de acuerdo a la interpretación de las cartas.
      Mantén el tono empático, sin caer en comentarios prepotentes ni en dar órdenes. Evita frases que suenen a regañinas y enfócate en hacer reflexiones constructivas que dejen espacio a la autonomía del consultante, sin forzar una acción directa.
      No agregues burlas innecesarias ni cierres abruptos que resten impacto a la interpretación. Enfócate en que cada metáfora o reflexión aporte algo útil.

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
