import { useState } from 'react';
import TablaDatos from '../components/TablaDatos.jsx';
import TarjetaResumen from '../components/TarjetaResumen.jsx';
import { useCartas } from '../hooks/useCartas.js';
import { useDatos } from '../hooks/useDatos.js';
import { formatearPrecio } from '../services/formato.js';
import { obtenerOrdenes } from '../services/ordenesService.js';
import {
  filtrarPorFecha,
  resumenVentas,
  topProductos,
  ventasPorCategoria,
} from '../services/reportesService.js';

// /admin/reportes : ventas con filtro por rango de fechas.
export default function AdminReportes() {
  const { cartas } = useCartas();
  const [ordenes] = useDatos(obtenerOrdenes);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const rangoInvalido = desde !== '' && hasta !== '' && desde > hasta;
  const filtradas = rangoInvalido ? [] : filtrarPorFecha(ordenes, desde, hasta);
  const resumen = resumenVentas(filtradas);

  const columnasTop = [
    { clave: 'nombre', titulo: 'Carta' },
    { clave: 'unidades', titulo: 'Unidades', clase: 'text-end' },
    { clave: 'total', titulo: 'Total', clase: 'text-end', render: (f) => formatearPrecio(f.total) },
  ];
  const columnasCategoria = [
    { clave: 'categoria', titulo: 'Categoría' },
    { clave: 'unidades', titulo: 'Unidades', clase: 'text-end' },
    { clave: 'total', titulo: 'Total', clase: 'text-end', render: (f) => formatearPrecio(f.total) },
  ];

  return (
    <>
      <h1 className="h3 mb-3">Reportes de ventas</h1>
      <div className="row g-2 mb-3" style={{ maxWidth: '520px' }}>
        <div className="col-6">
          <label htmlFor="desde" className="form-label">Desde</label>
          <input id="desde" type="date" className="form-control" value={desde}
            onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div className="col-6">
          <label htmlFor="hasta" className="form-label">Hasta</label>
          <input id="hasta" type="date" className="form-control" value={hasta}
            onChange={(e) => setHasta(e.target.value)} />
        </div>
      </div>
      {rangoInvalido && (
        <div className="alert alert-warning" role="alert">
          La fecha "desde" no puede ser posterior a la fecha "hasta".
        </div>
      )}
      <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
        <div className="col"><TarjetaResumen titulo="Total vendido" valor={formatearPrecio(resumen.total)} variante="success" /></div>
        <div className="col"><TarjetaResumen titulo="Órdenes vendidas" valor={resumen.cantidad} /></div>
        <div className="col"><TarjetaResumen titulo="Ticket promedio" valor={formatearPrecio(resumen.promedio)} variante="info" /></div>
      </div>
      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <h2 className="h5">Más vendidas</h2>
          <TablaDatos columnas={columnasTop} filas={topProductos(filtradas, 5)} claveFila="productoId"
            mensajeVacio="No hay ventas en el periodo." />
        </div>
        <div className="col-12 col-xl-6">
          <h2 className="h5">Ventas por categoría</h2>
          <TablaDatos columnas={columnasCategoria} filas={ventasPorCategoria(filtradas, cartas)} claveFila="categoria"
            mensajeVacio="No hay ventas en el periodo." />
        </div>
      </div>
      <p className="small text-body-secondary">
        Cuentan como venta las órdenes confirmadas, enviadas y entregadas.
      </p>
    </>
  );
}
