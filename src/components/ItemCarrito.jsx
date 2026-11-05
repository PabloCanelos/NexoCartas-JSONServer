import { Link } from 'react-router';
import { formatearPrecio } from '../services/formato.js';

// Una fila de la tabla del carrito. Todo llega por props.
export default function ItemCarrito({ linea, onCantidad, onQuitar }) {
  const { carta, cantidad, precioUnitario, subtotal, disponible } = linea;

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <img src={carta.imagen} alt="" width="48" className="rounded border" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/sin-imagen.svg'; }} />
          <div>
            <Link to={`/productos/${carta.id}`} className="fw-semibold text-decoration-none">
              {carta.nombre}
            </Link>
            {!disponible && (
              <div className="text-danger small">Solo quedan {carta.stock} unidades.</div>
            )}
          </div>
        </div>
      </td>
      <td className="text-end">{formatearPrecio(precioUnitario)}</td>
      <td style={{ width: '110px' }}>
        <label htmlFor={`cantidad-${carta.id}`} className="visually-hidden">
          Cantidad de {carta.nombre}
        </label>
        <input
          id={`cantidad-${carta.id}`}
          type="number"
          min="1"
          max={carta.stock}
          className="form-control form-control-sm"
          value={cantidad}
          onChange={(e) => onCantidad(carta.id, e.target.value)}
        />
      </td>
      <td className="text-end fw-semibold">{formatearPrecio(subtotal)}</td>
      <td className="text-end">
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onQuitar(carta.id)}
        >
          Quitar
        </button>
      </td>
    </tr>
  );
}
