import { Link } from 'react-router';

export default function NoEncontrada() {
  return (
    <main className="container py-5 text-center">
      <h1 className="h3">No encontramos esa página</h1>
      <p className="text-body-secondary">La dirección no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </main>
  );
}
