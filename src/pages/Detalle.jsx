
import { useState } from 'react';
import { Link, useParams } from 'react-router';

import { useProductos } from '../context/ProductosContext.jsx';
import { formatearPrecio, precioFinal } from '../services/formato.js';

// Página /productos/:id : ficha completa de una carta.
export default function Detalle({ onAgregar }) {
  const { id } = useParams();

  const { cartas, cargando, error, recargar } = useProductos();

  const [cantidad, setCantidad] = useState(1);

  const carta = cartas.find(
    (producto) => producto.id === Number(id) && producto.activo
  );

  // Esperar a que JSON Server entregue los productos.
  if (cargando && cartas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <p className="text-body-secondary" role="status">
          Cargando producto...
        </p>
      </main>
    );
  }

  // Mostrar error si no fue posible obtener el catálogo.
  if (error && cartas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h4">
          No se pudo cargar el producto
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

  // Producto inexistente o no publicado.
  if (!carta) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">Producto no encontrado</h1>

        <p className="text-body-secondary">
          La carta que buscas no existe o ya no está publicada.
        </p>

        <Link to="/productos" className="btn btn-primary">
          Volver a productos
        </Link>
      </main>
    );
  }

  const sinStock = carta.stock <= 0;

  const enOferta = Boolean(
    carta.oferta && carta.precioOferta
  );

  // Mantener la cantidad dentro del stock disponible,
  // incluso cuando el inventario cambie.
  const cantidadDisponible = sinStock
    ? 1
    : Math.min(Math.max(1, cantidad), carta.stock);

  const datos = [
    ['Código', carta.codigo],
    ['Categoría', carta.categoria],
    ['Colección', carta.coleccion],
    ['Tipo', carta.tipo],
    ['Rareza', carta.rareza],
    ['Idioma', carta.idioma],
    ['Estado', carta.estado],
  ];

  function cambiarCantidad(evento) {
    const valor = Math.floor(Number(evento.target.value));

    if (!Number.isFinite(valor)) {
      return;
    }

    setCantidad(
      Math.max(1, Math.min(valor, carta.stock))
    );
  }

  function agregarAlCarrito() {
    if (sinStock) {
      return;
    }

    onAgregar(carta.id, cantidadDisponible);
  }

  return (
    <main className="container py-4">
      <nav
        aria-label="Ruta de navegación"
        className="small mb-3"
      >
        <Link to="/productos">Productos</Link>
        {' / '}
        {carta.nombre}
      </nav>

      <div className="row g-4">
        <div className="col-12 col-md-5 col-lg-4">
          <img
            src={carta.imagen}
            alt={carta.nombre}
            className="img-fluid rounded border bg-white w-100"
            onError={(evento) => {
              evento.currentTarget.onerror = null;
              evento.currentTarget.src = '/img/sin-imagen.svg';
            }}
          />
        </div>

        <div className="col-12 col-md-7 col-lg-8">
          <h1 className="h3">
            {carta.nombre}
          </h1>

          <p className="text-body-secondary">
            {carta.descripcion}
          </p>

          <p className="fs-3 fw-bold mb-1">
            {formatearPrecio(precioFinal(carta))}

            {enOferta && (
              <span className="text-body-secondary fs-6 fw-normal ms-2 text-decoration-line-through">
                {formatearPrecio(carta.precio)}
              </span>
            )}
          </p>

          <p className={sinStock ? 'text-danger' : 'text-success'}>
            {sinStock
              ? 'Sin stock'
              : `Disponibles: ${carta.stock}`}
          </p>

          <div className="d-flex align-items-end gap-2 mb-4">
            <div style={{ width: '110px' }}>
              <label
                htmlFor="cantidad"
                className="form-label"
              >
                Cantidad
              </label>

              <input
                id="cantidad"
                type="number"
                min="1"
                max={carta.stock}
                className="form-control"
                value={cantidadDisponible}
                disabled={sinStock}
                onChange={cambiarCantidad}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={sinStock}
              onClick={agregarAlCarrito}
            >
              Agregar al carrito
            </button>
          </div>

          <table className="table table-sm w-auto">
            <tbody>
              {datos.map(([etiqueta, valor]) => (
                <tr key={etiqueta}>
                  <th
                    scope="row"
                    className="fw-normal text-body-secondary pe-4"
                  >
                    {etiqueta}
                  </th>

                  <td>{valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
