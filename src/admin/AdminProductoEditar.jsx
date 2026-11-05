import { Link, useNavigate, useParams } from 'react-router';
import FormularioProducto from '../components/FormularioProducto.jsx';
import { useCartas } from '../hooks/useCartas.js';
import { obtenerNombresCategorias } from '../services/categoriasService.js';
import SubmenuProductos from './SubmenuProductos.jsx';

// /admin/productos/:id/editar : modifica una carta existente.
export default function AdminProductoEditar() {
  const { id } = useParams();
  const { cartas, actualizar } = useCartas();
  const navigate = useNavigate();
  const carta = cartas.find((c) => c.id === Number(id));

  if (!carta) {
    return (
      <>
        <h1 className="h3 mb-3">Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-primary">Volver al listado</Link>
      </>
    );
  }

  function guardar(datos) {
    actualizar(carta.id, datos);
    navigate('/admin/productos');
  }

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>
      <SubmenuProductos />
      <h2 className="h5">Editar: {carta.nombre}</h2>
      <FormularioProducto inicial={carta} categorias={obtenerNombresCategorias()} onGuardar={guardar}
        textoBoton="Guardar cambios" onCancelar={() => navigate('/admin/productos')} />
    </>
  );
}
