import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="nexo-footer mt-5 py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <strong>NexoCartas</strong>
          <p className="small mb-0">Cartas coleccionables. Compra simulada: no se realizan cobros reales.</p>
        </div>
        <ul className="list-unstyled small mb-0 d-flex flex-wrap gap-3">
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </div>
    </footer>
  );
}
