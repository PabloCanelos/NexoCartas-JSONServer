import { Link } from 'react-router';

// Página /nosotros : quiénes somos.
export default function Nosotros() {
  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Nosotros</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <p>
            NexoCartas es una tienda en línea de cartas coleccionables. Reunimos Pokémon,
            ediciones especiales y sobres de expansión en un solo lugar, con información clara
            sobre el estado, la rareza y el idioma de cada carta.
          </p>
          <p>
            Nuestro objetivo es que coleccionistas nuevos y experimentados encuentren piezas
            confiables, a precios en pesos chilenos y con una compra simple.
          </p>
          <p className="text-body-secondary small">
            Esta tienda es un proyecto de demostración: las compras son simuladas y no se
            realizan cobros ni despachos reales.
          </p>
          <Link to="/contacto" className="btn btn-primary">
            Escríbenos
          </Link>
        </div>
        <div className="col-12 col-lg-5">
          <div className="card card-body">
            <h2 className="h5">Lo que nos define</h2>
            <ul className="mb-0">
              <li>Información clara de cada carta</li>
              <li>Catálogo ordenado por categorías y ofertas</li>
              <li>Compra simple y transparente</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
