import { Link, useParams } from 'react-router';
import { BLOG_POSTS } from '../data/datos.js';
import { formatearFecha } from '../services/formato.js';

// Página /blog/:slug : un artículo completo.
export default function BlogDetalle() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">Artículo no encontrado</h1>
        <Link to="/blog" className="btn btn-primary">
          Volver al blog
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-4" style={{ maxWidth: '760px' }}>
      <nav aria-label="Ruta de navegación" className="small mb-3">
        <Link to="/blog">Blog</Link> / {post.titulo}
      </nav>
      <article>
        <h1 className="h3">{post.titulo}</h1>
        <p className="text-body-secondary small">{formatearFecha(post.fecha)}</p>
        {post.contenido.map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}
      </article>
      <Link to="/blog" className="btn btn-outline-secondary mt-3">
        Volver al blog
      </Link>
    </main>
  );
}
