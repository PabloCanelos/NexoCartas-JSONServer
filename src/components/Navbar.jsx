import { useState } from 'react';
import { Link, NavLink } from 'react-router';

const ENLACES = [
  { to: '/', texto: 'Inicio', exacto: true },
  { to: '/productos', texto: 'Productos' },
  { to: '/categorias', texto: 'Categorías' },
  { to: '/ofertas', texto: 'Ofertas' },
  { to: '/blog', texto: 'Blog' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/contacto', texto: 'Contacto' },
];

// Barra de navegación. Recibe por props la cantidad de productos del carrito
// y, si hay sesión, el usuario y la función para cerrarla.
// Maneja su propio estado solo para abrir/cerrar el menú en pantallas pequeñas.
export default function Navbar({ cantidadCarrito = 0, usuario = null, onSalir = () => {} }) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark nexo-navbar sticky-top">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/img/logo-nexocartas.svg" alt="" width="32" height="32" />
          NexoCartas
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="menu-principal"
          aria-expanded={abierto}
          aria-label="Abrir menú"
          onClick={() => setAbierto(!abierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          id="menu-principal"
          className={'collapse navbar-collapse' + (abierto ? ' show' : '')}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0" onClick={cerrar}>
            {ENLACES.map((enlace) => (
              <li className="nav-item" key={enlace.to}>
                <NavLink className="nav-link" to={enlace.to} end={enlace.exacto}>
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex flex-wrap align-items-center gap-2" onClick={cerrar}>
            <Link to="/carrito" className="btn btn-outline-light btn-sm">
              Carrito
              {cantidadCarrito > 0 && (
                <span className="badge text-bg-warning ms-2" data-testid="contador-carrito">
                  {cantidadCarrito}
                </span>
              )}
            </Link>
            {usuario ? (
              <>
                {usuario.rol === 'admin' && (
                  <Link to="/admin" className="btn btn-warning btn-sm">
                    Panel admin
                  </Link>
                )}
                <span className="navbar-text small">Hola, {usuario.nombre}</span>
                <button type="button" className="btn btn-link btn-sm text-white" onClick={onSalir}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-link btn-sm text-white">
                  Ingresar
                </Link>
                <Link to="/registro" className="btn btn-warning btn-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
