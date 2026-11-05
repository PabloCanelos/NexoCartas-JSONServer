import { useState } from 'react';
import TablaDatos from '../components/TablaDatos.jsx';
import { useDatos } from '../hooks/useDatos.js';
import {
  crearCategoria,
  eliminarCategoria,
  obtenerCategoriasConConteo,
  renombrarCategoria,
} from '../services/categoriasService.js';
import { validarCategoria } from '../services/validaciones.js';

// /admin/categorias : crear, renombrar y eliminar categorías.
export default function AdminCategorias() {
  const [categorias, recargar] = useDatos(obtenerCategoriasConConteo);
  const [nueva, setNueva] = useState('');
  const [errorNueva, setErrorNueva] = useState('');
  const [editando, setEditando] = useState(null); // { original, valor }
  const [errorEdicion, setErrorEdicion] = useState('');
  const [mensaje, setMensaje] = useState(null);

  function crear(e) {
    e.preventDefault();
    const nombres = categorias.map((c) => c.nombre);
    const error = validarCategoria(nueva, nombres);
    setErrorNueva(error);
    if (error) return;
    crearCategoria(nueva);
    setNueva('');
    setMensaje({ ok: true, texto: 'Categoría creada.' });
    recargar();
  }

  function guardarEdicion(e) {
    e.preventDefault();
    const otras = categorias.map((c) => c.nombre).filter((n) => n !== editando.original);
    const error = validarCategoria(editando.valor, otras);
    setErrorEdicion(error);
    if (error) return;
    renombrarCategoria(editando.original, editando.valor);
    setEditando(null);
    setMensaje({ ok: true, texto: 'Categoría actualizada.' });
    recargar();
  }

  function borrar(nombre) {
    try {
      eliminarCategoria(nombre);
      setMensaje({ ok: true, texto: 'Categoría eliminada.' });
    } catch (error) {
      setMensaje({ ok: false, texto: error.message });
    }
    recargar();
  }

  const columnas = [
    {
      clave: 'nombre',
      titulo: 'Categoría',
      render: (c) =>
        editando?.original === c.nombre ? (
          <form onSubmit={guardarEdicion} noValidate className="d-flex flex-wrap gap-2 align-items-start">
            <div>
              <label htmlFor="editar-categoria" className="visually-hidden">Nuevo nombre</label>
              <input id="editar-categoria" className={'form-control form-control-sm' + (errorEdicion ? ' is-invalid' : '')}
                value={editando.valor} onChange={(e) => setEditando({ ...editando, valor: e.target.value })} />
              {errorEdicion && <div className="invalid-feedback">{errorEdicion}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
            <button type="button" className="btn btn-outline-secondary btn-sm"
              onClick={() => { setEditando(null); setErrorEdicion(''); }}>Cancelar</button>
          </form>
        ) : (
          c.nombre
        ),
    },
    { clave: 'cantidad', titulo: 'Cartas', clase: 'text-end' },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (c) => (
        <span className="d-inline-flex gap-1">
          <button type="button" className="btn btn-outline-primary btn-sm"
            onClick={() => { setEditando({ original: c.nombre, valor: c.nombre }); setErrorEdicion(''); }}>
            Renombrar
          </button>
          <button type="button" className="btn btn-outline-danger btn-sm" disabled={c.cantidad > 0}
            title={c.cantidad > 0 ? 'Tiene cartas asociadas' : 'Eliminar categoría'}
            onClick={() => borrar(c.nombre)}>
            Eliminar
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <h1 className="h3 mb-3">Categorías</h1>
      {mensaje && (
        <div className={'alert py-2 alert-' + (mensaje.ok ? 'success' : 'danger')} role="status">
          {mensaje.texto}
        </div>
      )}
      <form onSubmit={crear} noValidate className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <label htmlFor="nueva-categoria" className="visually-hidden">Nombre de la categoría</label>
          <input id="nueva-categoria" className={'form-control' + (errorNueva ? ' is-invalid' : '')}
            placeholder="Nueva categoría" value={nueva} onChange={(e) => setNueva(e.target.value)} />
          {errorNueva && <div className="invalid-feedback">{errorNueva}</div>}
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Agregar</button>
        </div>
      </form>
      <TablaDatos columnas={columnas} filas={categorias} claveFila="nombre" mensajeVacio="No hay categorías." />
      <p className="small text-body-secondary">
        Solo se pueden eliminar las categorías sin cartas. Al renombrar, las cartas se actualizan solas.
      </p>
    </>
  );
}
