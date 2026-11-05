import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminCategorias from './admin/AdminCategorias.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminOrdenDetalle from './admin/AdminOrdenDetalle.jsx';
import AdminOrdenes from './admin/AdminOrdenes.jsx';
import AdminPerfil from './admin/AdminPerfil.jsx';
import AdminProductoEditar from './admin/AdminProductoEditar.jsx';
import AdminProductoNuevo from './admin/AdminProductoNuevo.jsx';
import AdminProductos from './admin/AdminProductos.jsx';
import AdminProductosCriticos from './admin/AdminProductosCriticos.jsx';
import AdminProductosReportes from './admin/AdminProductosReportes.jsx';
import AdminReportes from './admin/AdminReportes.jsx';
import AdminUsuarioDetalle from './admin/AdminUsuarioDetalle.jsx';
import AdminUsuarios from './admin/AdminUsuarios.jsx';
import RutaAdmin from './admin/RutaAdmin.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import { useCarrito } from './context/CarritoContext.jsx';
import { useSesion } from './context/SesionContext.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetalle from './pages/BlogDetalle.jsx';
import Carrito from './pages/Carrito.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Categorias from './pages/Categorias.jsx';
import Checkout from './pages/Checkout.jsx';
import Contacto from './pages/Contacto.jsx';
import Detalle from './pages/Detalle.jsx';
import Inicio from './pages/Inicio.jsx';
import Login from './pages/Login.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Ofertas from './pages/Ofertas.jsx';
import PagoCorrecto from './pages/PagoCorrecto.jsx';
import PagoError from './pages/PagoError.jsx';
import Registro from './pages/Registro.jsx';

// Componente raíz: arma la estructura (menú, contenido, pie) y las rutas.
// El carrito y la sesión viven en contextos (src/context).
export default function App() {
  const { agregar, cantidadTotal } = useCarrito();
  const { usuario, cerrarSesion } = useSesion();
  const [aviso, setAviso] = useState(null);

  // El aviso (toast) se cierra solo a los 3 segundos.
  useEffect(() => {
    if (!aviso) return undefined;
    const temporizador = setTimeout(() => setAviso(null), 3000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  function alAgregar(id, cantidad = 1) {
    setAviso(agregar(id, cantidad));
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar cantidadCarrito={cantidadTotal} usuario={usuario} onSalir={cerrarSesion} />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio onAgregar={alAgregar} />} />
          <Route path="/productos" element={<Catalogo onAgregar={alAgregar} />} />
          <Route path="/productos/:id" element={<Detalle onAgregar={alAgregar} />} />
          <Route path="/catalogo" element={<Navigate to="/productos" replace />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas onAgregar={alAgregar} />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago/correcto/:id" element={<PagoCorrecto />} />
          <Route path="/pago/error" element={<PagoError />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route element={<RutaAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="ordenes" element={<AdminOrdenes />} />
              <Route path="ordenes/:id" element={<AdminOrdenDetalle />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/nuevo" element={<AdminProductoNuevo />} />
              <Route path="productos/criticos" element={<AdminProductosCriticos />} />
              <Route path="productos/reportes" element={<AdminProductosReportes />} />
              <Route path="productos/:id/editar" element={<AdminProductoEditar />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/:id" element={<AdminUsuarioDetalle />} />
              <Route path="reportes" element={<AdminReportes />} />
              <Route path="perfil" element={<AdminPerfil />} />
            </Route>
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </div>
      <Footer />
      {aviso && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div
            className={'toast show align-items-center border-0 text-bg-' + (aviso.ok ? 'success' : 'warning')}
            role="status"
          >
            <div className="d-flex">
              <div className="toast-body">{aviso.mensaje}</div>
              <button
                type="button"
                className="btn-close me-2 m-auto"
                aria-label="Cerrar aviso"
                onClick={() => setAviso(null)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
