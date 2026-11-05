import { formatearPrecio } from '../services/formato.js';

// Resumen de montos. Se usa en el carrito y en el checkout.
// "envio" es opcional: si no llega, solo se muestran subtotal y total.
export default function ResumenPedido({ lineas, subtotal, envio, children }) {
  const total = subtotal + (envio ?? 0);

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="h5 card-title">Resumen del pedido</h2>
        <ul className="list-unstyled small mb-3">
          {lineas.map((linea) => (
            <li key={linea.carta.id} className="d-flex justify-content-between gap-2">
              <span>
                {linea.cantidad} × {linea.carta.nombre}
              </span>
              <span>{formatearPrecio(linea.subtotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="row mb-0">
          <dt className="col-6 fw-normal">Subtotal</dt>
          <dd className="col-6 text-end">{formatearPrecio(subtotal)}</dd>
          {envio !== undefined && (
            <>
              <dt className="col-6 fw-normal">Entrega</dt>
              <dd className="col-6 text-end">{envio === 0 ? 'Gratis' : formatearPrecio(envio)}</dd>
            </>
          )}
          <dt className="col-6 fs-5">Total</dt>
          <dd className="col-6 text-end fs-5 fw-bold">{formatearPrecio(total)}</dd>
        </dl>
        {children}
      </div>
    </div>
  );
}
