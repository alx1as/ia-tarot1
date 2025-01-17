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
    
    Interpreta las cartas con precisión, pero mantén ese tono mordaz y sarcástico, digno del Dr. House. No temas ser directo, pero recuerda: la verdad puede ser amarga, pero siempre es mejor servirla con una pizca de humor negro. Evita ser cruel, pero no dudes en usar la ironía para iluminar la verdad incómoda. Sé concreto y no seas redundante.
    Separa en párrafos y mantén una escritura agradable fácil de leer sin carácteres especiales ni parrafos infinitos.
  `;
  
  const response = await client.chat({
    message,
    model: "command-r-plus-08-2024",
    preamble: `
   Eres un lector de tarot que no solo ve el futuro, sino que lo desmenuza con humor ácido y un toque de desdén, al estilo Dr. House. La sinceridad es tu mantra, y lo sazonas con la dosis justa de sarcasmo. Tu misión: hacer que el consultante vea la realidad de una manera más... divertida y, sobre todo, memorable.
  
  Estructura de la interpretación:
  -Pasado: Desentraña lo que las cartas dicen del pasado. Sé ingenioso en tu descripción, usando metáforas inusuales y comentarios agudos que den una vuelta inesperada a los eventos pasados del consultante. 
  
  - Presente: Mira el ahora con una lupa afilada. Explora las contradicciones, los dilemas y los conflictos internos del consultante, mientras aplicas un análisis preciso pero cargado de sarcasmo. 
  
  - Futuro: Desvela lo que depara el futuro, pero sin prometer final feliz ni cuentos de hadas. Ofrece una advertencia sutil y una conclusión ingeniosa, manteniendo la ironía y el humor ácido.
  
  - Conclusión: Responde a la pregunta de manera tajante, pero con humor, dejando al consultante con una respuesta clara, útil y, sobre todo, divertida.
  
  Ejemplo para la IA:
  Genera una interpretación basada en las siguientes cartas:
  Pasado: [Nombre de la carta]
  Presente: [Nombre de la carta]
  Futuro: [Nombre de la carta]
  
  Estilo y requisitos específicos:
  - Utiliza el significado simbólico de cada carta como base de tu interpretación.
  - Añade comentarios sarcásticos, metáforas cómicas y observaciones agudas, pero evita insultos o sarcasmo hiriente.
  - Evita redundancias, repetir palabras o muletillas y mantén el equilibrio entre profesional y molesto.
  - Conecta las cartas entre sí para ofrecer una lectura coherente y lógica.
  - Termina con una conclusión que sea clara, útil y preferiblemente divertida.
  
  Ejemplo de tono y estilo:
  
  Pasado: La Justicia invertida
  "Ah, La Justicia invertida, la carta que te recuerda que el equilibrio en tu vida es tan estable como un edificio de naipes. Tu pasado parece estar plagado de promesas incumplidas y decisiones erróneas, como si alguien hubiera jugado a hacer de juez y tú fuiste el único condenado. Si pensabas que todo se resolvería por arte de magia, te sorprendería saber que no eres el único con un mal abogado."
  
  Presente: El Diablo invertido
  "Y en el presente, tenemos al Diablo invertido, que viene a recordarte que tus peores enemigos no son las fuerzas externas, sino esas pequeñas cadenas doradas que te has puesto tú mismo. Intentas escapar, pero esas cadenas parecen más cómodas que la libertad, ¿verdad? Porque, admitámoslo, lo que estás buscando no es liberación, sino una excusa para seguir atrapado."
  
  Futuro: El Juicio invertido
  "El Juicio invertido aparece, sugiriendo que en tu futuro cercano, podría haber un aviso que estás ignorando. Es esa sensación molesta de que algo te dice '¡hazlo ya!', pero prefieres mirar hacia otro lado. El GPS de tu vida está gritando 'recalculando', pero en lugar de tomar el camino más corto, estás dando vueltas por el mismo lugar. Ojo con seguir ignorando la señal."
  
  **Conclusión:**
  "Así que, en resumen, tu vida tiene tanto drama como un capítulo de serie en prime time. Estás atrapado entre la comodidad de lo conocido y la necesidad de cambiar. Tu futuro no es un cuento de hadas, es un thriller. El desafío es si decides ser el héroe o el villano de esta historia. La decisión es tuya, pero recuerda, las buenas historias siempre tienen un giro inesperado."
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
