
import { useState } from 'react';
import { Link } from 'react-router';

import TablaDatos from '../components/TablaDatos.jsx';
import { useProductos } from '../context/ProductosContext.jsx';
import { STOCK_CRITICO_DEFECTO } from '../data/datos.js';
import { formatearPrecio, precioFinal } from '../services/formato.js';
import SubmenuProductos from './SubmenuProductos.jsx';

export default function AdminProductos() {
  const {
    cartas,
    cargando,
    error,
    recargar,
    actualizar,
    eliminar,
  } = useProductos();

  const [busqueda, setBusqueda] = useState('');
  const [publicacion, setPublicacion] = useState('');
  const [confirmando, setConfirmando] = useState(null);
  const [procesando, setProcesando] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const texto = busqueda.trim().toLowerCase();

  const visibles = cartas
    .filter(
      (carta) =>
        texto === '' ||
        carta.nombre.toLowerCase().includes(texto) ||
        carta.codigo.toLowerCase().includes(texto),
    )
    .filter(
      (carta) =>
        publicacion === '' ||
        (publicacion === 'publicados') === carta.activo,
    );

  async function alternar(carta) {
    if (procesando !== null) return;

    setProcesando(carta.id);
    setMensaje(null);

    try {
      await actualizar(carta.id, { activo: !carta.activo });

      setMensaje({
        ok: true,
        texto: `"${carta.nombre}" ${
          carta.activo ? 'ocultada' : 'publicada'
        }.`,
      });
    } catch (err) {
      setMensaje({
        ok: false,
        texto: err instanceof Error
          ? err.message
          : 'No fue posible actualizar el producto.',
      });
    } finally {
      setProcesando(null);
    }
  }

  async function borrar(carta) {
    if (procesando !== null) return;

    setProcesando(carta.id);
    setMensaje(null);

    try {
      await eliminar(carta.id);

      setConfirmando(null);
      setMensaje({
        ok: true,
        texto: `"${carta.nombre}" eliminada.`,
      });
    } catch (err) {
      setMensaje({
        ok: false,
        texto: err instanceof Error
          ? err.message
          : 'No fue posible eliminar el producto.',
      });
    } finally {
      setProcesando(null);
    }
  }

  const columnas = [
    {
      clave: 'imagen',
      titulo: '',
      render: (carta) => (
        <img
          src={carta.imagen}
          alt=""
          width="40"
          className="rounded border"
          onError={(evento) => {
            evento.currentTarget.onerror = null;
            evento.currentTarget.src = '/img/sin-imagen.svg';
          }}
        />
      ),
    },
    { clave: 'codigo', titulo: 'Código' },
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'categoria', titulo: 'Categoría' },
    {
      clave: 'precio',
      titulo: 'Precio',
      clase: 'text-end',
      render: (carta) => formatearPrecio(precioFinal(carta)),
    },
    {
      clave: 'stock',
      titulo: 'Stock',
      clase: 'text-end',
      render: (carta) => (
        <span
          className={
            'badge text-bg-' +
            (carta.stock <= STOCK_CRITICO_DEFECTO
              ? 'danger'
              : 'success')
          }
        >
          {carta.stock}
        </span>
      ),
    },
    {
      clave: 'activo',
      titulo: 'Estado',
      render: (carta) =>
        carta.activo ? (
          'Publicado'
        ) : (
          <span className="text-body-secondary">Oculto</span>
        ),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (carta) =>
        confirmando === carta.id ? (
          <span className="d-inline-flex gap-1 align-items-center">
            <span className="small">¿Eliminar?</span>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              disabled={procesando !== null}
              onClick={() => borrar(carta)}
            >
              {procesando === carta.id ? 'Eliminando...' : 'Sí'}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={procesando !== null}
              onClick={() => setConfirmando(null)}
            >
              No
            </button>
          </span>
        ) : (
          <span className="d-inline-flex flex-wrap gap-1">
            <Link
              to={`/admin/productos/${carta.id}/editar`}
              className={
                'btn btn-outline-primary btn-sm' +
                (procesando !== null ? ' disabled' : '')
              }
              aria-disabled={procesando !== null}
              onClick={(evento) => {
                if (procesando !== null) evento.preventDefault();
              }}
            >
              Editar
            </Link>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={procesando !== null}
              onClick={() => alternar(carta)}
            >
              {procesando === carta.id
                ? 'Guardando...'
                : carta.activo
                  ? 'Ocultar'
                  : 'Publicar'}
            </button>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              disabled={procesando !== null}
              onClick={() => setConfirmando(carta.id)}
            >
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
        <div
          className={
            'alert py-2 alert-' +
            (mensaje.ok ? 'success' : 'danger')
          }
          role="status"
        >
          {mensaje.texto}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{error}</p>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => recargar().catch(() => {})}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-8">
          <label
            htmlFor="buscar-producto"
            className="visually-hidden"
          >
            Buscar producto
          </label>

          <input
            id="buscar-producto"
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o código"
            value={busqueda}
            onChange={(evento) =>
              setBusqueda(evento.target.value)
            }
          />
        </div>

        <div className="col-12 col-md-4">
          <label
            htmlFor="filtro-publicacion"
            className="visually-hidden"
          >
            Publicación
          </label>

          <select
            id="filtro-publicacion"
            className="form-select"
            value={publicacion}
            onChange={(evento) =>
              setPublicacion(evento.target.value)
            }
          >
            <option value="">Todos</option>
            <option value="publicados">Publicados</option>
            <option value="ocultos">Ocultos</option>
          </select>
        </div>
      </div>

      {cargando ? (
        <p role="status">Cargando productos...</p>
      ) : !error ? (
        <TablaDatos
          columnas={columnas}
          filas={visibles}
          claveFila="id"
          mensajeVacio="No hay productos que coincidan con el filtro."
        />
      ) : null}
    </>
  );
}
