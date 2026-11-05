import { useState } from 'react';
import { Link } from 'react-router';
import EstadoOrden from '../components/EstadoOrden.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import { ESTADOS_ORDEN } from '../data/datos.js';
import { useDatos } from '../hooks/useDatos.js';
import { formatearFecha, formatearPrecio } from '../services/formato.js';
import { obtenerOrdenes } from '../services/ordenesService.js';

// /admin/ordenes : listado de órdenes/boletas con filtro por estado y búsqueda.
export default function AdminOrdenes() {
  const [ordenes] = useDatos(obtenerOrdenes);
  const [estado, setEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const texto = busqueda.trim().toLowerCase();
  const visibles = ordenes
    .filter((o) => estado === '' || o.estado === estado)
    .filter(
      (o) =>
        texto === '' ||
        String(o.boleta).includes(texto) ||
        o.cliente.correo.toLowerCase().includes(texto) ||
        `${o.cliente.nombre} ${o.cliente.apellido}`.toLowerCase().includes(texto),
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const columnas = [
    { clave: 'boleta', titulo: 'Boleta', render: (o) => `N° ${o.boleta}` },
    { clave: 'fecha', titulo: 'Fecha', render: (o) => formatearFecha(o.fecha) },
    {
      clave: 'cliente',
      titulo: 'Cliente',
      render: (o) => (
        <>
          {o.cliente.nombre} {o.cliente.apellido}
          <div className="small text-body-secondary">{o.cliente.correo}</div>
        </>
      ),
    },
    { clave: 'total', titulo: 'Total', clase: 'text-end', render: (o) => formatearPrecio(o.total) },
    { clave: 'estado', titulo: 'Estado', render: (o) => <EstadoOrden estado={o.estado} /> },
    {
      clave: 'ver',
      titulo: '',
      render: (o) => (
        <Link to={`/admin/ordenes/${o.id}`} className="btn btn-outline-primary btn-sm">
          Ver boleta
        </Link>
      ),
    },
  ];

  return (
    <>
      <h1 className="h3 mb-3">Órdenes / Boletas</h1>
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-7">
          <label htmlFor="buscar-orden" className="visually-hidden">Buscar orden</label>
          <input id="buscar-orden" type="search" className="form-control"
            placeholder="Buscar por N° de boleta, nombre o correo" value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-12 col-md-5">
          <label htmlFor="filtro-estado" className="visually-hidden">Estado</label>
          <select id="filtro-estado" className="form-select" value={estado}
            onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {ESTADOS_ORDEN.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      <TablaDatos columnas={columnas} filas={visibles} claveFila="id"
        mensajeVacio="No hay órdenes que coincidan con el filtro." />
    </>
  );
}
