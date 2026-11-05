
import { Link } from 'react-router';

import { useProductos } from '../context/ProductosContext.jsx';
import { obtenerCategorias } from '../services/filtros.js';

// Página /categorias: categorías y cantidad de cartas publicadas.
export default function Categorias() {
  const { cartas, cargando, error, recargar } = useProductos();

  const activas = cartas.filter((carta) => carta.activo);
  const categorias = obtenerCategorias(activas);

  if (cargando && cartas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <p className="text-body-secondary" role="status">
          Cargando categorías...
        </p>
      </main>
    );
  }

  if (error && cartas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h4">
          No se pudieron cargar las categorías
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
    <main className="container py-4 nexo-categories">
      <h1 className="h3 mb-3">Categorías</h1>

      {categorias.length === 0 ? (
        <div className="alert alert-info" role="status">
          Aún no hay categorías publicadas.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {categorias.map((categoria) => {
            const deLaCategoria = activas.filter(
              (carta) => carta.categoria === categoria
            );

            return (
              <div className="col" key={categoria}>
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <img
                      src={deLaCategoria[0].imagen}
                      alt=""
                      width="72"
                      className="rounded border"
                      onError={(evento) => {
                        evento.currentTarget.onerror = null;
                        evento.currentTarget.src = '/img/sin-imagen.svg';
                      }}
                    />

                    <div className="flex-grow-1">
                      <h2 className="h5 mb-1">
                        {categoria}
                      </h2>

                      <p className="text-body-secondary mb-0">
                        {deLaCategoria.length}{' '}
                        {deLaCategoria.length === 1
                          ? 'carta'
                          : 'cartas'}
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
