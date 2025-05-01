import TresCartasRandom from './TresCartasRandom';
import { useState } from 'react';
import './form.css';

export default function Form() {
  const [pregunta, setPregunta] = useState("");
  const [cartas, setCartas] = useState([]);
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarTirada = async () => {
    setCargando(true);
    setRespuesta(null);

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
      const response = await fetch("https://backend-tarotia.vercel.app/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        const data = await response.json();
        setRespuesta(data);
      } else {
        console.error('Error al interpretar las cartas:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    } finally {
      setCargando(false);
    }
  };

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
                <h3 className="card-title">{carta.nombre}</h3>
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

        {cargando && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Interpretando...</p>
          </div>
        )}

{respuesta && (
  <div className="interpretation-container">
    <h3 className="interpretation-title">Interpretación de tus cartas:</h3>
    {respuesta.interpretacion.split(/(Pasado:|Presente:|Futuro:|Conclusión:)/g).map((texto, index) => (
      texto.trim() ? (
        <p key={index} className={`interpretation-text ${["Pasado:", "Presente:", "Futuro:", "Conclusión:"].includes(texto) ? "interpretation-title" : ""}`}>
          {texto}
        </p>
      ) : null
    ))}
  </div>
)}
      </div>
    </div>
  );
}
