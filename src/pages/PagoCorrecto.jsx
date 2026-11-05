import { Link, useParams } from 'react-router';
import { buscarOrdenPorId } from '../services/ordenesService.js';
import { formatearFecha, formatearPrecio } from '../services/formato.js';

// Página /pago/correcto/:id : boleta de la compra simulada.
export default function PagoCorrecto() {
  const { id } = useParams();
  const orden = buscarOrdenPorId(id);

  if (!orden) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">No encontramos esa orden</h1>
        <Link to="/productos" className="btn btn-primary">
          Volver a productos
        </Link>
      </main>
    );
  }

  const { cliente, direccion, entrega } = orden;

  return (
    <main className="container py-4">
      <div className="alert alert-success" role="status">
        <h1 className="h4 alert-heading">¡Pago correcto!</h1>
        Tu compra simulada fue confirmada. Boleta N° {orden.boleta}
        {' · '}
        {formatearFecha(orden.fecha)}.
      </div>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="table-responsive">
            <table className="table bg-white">
              <thead>
                <tr>
                  <th scope="col">Carta</th>
                  <th scope="col" className="text-end">Cant.</th>
                  <th scope="col" className="text-end">Precio</th>
                  <th scope="col" className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orden.items.map((item) => (
                  <tr key={item.productoId}>
                    <td>{item.nombre}</td>
                    <td className="text-end">{item.cantidad}</td>
                    <td className="text-end">{formatearPrecio(item.precioUnitario)}</td>
                    <td className="text-end">{formatearPrecio(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">Entrega ({entrega.nombre})</td>
                  <td className="text-end">{entrega.costo === 0 ? 'Gratis' : formatearPrecio(entrega.costo)}</td>
                </tr>
                <tr>
                  <th colSpan="3" className="text-end">Total</th>
                  <th className="text-end">{formatearPrecio(orden.total)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="card card-body">
            <h2 className="h6">Cliente</h2>
            <p className="small mb-3">
              {cliente.nombre} {cliente.apellido}
              <br />
              {cliente.correo} · {cliente.telefono}
            </p>
            <h2 className="h6">Dirección</h2>
            <p className="small mb-0">
              {direccion.calle} {direccion.numero}, {direccion.comuna}, {direccion.region}
              {direccion.referencias && (
                <>
                  <br />
                  {direccion.referencias}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <Link to="/productos" className="btn btn-primary mt-3">
        Seguir comprando
      </Link>
    </main>
  );
}
