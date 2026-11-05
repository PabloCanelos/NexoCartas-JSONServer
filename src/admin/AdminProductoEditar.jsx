
import { Link, useNavigate, useParams } from 'react-router';

import FormularioProducto from '../components/FormularioProducto.jsx';
import { useCategorias } from '../context/CategoriasContext.jsx';
import { useProductos } from '../context/ProductosContext.jsx';
import SubmenuProductos from './SubmenuProductos.jsx';

export default function AdminProductoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    cartas,
    cargando: cargandoProductos,
    error: errorProductos,
    actualizar,
    recargar: recargarProductos,
  } = useProductos();

  const {
    categorias,
    cargando: cargandoCategorias,
    error: errorCategorias,
    recargar: recargarCategorias,
  } = useCategorias();

  const carta = cartas.find(
    (producto) => producto.id === Number(id),
  );

  if (cargandoProductos || cargandoCategorias) {
    return <p role="status">Cargando producto y categorías...</p>;
  }

  if (errorProductos || errorCategorias) {
    return (
      <div className="alert alert-danger" role="alert">
        <p>{errorProductos || errorCategorias}</p>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => {
            Promise.allSettled([
              recargarProductos(),
              recargarCategorias(),
            ]);
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!carta) {
    return (
      <>
        <h1 className="h3 mb-3">Producto no encontrado</h1>

        <Link
          to="/admin/productos"
          className="btn btn-primary"
        >
          Volver al listado
        </Link>
      </>
    );
  }

  const nombresCategorias = categorias.map(
    (categoria) => categoria.nombre,
  );

  async function guardar(datos) {
    await actualizar(carta.id, datos);
    navigate('/admin/productos');
  }

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>

      <SubmenuProductos />

      <h2 className="h5">Editar: {carta.nombre}</h2>

      <FormularioProducto
        inicial={carta}
        categorias={nombresCategorias}
        onGuardar={guardar}
        textoBoton="Guardar cambios"
        onCancelar={() => navigate('/admin/productos')}
      />
    </>
  );
}
