import { Link } from 'react-router';

// Indicador numérico del Dashboard. Todo llega por props.
// Si recibe "to", la tarjeta incluye un enlace de "Ver detalle".
export default function TarjetaResumen({ titulo, valor, detalle, variante = 'primary', to }) {
  return (
    <div className={`card h-100 border-${variante} border-top border-3`}>
      <div className="card-body">
        <p className="text-body-secondary small mb-1">{titulo}</p>
        <p className="fs-3 fw-bold mb-1" data-testid="valor-resumen">
          {valor}
        </p>
        {detalle && <p className="small text-body-secondary mb-0">{detalle}</p>}
        {to && (
          <Link to={to} className="small stretched-link">
            Ver detalle
          </Link>
        )}
      </div>
    </div>
  );
}
