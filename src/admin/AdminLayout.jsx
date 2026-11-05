import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';

const SECCIONES = [
  { to: '/admin', texto: 'Dashboard', exacto: true },
  { to: '/admin/ordenes', texto: 'Órdenes / Boletas' },
  { to: '/admin/productos', texto: 'Productos' },
  { to: '/admin/categorias', texto: 'Categorías' },
  { to: '/admin/usuarios', texto: 'Usuarios' },
  { to: '/admin/reportes', texto: 'Reportes' },
  { to: '/admin/perfil', texto: 'Perfil' },
];

// Estructura del panel: barra lateral + contenido (Outlet). En móvil y tablet
// el menú se oculta y se abre con un botón (estado "abierto").
export default function AdminLayout() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-12 col-lg-2 admin-sidebar py-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Administración</span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm d-lg-none"
              aria-controls="menu-admin"
              aria-expanded={abierto}
              onClick={() => setAbierto(!abierto)}
            >
              Menú
            </button>
          </div>
          <nav
            id="menu-admin"
            aria-label="Secciones del panel"
            className={(abierto ? '' : 'd-none ') + 'd-lg-block mt-3'}
            onClick={() => setAbierto(false)}
          >
            <ul className="nav nav-pills flex-column gap-1">
              {SECCIONES.map((seccion) => (
                <li className="nav-item" key={seccion.to}>
                  <NavLink className="nav-link text-white" to={seccion.to} end={seccion.exacto}>
                    {seccion.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <section className="col-12 col-lg-10 py-4 px-lg-4">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
