import { Link } from 'react-router';
import { BLOG_POSTS } from '../data/datos.js';
import { formatearFecha } from '../services/formato.js';

// Página /blog : lista de artículos.
export default function Blog() {
  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Blog</h1>
      <div className="row row-cols-1 row-cols-md-2 g-3">
        {BLOG_POSTS.map((post) => (
          <div className="col" key={post.slug}>
            <article className="card h-100">
              <div className="card-body d-flex flex-column">
                <p className="text-body-secondary small mb-1">{formatearFecha(post.fecha)}</p>
                <h2 className="h5">{post.titulo}</h2>
                <p>{post.resumen}</p>
                <Link to={`/blog/${post.slug}`} className="btn btn-outline-primary mt-auto align-self-start">
                  Leer artículo
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
}
