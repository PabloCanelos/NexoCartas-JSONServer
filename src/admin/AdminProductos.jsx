import { useState } from 'react';
import { Link } from 'react-router';
import TablaDatos from '../components/TablaDatos.jsx';
import { STOCK_CRITICO_DEFECTO } from '../data/datos.js';
import { useCartas } from '../hooks/useCartas.js';
import { formatearPrecio, precioFinal } from '../services/formato.js';
import SubmenuProductos from './SubmenuProductos.jsx';

// /admin/productos : listado con búsqueda, publicar/ocultar y eliminar.
export default function AdminProductos() {
  const { cartas, actualizar, eliminar } = useCartas();
  const [busqueda, setBusqueda] = useState('');
  const [publicacion, setPublicacion] = useState('');
  const [confirmando, setConfirmando] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const texto = busqueda.trim().toLowerCase();
  const visibles = cartas
    .filter((c) => texto === '' || c.nombre.toLowerCase().includes(texto) || c.codigo.toLowerCase().includes(texto))
    .filter((c) => publicacion === '' || (publicacion === 'publicados') === c.activo);

  function alternar(carta) {
    try {
      actualizar(carta.id, { activo: !carta.activo });
      setMensaje({ ok: true, texto: `"${carta.nombre}" ${carta.activo ? 'ocultada' : 'publicada'}.` });
    } catch (error) {
      setMensaje({ ok: false, texto: error.message });
    }
  }

  function borrar(carta) {
    eliminar(carta.id);
    setConfirmando(null);
    setMensaje({ ok: true, texto: `"${carta.nombre}" eliminada.` });
  }

  const columnas = [
    { clave: 'imagen', titulo: '', render: (c) => <img src={c.imagen} alt="" width="40" className="rounded border" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/sin-imagen.svg'; }} /> },
    { clave: 'codigo', titulo: 'Código' },
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'categoria', titulo: 'Categoría' },
    { clave: 'precio', titulo: 'Precio', clase: 'text-end', render: (c) => formatearPrecio(precioFinal(c)) },
    {
      clave: 'stock',
      titulo: 'Stock',
      clase: 'text-end',
      render: (c) => (
        <span className={'badge text-bg-' + (c.stock <= STOCK_CRITICO_DEFECTO ? 'danger' : 'success')}>
          {c.stock}
        </span>
      ),
    },
    {
      clave: 'activo',
      titulo: 'Estado',
      render: (c) => (c.activo ? 'Publicado' : <span className="text-body-secondary">Oculto</span>),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (c) =>
        confirmando === c.id ? (
          <span className="d-inline-flex gap-1 align-items-center">
            <span className="small">¿Eliminar?</span>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => borrar(c)}>Sí</button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setConfirmando(null)}>No</button>
          </span>
        ) : (
          <span className="d-inline-flex flex-wrap gap-1">
            <Link to={`/admin/productos/${c.id}/editar`} className="btn btn-outline-primary btn-sm">Editar</Link>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => alternar(c)}>
              {c.activo ? 'Ocultar' : 'Publicar'}
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setConfirmando(c.id)}>
              Eliminar
            </button>
          </span>
        ),
    },
  ];

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>
      <SubmenuProductos />
      {mensaje && (
        <div className={'alert py-2 alert-' + (mensaje.ok ? 'success' : 'danger')} role="status">
          {mensaje.texto}
        </div>
      )}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-8">
          <label htmlFor="buscar-producto" className="visually-hidden">Buscar producto</label>
          <input id="buscar-producto" type="search" className="form-control" placeholder="Buscar por nombre o código"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="filtro-publicacion" className="visually-hidden">Publicación</label>
          <select id="filtro-publicacion" className="form-select" value={publicacion}
            onChange={(e) => setPublicacion(e.target.value)}>
            <option value="">Todos</option>
            <option value="publicados">Publicados</option>
            <option value="ocultos">Ocultos</option>
          </select>
        </div>
      </div>
      <TablaDatos columnas={columnas} filas={visibles} claveFila="id"
        mensajeVacio="No hay productos que coincidan con el filtro." />
    </>
  );
}
