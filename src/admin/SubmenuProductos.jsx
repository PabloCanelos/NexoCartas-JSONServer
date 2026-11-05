import { NavLink } from 'react-router';

const PESTANAS = [
  { to: '/admin/productos', texto: 'Listado', exacto: true },
  { to: '/admin/productos/nuevo', texto: 'Nuevo' },
  { to: '/admin/productos/criticos', texto: 'Críticos' },
  { to: '/admin/productos/reportes', texto: 'Reportes' },
];

// Pestañas comunes a todas las pantallas de Productos.
export default function SubmenuProductos() {
  return (
    <ul className="nav nav-tabs mb-3">
      {PESTANAS.map((pestana) => (
        <li className="nav-item" key={pestana.to}>
          <NavLink className="nav-link" to={pestana.to} end={pestana.exacto}>
            {pestana.texto}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
