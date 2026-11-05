
import { Link } from 'react-router';

import ListaCartas from '../components/ListaCartas.jsx';
import { useProductos } from '../context/ProductosContext.jsx';
import { obtenerCategorias } from '../services/filtros.js';

// Página de inicio conectada al catálogo de JSON Server.
export default function Inicio({ onAgregar }) {
  const { cartas, cargando, error, recargar } = useProductos();

  const activas = cartas.filter((carta) => carta.activo);

  const destacadas = activas
    .filter((carta) => carta.destacado)
    .slice(0, 4);

  const ofertas = activas
    .filter((carta) => carta.oferta)
    .slice(0, 4);

  const cartasHero = (
    destacadas.length >= 3 ? destacadas : activas
  ).slice(0, 3);

  const categorias = obtenerCategorias(activas).slice(0, 4);

  if (cargando && cartas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <p className="text-body-secondary" role="status">
          Cargando productos...
        </p>
      </main>
    );
  }

  if (error && cartas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h4">No se pudieron cargar los productos</h1>

        <p className="text-body-secondary">
          Comprueba que JSON Server esté funcionando.
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => recargar().catch(() => {})}
        >
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main className="nexo-home">
      <section className="nexo-hero">
        <div className="container nexo-hero-inner">
          <div className="nexo-hero-copy">
            <p className="nexo-eyebrow">
              <span></span> Nexo Cartas · TCG & coleccionismo
            </p>

            <h1>
              Tu próxima pieza de colección <em>te espera.</em>
            </h1>

            <p className="nexo-hero-description">
              Explora cartas, encuentra nuevas favoritas y dale más
              personalidad a tu colección.
            </p>

            <div className="nexo-hero-actions">
              <Link
                to="/productos"
                className="btn btn-warning btn-lg"
              >
                Explorar colección{' '}
                <span aria-hidden="true">↗</span>
              </Link>

              <Link
                to="/ofertas"
                className="nexo-hero-secondary"
              >
                Ver ofertas{' '}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="nexo-hero-note">
              <span className="nexo-note-mark">✦</span>
              {' '}Cartas destacadas de la colección
            </div>
          </div>

          <div
            className="nexo-hero-art"
            aria-label="Cartas destacadas"
          >
            <div className="nexo-art-orbit nexo-art-orbit-one"></div>
            <div className="nexo-art-orbit nexo-art-orbit-two"></div>

            {cartasHero.map((carta, indice) => (
              <Link
                to={`/productos/${carta.id}`}
                className={`nexo-hero-card nexo-hero-card-${indice + 1}`}
                key={carta.id}
                aria-label={`Ver ${carta.nombre}`}
              >
                <img
                  src={carta.imagen}
                  alt={carta.nombre}
                  onError={(evento) => {
                    evento.currentTarget.onerror = null;
                    evento.currentTarget.src = '/img/sin-imagen.svg';
                  }}
                />
              </Link>
            ))}

            <div className="nexo-art-caption">
              <span>SELECCIÓN NEXO</span>
              <strong>Encuentra tu próxima favorita</strong>
            </div>
          </div>
        </div>

        <div
          className="nexo-hero-bottom container"
          aria-hidden="true"
        >
          <span>COLECCIONA LO QUE TE MUEVE</span>
          <span>01 — EXPLORA</span>
        </div>
      </section>

      <section
        className="container nexo-category-section"
        aria-labelledby="categorias-inicio"
      >
        <div className="nexo-section-kicker">
          Encuentra tu camino
        </div>

        <div className="nexo-category-row">
          <h2 id="categorias-inicio">
            Explora por categoría
          </h2>

          <div className="nexo-category-links">
            {categorias.map((categoria) => (
              <Link
                key={categoria}
                to={`/productos?categoria=${encodeURIComponent(categoria)}`}
              >
                {categoria}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}

            <Link
              className="nexo-category-all"
              to="/categorias"
            >
              Todas las categorías{' '}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="container nexo-benefits"
        aria-label="Herramientas de la tienda"
      >
        <div>
          <span className="nexo-benefit-icon">⌕</span>
          <strong>Busca a tu manera</strong>
          <small>
            Encuentra cartas por nombre o código.
          </small>
        </div>

        <div>
          <span className="nexo-benefit-icon">◈</span>
          <strong>Explora y compara</strong>
          <small>
            Filtra el catálogo por categoría.
          </small>
        </div>

        <div>
          <span className="nexo-benefit-icon">✦</span>
          <strong>Compra de prueba</strong>
          <small>
            El checkout es una simulación, sin cobros reales.
          </small>
        </div>
      </section>

      <section className="container nexo-product-section">
        <div className="nexo-section-heading">
          <div>
            <div className="nexo-section-kicker">
              Una selección especial
            </div>

            <h2>Cartas destacadas</h2>
          </div>

          <Link
            to="/productos"
            className="nexo-text-link"
          >
            Ver catálogo completo{' '}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ListaCartas
          cartas={destacadas}
          onAgregar={onAgregar}
        />
      </section>

      <section className="nexo-offer-band">
        <div className="container nexo-product-section">
          <div className="nexo-section-heading">
            <div>
              <div className="nexo-section-kicker">
                Un buen momento para sumar
              </div>

              <h2>Ofertas actuales</h2>
            </div>

            <Link
              to="/ofertas"
              className="nexo-text-link"
            >
              Ver todas las ofertas{' '}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ListaCartas
            cartas={ofertas}
            onAgregar={onAgregar}
          />
        </div>
      </section>
    </main>
  );
}
