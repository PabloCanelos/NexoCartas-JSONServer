import TarjetaCarta from './TarjetaCarta.jsx';

// Recorre la lista y dibuja una TarjetaCarta por cada elemento.
// Si no hay cartas, muestra un mensaje (renderizado condicional).
export default function ListaCartas({ cartas, onAgregar }) {
  if (cartas.length === 0) {
    return (
      <div className="alert alert-info" role="status">
        No hay cartas que coincidan con tu búsqueda.
      </div>
    );
  }

  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
      {cartas.map((carta) => (
        <div className="col" key={carta.id}>
          <TarjetaCarta carta={carta} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}
