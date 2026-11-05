
import { useState } from 'react';
import { Link } from 'react-router';

import TablaDatos from '../components/TablaDatos.jsx';
import { useProductos } from '../context/ProductosContext.jsx';
import { STOCK_CRITICO_DEFECTO } from '../data/datos.js';
import { productosCriticos } from '../services/reportesService.js';

import SubmenuProductos from './SubmenuProductos.jsx';

const REPOSICION = 5;

// /admin/productos/criticos: control y reposición de inventario.
export default function AdminProductosCriticos() {
  const { cartas, cargando, error, recargar, actualizar } = useProductos();

  const [umbral, setUmbral] = useState(
    String(STOCK_CRITICO_DEFECTO)
  );

  const [mensaje, setMensaje] = useState('');
  const [errorReposicion, setErrorReposicion] = useState('');
  const [productoProcesando, setProductoProcesando] = useState(null);

  const limite =
    umbral !== '' &&
    Number.isFinite(Number(umbral))
      ? Math.max(0, Number(umbral))
      : STOCK_CRITICO_DEFECTO;

  const criticos = productosCriticos(cartas, limite);

  async function reponer(carta) {
    if (productoProcesando !== null) {
      return;
    }

    setMensaje('');
    setErrorReposicion('');
    setProductoProcesando(carta.id);

    try {
      // Consultar el stock más reciente antes de reponer.
      // Así evitamos basarnos únicamente en el estado visual.
      const respuesta = await fetch(
        `http://localhost:3001/cartas/${carta.id}`
      );

      if (!respuesta.ok) {
        throw new Error(
          'No fue posible consultar el inventario actual.'
        );
      }

      const productoActual = await respuesta.json();

      if (
        !Number.isInteger(productoActual.stock) ||
        productoActual.stock < 0
      ) {
        throw new Error(
          'El producto tiene un stock inválido.'
        );
      }

      const nuevoStock = productoActual.stock + REPOSICION;

      // PATCH a JSON Server mediante el contexto compartido.
      await actualizar(carta.id, {
        stock: nuevoStock,
      });

      setMensaje(
        `Se agregaron ${REPOSICION} unidades a "${carta.nombre}". ` +
        `Stock actualizado: ${nuevoStock}.`
      );
    } catch (error) {
      setErrorReposicion(
        error instanceof Error
          ? error.message
          : 'No fue posible reponer el producto.'
      );
    } finally {
      setProductoProcesando(null);
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
    {
      clave: 'codigo',
      titulo: 'Código',
    },
    {
      clave: 'nombre',
      titulo: 'Nombre',
    },
    {
      clave: 'categoria',
      titulo: 'Categoría',
    },
    {
      clave: 'stock',
      titulo: 'Stock',
      clase: 'text-end',
      render: (carta) => (
        <span
          className={
            'badge text-bg-' +
            (carta.stock === 0 ? 'danger' : 'warning')
          }
        >
          {carta.stock}
        </span>
      ),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (carta) => (
        <span className="d-inline-flex flex-wrap gap-1">
          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            disabled={productoProcesando !== null}
            onClick={() => reponer(carta)}
          >
            {productoProcesando === carta.id
              ? 'Reponiendo...'
              : `Reponer +${REPOSICION}`}
          </button>

          <Link
            to={`/admin/productos/${carta.id}/editar`}
            className="btn btn-outline-primary btn-sm"
          >
            Editar
          </Link>
        </span>
      ),
    },
  ];

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>

      <SubmenuProductos />

      <h2 className="h5">Stock crítico</h2>

      <div
        className="mb-3"
        style={{ maxWidth: '260px' }}
      >
        <label
          htmlFor="umbral"
          className="form-label"
        >
          Mostrar productos con stock igual o menor a
        </label>

        <input
          id="umbral"
          type="number"
          min="0"
          className="form-control"
          value={umbral}
          onChange={(evento) =>
            setUmbral(evento.target.value)
          }
        />
      </div>

      {mensaje && (
        <div
          className="alert alert-success py-2"
          role="status"
        >
          {mensaje}
        </div>
      )}

      {errorReposicion && (
        <div
          className="alert alert-danger py-2"
          role="alert"
        >
          {errorReposicion}
        </div>
      )}

      {error && cartas.length === 0 && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          No se pudieron cargar los productos.

          <button
            type="button"
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => recargar().catch(() => {})}
          >
            Reintentar
          </button>
        </div>
      )}

      {cargando && cartas.length === 0 ? (
        <p className="text-body-secondary" role="status">
          Cargando inventario...
        </p>
      ) : !(error && cartas.length === 0) ? (
        <TablaDatos
          columnas={columnas}
          filas={criticos}
          claveFila="id"
          mensajeVacio="No hay productos con stock crítico con ese umbral."
        />
      ) : null}
    </>
  );
}
