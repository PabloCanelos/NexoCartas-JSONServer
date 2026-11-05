import { Link } from 'react-router';

// Marcador temporal de /admin. En el paso 4 se reemplaza por el panel completo.
export default function AdminPendiente() {
  return (
    <main className="container py-5 text-center">
      <h1 className="h3">Panel de administración</h1>
      <p className="text-body-secondary">Esta sección se construye en el siguiente paso.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </main>
  );
}
