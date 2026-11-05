import { Link } from 'react-router';
import EstadoOrden from '../components/EstadoOrden.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import TarjetaResumen from '../components/TarjetaResumen.jsx';
import { STOCK_CRITICO_DEFECTO } from '../data/datos.js';
import { useCartas } from '../hooks/useCartas.js';
import { useDatos } from '../hooks/useDatos.js';
import { formatearFecha, formatearPrecio } from '../services/formato.js';
import { obtenerOrdenes } from '../services/ordenesService.js';
import { productosCriticos, resumenVentas } from '../services/reportesService.js';
import { obtenerUsuarios } from '../services/usuariosService.js';

// /admin : indicadores generales y las últimas órdenes.
export default function AdminDashboard() {
  const { cartas } = useCartas();
  const [ordenes] = useDatos(obtenerOrdenes);
  const [usuarios] = useDatos(obtenerUsuarios);

  const ventas = resumenVentas(ordenes);
  const criticos = productosCriticos(cartas.filter((c) => c.activo), STOCK_CRITICO_DEFECTO);
  const ultimas = [...ordenes].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);

  const columnas = [
    { clave: 'boleta', titulo: 'Boleta', render: (o) => `N° ${o.boleta}` },
    { clave: 'fecha', titulo: 'Fecha', render: (o) => formatearFecha(o.fecha) },
    { clave: 'cliente', titulo: 'Cliente', render: (o) => `${o.cliente.nombre} ${o.cliente.apellido}` },
    { clave: 'total', titulo: 'Total', clase: 'text-end', render: (o) => formatearPrecio(o.total) },
    { clave: 'estado', titulo: 'Estado', render: (o) => <EstadoOrden estado={o.estado} /> },
    {
      clave: 'ver',
      titulo: '',
      render: (o) => (
        <Link to={`/admin/ordenes/${o.id}`} className="btn btn-outline-primary btn-sm">
          Ver
        </Link>
      ),
    },
  ];

  return (
    <>
      <h1 className="h3 mb-3">Dashboard</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col">
          <TarjetaResumen titulo="Ventas" valor={formatearPrecio(ventas.total)}
            detalle={`${ventas.cantidad} órdenes vendidas`} variante="success" to="/admin/reportes" />
        </div>
        <div className="col">
          <TarjetaResumen titulo="Órdenes" valor={ordenes.length}
            detalle="Todas las órdenes registradas" to="/admin/ordenes" />
        </div>
        <div className="col">
          <TarjetaResumen titulo="Productos activos" valor={cartas.filter((c) => c.activo).length}
            detalle={`${cartas.length} en total`} variante="info" to="/admin/productos" />
        </div>
        <div className="col">
          <TarjetaResumen titulo="Stock crítico" valor={criticos.length}
            detalle={`Productos con ${STOCK_CRITICO_DEFECTO} unidades o menos`}
            variante="danger" to="/admin/productos/criticos" />
        </div>
      </div>
      <p className="text-body-secondary small">
        {usuarios.length} usuarios registrados ·{' '}
        <Link to="/admin/usuarios">Ver usuarios</Link>
      </p>
      <h2 className="h5">Últimas órdenes</h2>
      <TablaDatos columnas={columnas} filas={ultimas} claveFila="id" mensajeVacio="Aún no hay órdenes." />
    </>
  );
}
