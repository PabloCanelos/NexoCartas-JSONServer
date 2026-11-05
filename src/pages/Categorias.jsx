import { Link } from 'react-router';
import { useCartas } from '../hooks/useCartas.js';
import { obtenerCategorias } from '../services/filtros.js';

// Página /categorias : una tarjeta por categoría, con su cantidad de cartas.
export default function Categorias() {
  const { cartas } = useCartas();
  const activas = cartas.filter((carta) => carta.activo);
  const categorias = obtenerCategorias(activas);

  return (
    <main className="container py-4 nexo-categories">
      <h1 className="h3 mb-3">Categorías</h1>
      {categorias.length === 0 ? (
        <div className="alert alert-info" role="status">
          Aún no hay categorías publicadas.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {categorias.map((categoria) => {
            const deLaCategoria = activas.filter((c) => c.categoria === categoria);
            return (
              <div className="col" key={categoria}>
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <img
                      src={deLaCategoria[0].imagen}
                      alt=""
                      width="72"
                      className="rounded border"
                    />
                    <div className="flex-grow-1">
                      <h2 className="h5 mb-1">{categoria}</h2>
                      <p className="text-body-secondary mb-0">
                        {deLaCategoria.length} {deLaCategoria.length === 1 ? 'carta' : 'cartas'}
                      </p>
                    </div>
                    <Link
                      to={`/productos?categoria=${encodeURIComponent(categoria)}`}
                      className="btn btn-primary"
                    >
                      Ver cartas
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
