import { Link, useParams } from 'react-router';
import EstadoOrden from '../components/EstadoOrden.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import { formatearFecha, formatearPrecio } from '../services/formato.js';
import { ordenesDeUsuario } from '../services/ordenesService.js';
import { esVendida } from '../services/reportesService.js';
import { buscarUsuarioPorId } from '../services/usuariosService.js';

// /admin/usuarios/:id : ficha del usuario con su historial de compras.
export default function AdminUsuarioDetalle() {
  const { id } = useParams();
  const usuario = buscarUsuarioPorId(id);

  if (!usuario) {
    return (
      <>
        <h1 className="h3">Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-primary">Volver a usuarios</Link>
      </>
    );
  }

  const ordenes = ordenesDeUsuario(usuario.correo).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const total = ordenes.filter(esVendida).reduce((suma, o) => suma + o.total, 0);

  const columnas = [
    { clave: 'boleta', titulo: 'Boleta', render: (o) => `N° ${o.boleta}` },
    { clave: 'fecha', titulo: 'Fecha', render: (o) => formatearFecha(o.fecha) },
    {
      clave: 'items',
      titulo: 'Cartas',
      render: (o) => o.items.map((item) => `${item.cantidad} × ${item.nombre}`).join(', '),
    },
    { clave: 'total', titulo: 'Total', clase: 'text-end', render: (o) => formatearPrecio(o.total) },
    { clave: 'estado', titulo: 'Estado', render: (o) => <EstadoOrden estado={o.estado} /> },
    {
      clave: 'ver',
      titulo: '',
      render: (o) => (
        <Link to={`/admin/ordenes/${o.id}`} className="btn btn-outline-primary btn-sm">Ver</Link>
      ),
    },
  ];

  return (
    <>
      <nav aria-label="Ruta de navegación" className="small mb-3">
        <Link to="/admin/usuarios">Usuarios</Link> / {usuario.nombre}
      </nav>
      <h1 className="h3">{usuario.nombre}</h1>
      <p className="text-body-secondary">
        {usuario.correo} · {usuario.rol} · {usuario.activo ? 'Activo' : 'Inactivo'} · registrado el{' '}
        {formatearFecha(usuario.creado)}
      </p>
      <h2 className="h5">Historial de compras</h2>
      <p className="small text-body-secondary">
        {ordenes.length} {ordenes.length === 1 ? 'orden' : 'órdenes'} · total comprado {formatearPrecio(total)}
      </p>
      <TablaDatos columnas={columnas} filas={ordenes} claveFila="id" mensajeVacio="Este usuario aún no tiene compras." />
    </>
  );
}
