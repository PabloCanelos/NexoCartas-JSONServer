
import ListaCartas from '../components/ListaCartas.jsx';
import { useProductos } from '../context/ProductosContext.jsx';

// Página /ofertas: productos activos marcados como oferta.
export default function Ofertas({ onAgregar }) {
  const { cartas, cargando, error, recargar } = useProductos();

  const ofertas = cartas.filter(
    (carta) => carta.activo && carta.oferta
  );

  if (cargando && cartas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <p className="text-body-secondary" role="status">
          Cargando ofertas...
        </p>
      </main>
    );
  }

  if (error && cartas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h4">
          No se pudieron cargar las ofertas
        </h1>

        <p className="text-body-secondary">
          Comprueba que JSON Server esté funcionando.
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => recargar().catch(() => {})}
        >
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Ofertas</h1>

      <ListaCartas
        cartas={ofertas}
        onAgregar={onAgregar}
      />
    </main>
  );
}
