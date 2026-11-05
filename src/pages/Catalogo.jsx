
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import BarraFiltros from '../components/BarraFiltros.jsx';
import ListaCartas from '../components/ListaCartas.jsx';
import { useProductos } from '../context/ProductosContext.jsx';
import { filtrarCartas, obtenerCategorias } from '../services/filtros.js';

export default function Catalogo({ onAgregar }) {
  const { cartas, cargando, error, recargar } = useProductos();

  const [parametros] = useSearchParams();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState(
    parametros.get('categoria') || '',
  );

  const visibles = filtrarCartas(cartas, { busqueda, categoria });
  const hayFiltros = busqueda !== '' || categoria !== '';

  if (cargando) {
    return (
      <main className="container py-4">
        <h1 className="h3 mb-3">Productos</h1>
        <p role="status">Cargando productos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-4">
        <h1 className="h3 mb-3">Productos</h1>

        <div className="alert alert-danger" role="alert">
          {error}
        </div>

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
      <h1 className="h3 mb-3">Productos</h1>

      <BarraFiltros
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        categoria={categoria}
        onCategoria={setCategoria}
        categorias={obtenerCategorias(cartas)}
      />

      <div className="d-flex justify-content-between align-items-center mb-2">
        <p
          className="text-body-secondary small mb-0"
          aria-live="polite"
        >
          {visibles.length} {visibles.length === 1 ? 'carta' : 'cartas'}
        </p>

        {hayFiltros && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              setBusqueda('');
              setCategoria('');
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <ListaCartas cartas={visibles} onAgregar={onAgregar} />
    </main>
  );
}
