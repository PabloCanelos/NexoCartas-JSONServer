import { useState } from 'react';
import { validarProducto } from '../services/validaciones.js';
import CampoFormulario from './CampoFormulario.jsx';

const IMAGEN_POR_DEFECTO = '/img/sin-imagen.svg';

const VALORES_VACIOS = {
  codigo: '',
  nombre: '',
  categoria: '',
  descripcion: '',
  coleccion: '',
  tipo: 'Coleccionable',
  rareza: '',
  idioma: 'Inglés',
  estado: 'Excelente',
  precio: '',
  stock: '',
  imagen: '',
  oferta: false,
  precioOferta: '',
  activo: true,
  destacado: false,
};

// Formulario de producto para "Nuevo" y "Editar".
// Props: inicial (producto a editar, opcional), categorias (lista de nombres),
// onGuardar(datos) que puede lanzar un Error (se muestra arriba), textoBoton.
export default function FormularioProducto({ inicial = null, categorias, onGuardar, textoBoton = 'Guardar', onCancelar }) {
  const [valores, setValores] = useState(() => ({
    ...VALORES_VACIOS,
    ...(inicial || {}),
    precioOferta: inicial?.precioOferta ?? '',
    imagen: inicial?.imagen === IMAGEN_POR_DEFECTO ? '' : inicial?.imagen ?? '',
  }));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setValores((actual) => ({ ...actual, [name]: type === 'checkbox' ? checked : value }));
  }

  function enviar(e) {
    e.preventDefault();
    const nuevos = validarProducto(valores);
    setErrores(nuevos);
    setErrorGeneral('');
    if (Object.keys(nuevos).length > 0) return;

    const datos = {
      ...valores,
      codigo: valores.codigo.trim(),
      nombre: valores.nombre.trim(),
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      imagen: valores.imagen.trim() || IMAGEN_POR_DEFECTO,
      oferta: valores.oferta,
    };
    if (valores.oferta) datos.precioOferta = Number(valores.precioOferta);
    else delete datos.precioOferta;

    try {
      onGuardar(datos);
    } catch (error) {
      setErrorGeneral(error.message);
    }
  }

  const opcionesCategoria = categorias.includes(valores.categoria) || !valores.categoria
    ? categorias
    : [...categorias, valores.categoria];

  return (
    <form onSubmit={enviar} noValidate className="card card-body">
      {errorGeneral && (
        <div className="alert alert-danger" role="alert">
          {errorGeneral}
        </div>
      )}
      <div className="row g-3">
        <CampoFormulario className="col-12 col-md-4" id="codigo" name="codigo" label="Código"
          value={valores.codigo} onChange={cambiar} error={errores.codigo} />
        <CampoFormulario className="col-12 col-md-8" id="nombre" name="nombre" label="Nombre"
          value={valores.nombre} onChange={cambiar} error={errores.nombre} />
        <CampoFormulario as="select" className="col-12 col-md-6" id="categoria" name="categoria" label="Categoría"
          value={valores.categoria} onChange={cambiar} error={errores.categoria}>
          <option value="">Selecciona una categoría</option>
          {opcionesCategoria.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </CampoFormulario>
        <CampoFormulario className="col-12 col-md-6" id="coleccion" name="coleccion" label="Colección"
          value={valores.coleccion} onChange={cambiar} />
        <CampoFormulario as="textarea" rows="2" className="col-12" id="descripcion" name="descripcion"
          label="Descripción" value={valores.descripcion} onChange={cambiar} />
        <CampoFormulario className="col-12 col-md-4" id="rareza" name="rareza" label="Rareza"
          value={valores.rareza} onChange={cambiar} />
        <CampoFormulario className="col-12 col-md-4" id="idioma" name="idioma" label="Idioma"
          value={valores.idioma} onChange={cambiar} />
        <CampoFormulario as="select" className="col-12 col-md-4" id="estado" name="estado" label="Estado"
          value={valores.estado} onChange={cambiar}>
          {['Nueva', 'Excelente', 'Buena', 'Usada'].map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </CampoFormulario>
        <CampoFormulario className="col-12 col-md-6" id="precio" name="precio" label="Precio (CLP)" type="number"
          min="0" value={valores.precio} onChange={cambiar} error={errores.precio} />
        <CampoFormulario className="col-12 col-md-6" id="stock" name="stock" label="Stock" type="number"
          min="0" value={valores.stock} onChange={cambiar} error={errores.stock} />
        <CampoFormulario className="col-12" id="imagen" name="imagen"
          label="Ruta de la imagen (opcional)" placeholder="/img/cartas/pokemon/archivo.webp"
          value={valores.imagen} onChange={cambiar} />

        <div className="col-12 d-flex flex-wrap gap-4">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="activo" name="activo"
              checked={valores.activo} onChange={cambiar} />
            <label className="form-check-label" htmlFor="activo">Publicado en la tienda</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="destacado" name="destacado"
              checked={valores.destacado} onChange={cambiar} />
            <label className="form-check-label" htmlFor="destacado">Destacado en Inicio</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="oferta" name="oferta"
              checked={valores.oferta} onChange={cambiar} />
            <label className="form-check-label" htmlFor="oferta">En oferta</label>
          </div>
        </div>

        {valores.oferta && (
          <CampoFormulario className="col-12 col-md-6" id="precioOferta" name="precioOferta"
            label="Precio de oferta (CLP)" type="number" min="0" value={valores.precioOferta}
            onChange={cambiar} error={errores.precioOferta} />
        )}
      </div>
      <div className="mt-4 d-flex gap-2">
        <button type="submit" className="btn btn-primary">{textoBoton}</button>
        {onCancelar && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
