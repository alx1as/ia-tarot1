import mazo from '/mazoArcanosMayores.json';

function TresCartasRandom() {
    //LÓGICA DE SELECCIÓN RANDOM DE 3 CARTAS:
    const mazoAleatorio = [...mazo].sort(() => Math.random() - 0.5);
    const tresCartas = mazoAleatorio.slice(0, 3).map((carta) => {
      const posicion = Math.random() > 0.5 ? 'derecho' : 'invertido';
      return { ...carta, posicion };
    });
    return tresCartas;
    }

export default TresCartasRandom;