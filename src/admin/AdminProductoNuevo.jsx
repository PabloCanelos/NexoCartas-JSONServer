import { useNavigate } from 'react-router';
import FormularioProducto from '../components/FormularioProducto.jsx';
import { useCartas } from '../hooks/useCartas.js';
import { obtenerNombresCategorias } from '../services/categoriasService.js';
import SubmenuProductos from './SubmenuProductos.jsx';

// /admin/productos/nuevo : crea una carta con el CRUD de datos simulados.
export default function AdminProductoNuevo() {
  const { crear } = useCartas();
  const navigate = useNavigate();

  function guardar(datos) {
    crear(datos); // si hay un error (por ejemplo código repetido) lo muestra el formulario
    navigate('/admin/productos');
  }

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>
      <SubmenuProductos />
      <h2 className="h5">Nuevo producto</h2>
      <FormularioProducto categorias={obtenerNombresCategorias()} onGuardar={guardar}
        textoBoton="Crear producto" onCancelar={() => navigate('/admin/productos')} />
    </>
  );
}
