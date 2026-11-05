import { useState } from 'react';
import { Link } from 'react-router';
import TablaDatos from '../components/TablaDatos.jsx';
import { STOCK_CRITICO_DEFECTO } from '../data/datos.js';
import { useCartas } from '../hooks/useCartas.js';
import { productosCriticos } from '../services/reportesService.js';
import SubmenuProductos from './SubmenuProductos.jsx';

const REPOSICION = 5;

// /admin/productos/criticos : productos con stock bajo el umbral elegido.
export default function AdminProductosCriticos() {
  const { cartas, actualizar } = useCartas();
  const [umbral, setUmbral] = useState(String(STOCK_CRITICO_DEFECTO));
  const [mensaje, setMensaje] = useState('');

  const limite = Number.isFinite(Number(umbral)) && umbral !== '' ? Number(umbral) : STOCK_CRITICO_DEFECTO;
  const criticos = productosCriticos(cartas, limite);

  function reponer(carta) {
    actualizar(carta.id, { stock: carta.stock + REPOSICION });
    setMensaje(`Se agregaron ${REPOSICION} unidades a "${carta.nombre}".`);
  }

  const columnas = [
    { clave: 'imagen', titulo: '', render: (c) => <img src={c.imagen} alt="" width="40" className="rounded border" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/sin-imagen.svg'; }} /> },
    { clave: 'codigo', titulo: 'Código' },
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'categoria', titulo: 'Categoría' },
    {
      clave: 'stock',
      titulo: 'Stock',
      clase: 'text-end',
      render: (c) => <span className={'badge text-bg-' + (c.stock === 0 ? 'danger' : 'warning')}>{c.stock}</span>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (c) => (
        <span className="d-inline-flex flex-wrap gap-1">
          <button type="button" className="btn btn-outline-success btn-sm" onClick={() => reponer(c)}>
            Reponer +{REPOSICION}
          </button>
          <Link to={`/admin/productos/${c.id}/editar`} className="btn btn-outline-primary btn-sm">Editar</Link>
        </span>
      ),
    },
  ];

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>
      <SubmenuProductos />
      <h2 className="h5">Stock crítico</h2>
      <div className="mb-3" style={{ maxWidth: '260px' }}>
        <label htmlFor="umbral" className="form-label">Mostrar productos con stock igual o menor a</label>
        <input id="umbral" type="number" min="0" className="form-control" value={umbral}
          onChange={(e) => setUmbral(e.target.value)} />
      </div>
      {mensaje && <div className="alert alert-success py-2" role="status">{mensaje}</div>}
      <TablaDatos columnas={columnas} filas={criticos} claveFila="id"
        mensajeVacio="No hay productos con stock crítico con ese umbral." />
    </>
  );
}
