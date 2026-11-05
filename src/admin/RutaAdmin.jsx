import { Navigate, Outlet } from 'react-router';
import { useSesion } from '../context/SesionContext.jsx';

// Ruta protegida: sin sesión va a /login y los clientes vuelven a la tienda.
// Solo el rol "admin" ve el contenido (Outlet = las rutas hijas).
export default function RutaAdmin() {
  const { usuario } = useSesion();
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
