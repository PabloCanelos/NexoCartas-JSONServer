import { Link } from 'react-router';
import { formatearPrecio, precioFinal } from '../services/formato.js';

// Muestra una carta. Todo llega por props: no tiene estado propio.
// onAgregar es una función que define el componente padre.
export default function TarjetaCarta({ carta, onAgregar }) {
  const sinStock = carta.stock <= 0;
  const enOferta = Boolean(carta.oferta && carta.precioOferta);

  return (
    <div className="card h-100 tarjeta-carta">
      {enOferta && <span className="badge text-bg-danger etiqueta-oferta">Oferta</span>}
      <Link to={`/productos/${carta.id}`}>
        <img src={carta.imagen} className="card-img-top" alt={carta.nombre} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/sin-imagen.svg'; }} />
      </Link>
      <div className="card-body d-flex flex-column">
        <h2 className="h6 card-title">
          <Link to={`/productos/${carta.id}`} className="text-reset text-decoration-none">
            {carta.nombre}
          </Link>
        </h2>
        <p className="text-body-secondary small mb-2">{carta.categoria}</p>
        <p className="fw-bold fs-5 mb-1">
          {formatearPrecio(precioFinal(carta))}
          {enOferta && (
            <span className="text-body-secondary fs-6 fw-normal ms-2 text-decoration-line-through">
              {formatearPrecio(carta.precio)}
            </span>
          )}
        </p>
        <p className={'small mb-3 ' + (sinStock ? 'text-danger' : 'text-success')}>
          {sinStock ? 'Sin stock' : `Quedan ${carta.stock}`}
        </p>
        <button
          type="button"
          className="btn btn-primary mt-auto"
          disabled={sinStock}
          onClick={() => onAgregar(carta.id)}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
