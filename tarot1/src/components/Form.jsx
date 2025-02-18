import TresCartasRandom from './TresCartasRandom';
import { useState } from 'react';
import './form.css'

export default function Form() {
  const [pregunta, setPregunta] = useState(""); // Estado para capturar la pregunta del usuario.
  const [cartas, setCartas] = useState([]);
  const [respuesta, setRespuesta] = useState(null); // Estado para almacenar la respuesta de la interpretación.

  const manejarTirada = async () => {
    const resultado = TresCartasRandom();
    setCartas(resultado);
  
    const datos = {
      pregunta,
      cartas: resultado.map((carta) => ({
        nombre: carta.nombre,
        posicion: carta.posicion,
        significado_derecho: carta.significado_derecho,
        significado_invertido: carta.significado_invertido,
       
      })),
    };
  
    try {
      const response = await fetch("https://backend-tarotia.vercel.app/api/interpretar", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
  
      if (response.ok) {
        const data = await response.json();
        setRespuesta(data); // Guardar la interpretación de Cohere
      } else {
        console.error('Error al interpretar las cartas:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };
 /* <p className="card-description">
                  {carta.posicion === "derecho"
                    ? carta.significado_derecho
                    : carta.significado_invertido}
                </p>*/
  return (
    <div id="form" className="form-container">
      <input
        type="text"
        className="input-question"
        placeholder="Hacé tu pregunta"
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
      />
      <button className="btn-throw" onClick={manejarTirada}>
        Tirar cartas
      </button>
  
      <div id="resultado" className="result-container">
        {cartas.length > 0 && (
          <ul className="card-list">
            {cartas.map((carta, index) => (
              <li key={index} className="card-item">
                <h3 className="card-title">
                  {carta.nombre}
                </h3>
                <img
                  src={carta.imagen}
                  alt={carta.nombre}
                  className={`card-image ${carta.posicion === 'invertido' ? 'inverted' : ''}`}
              
                />
                 ({carta.posicion})
              
              </li>
            ))}
          </ul>
        )}
  
  {respuesta && (
  <div className="interpretation-container">
    <h3 className="interpretation-title">Interpretación:</h3>
    {respuesta.interpretacion.split("**").map((texto, index) => (
      <p key={index} className="interpretation-text">
        {texto.trim()}
      </p>
    ))}
  </div>
)}

      </div>
    </div>
  );
}  