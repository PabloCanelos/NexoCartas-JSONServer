
import { useNavigate } from 'react-router';

import FormularioProducto from '../components/FormularioProducto.jsx';
import { useCategorias } from '../context/CategoriasContext.jsx';
import { useProductos } from '../context/ProductosContext.jsx';
import SubmenuProductos from './SubmenuProductos.jsx';

export default function AdminProductoNuevo() {
  const navigate = useNavigate();

  const { crear } = useProductos();

  const {
    categorias,
    cargando,
    error,
    recargar,
  } = useCategorias();

  async function guardar(datos) {
    await crear(datos);
    navigate('/admin/productos');
  }

  if (cargando) {
    return <p role="status">Cargando categorías...</p>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <p>{error}</p>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => recargar().catch(() => {})}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const nombresCategorias = categorias.map(
    (categoria) => categoria.nombre,
  );

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>

      <SubmenuProductos />

      <h2 className="h5">Nuevo producto</h2>

      <FormularioProducto
        categorias={nombresCategorias}
        onGuardar={guardar}
        textoBoton="Crear producto"
        onCancelar={() => navigate('/admin/productos')}
      />
    </>
  );
}
