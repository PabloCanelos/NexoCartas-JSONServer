import { Link, useLocation } from 'react-router';

// Página /pago/error : la compra no se completó. El motivo llega por location.state.
export default function PagoError() {
  const { state } = useLocation();
  const mensaje = state?.mensaje || 'No pudimos procesar el pago.';

  return (
    <main className="container py-5">
      <div className="alert alert-danger" role="alert">
        <h1 className="h4 alert-heading">El pago no se completó</h1>
        <p className="mb-0">{mensaje}</p>
      </div>
      <p className="text-body-secondary">
        No se realizó ningún cobro y tu carrito sigue guardado. Puedes intentarlo nuevamente.
      </p>
      <Link to="/checkout" className="btn btn-primary me-2">
        Reintentar pago
      </Link>
      <Link to="/carrito" className="btn btn-outline-secondary">
        Volver al carrito
      </Link>
    </main>
  );
}
