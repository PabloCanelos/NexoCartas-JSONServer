import { useState } from 'react';
import { useSearchParams } from 'react-router';
import BarraFiltros from '../components/BarraFiltros.jsx';
import ListaCartas from '../components/ListaCartas.jsx';
import { useCartas } from '../hooks/useCartas.js';
import { filtrarCartas, obtenerCategorias } from '../services/filtros.js';

// Página /productos: guarda en estado lo que escribe el usuario y filtra la lista.
// Si llega con ?categoria=... (desde la vista Categorías) parte con ese filtro.
export default function Catalogo({ onAgregar }) {
  const { cartas } = useCartas();
  const [parametros] = useSearchParams();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState(parametros.get('categoria') || '');

  const visibles = filtrarCartas(cartas, { busqueda, categoria });
  const hayFiltros = busqueda !== '' || categoria !== '';

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
        <p className="text-body-secondary small mb-0" aria-live="polite">
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
