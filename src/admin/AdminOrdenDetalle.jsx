import { useState } from 'react';
import { Link, useParams } from 'react-router';
import EstadoOrden from '../components/EstadoOrden.jsx';
import { ESTADOS_ORDEN } from '../data/datos.js';
import { formatearFecha, formatearPrecio } from '../services/formato.js';
import { actualizarEstadoOrden, buscarOrdenPorId } from '../services/ordenesService.js';

// /admin/ordenes/:id : boleta completa y cambio de estado.
export default function AdminOrdenDetalle() {
  const { id } = useParams();
  const [orden, setOrden] = useState(() => buscarOrdenPorId(id));
  const [aviso, setAviso] = useState('');

  if (!orden) {
    return (
      <>
        <h1 className="h3">Orden no encontrada</h1>
        <Link to="/admin/ordenes" className="btn btn-primary">Volver a órdenes</Link>
      </>
    );
  }

  function cambiarEstado(e) {
    const actualizada = actualizarEstadoOrden(orden.id, e.target.value);
    setOrden({ ...actualizada });
    setAviso('Estado actualizado.');
  }

  const { cliente, direccion, entrega } = orden;

  return (
    <>
      <nav aria-label="Ruta de navegación" className="small mb-3">
        <Link to="/admin/ordenes">Órdenes</Link> / Boleta N° {orden.boleta}
      </nav>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">
          Boleta N° {orden.boleta} <EstadoOrden estado={orden.estado} />
        </h1>
        <div>
          <label htmlFor="estado-orden" className="form-label small mb-1">Cambiar estado</label>
          <select id="estado-orden" className="form-select form-select-sm" value={orden.estado}
            onChange={cambiarEstado}>
            {ESTADOS_ORDEN.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      {aviso && <div className="alert alert-success py-2" role="status">{aviso}</div>}
      <p className="text-body-secondary">{formatearFecha(orden.fecha)}</p>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
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
        <div className="col-12 col-lg-4">
          <div className="card card-body">
            <h2 className="h6">Cliente</h2>
            <p className="small mb-3">
              {cliente.nombre} {cliente.apellido}<br />
              {cliente.correo} · {cliente.telefono}
            </p>
            <h2 className="h6">Dirección</h2>
            <p className="small mb-0">
              {direccion.calle} {direccion.numero}, {direccion.comuna}, {direccion.region}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
