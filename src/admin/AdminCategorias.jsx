
import { useState } from 'react';

import TablaDatos from '../components/TablaDatos.jsx';
import { useCategorias } from '../context/CategoriasContext.jsx';
import { useProductos } from '../context/ProductosContext.jsx';
import { validarCategoria } from '../services/validaciones.js';

export default function AdminCategorias() {
  const {
    categorias,
    cargando,
    guardando,
    error,
    recargar,
    crear,
    renombrar,
    eliminar,
  } = useCategorias();

  const {
    cartas,
    cargando: cargandoProductos,
    error: errorProductos,
    recargar: recargarProductos,
  } = useProductos();

  const [nueva, setNueva] = useState('');
  const [errorNueva, setErrorNueva] = useState('');
  const [editando, setEditando] = useState(null);
  const [errorEdicion, setErrorEdicion] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const ocupado = cargando || cargandoProductos || guardando;
  const errorCarga = error || errorProductos;

  const categoriasConConteo = categorias
    .map((categoria) => ({
      ...categoria,
      cantidad: cartas.filter(
        (carta) => carta.categoria === categoria.nombre,
      ).length,
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  async function crearNueva(e) {
    e.preventDefault();

    const nombres = categorias.map((categoria) => categoria.nombre);
    const errorValidacion = validarCategoria(nueva, nombres);

    setErrorNueva(errorValidacion);
    setMensaje(null);

    if (errorValidacion || ocupado) return;

    try {
      await crear(nueva);
      setNueva('');
      setErrorNueva('');
      setMensaje({
        ok: true,
        texto: 'Categoría creada correctamente.',
      });
    } catch (err) {
      setMensaje({
        ok: false,
        texto: err.message || 'No se pudo crear la categoría.',
      });
    }
  }

  async function guardarEdicion(e) {
    e.preventDefault();

    if (!editando || ocupado) return;

    const otras = categorias
      .filter((categoria) => categoria.id !== editando.id)
      .map((categoria) => categoria.nombre);

    const errorValidacion = validarCategoria(
      editando.valor,
      otras,
    );

    setErrorEdicion(errorValidacion);
    setMensaje(null);

    if (errorValidacion) return;

    try {
      await renombrar(editando.id, editando.valor);
      setEditando(null);
      setErrorEdicion('');
      setMensaje({
        ok: true,
        texto: 'Categoría actualizada correctamente.',
      });
    } catch (err) {
      setMensaje({
        ok: false,
        texto:
          `${err.message || 'No se pudo actualizar la categoría.'} ` +
          'Comprueba los datos antes de volver a intentarlo.',
      });
    }
  }

  async function borrar(categoria) {
    if (ocupado || categoria.cantidad > 0) return;

    setMensaje(null);

    try {
      await eliminar(categoria.id);
      setMensaje({
        ok: true,
        texto: 'Categoría eliminada correctamente.',
      });
    } catch (err) {
      setMensaje({
        ok: false,
        texto: err.message || 'No se pudo eliminar la categoría.',
      });
    }
  }

  const columnas = [
    {
      clave: 'nombre',
      titulo: 'Categoría',
      render: (categoria) =>
        editando?.id === categoria.id ? (
          <form
            onSubmit={guardarEdicion}
            noValidate
            className="d-flex flex-wrap gap-2 align-items-start"
          >
            <div>
              <label
                htmlFor="editar-categoria"
                className="visually-hidden"
              >
                Nuevo nombre
              </label>

              <input
                id="editar-categoria"
                className={
                  'form-control form-control-sm' +
                  (errorEdicion ? ' is-invalid' : '')
                }
                value={editando.valor}
                disabled={ocupado}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    valor: e.target.value,
                  })
                }
              />

              {errorEdicion && (
                <div className="invalid-feedback">
                  {errorEdicion}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={ocupado}
            >
              Guardar
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={ocupado}
              onClick={() => {
                setEditando(null);
                setErrorEdicion('');
              }}
            >
              Cancelar
            </button>
          </form>
        ) : (
          categoria.nombre
        ),
    },
    {
      clave: 'cantidad',
      titulo: 'Cartas',
      clase: 'text-end',
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (categoria) => (
        <span className="d-inline-flex gap-1">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            disabled={ocupado}
            onClick={() => {
              setEditando({
                id: categoria.id,
                valor: categoria.nombre,
              });
              setErrorEdicion('');
              setMensaje(null);
            }}
          >
            Renombrar
          </button>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            disabled={ocupado || categoria.cantidad > 0}
            title={
              categoria.cantidad > 0
                ? 'Tiene cartas asociadas'
                : 'Eliminar categoría'
            }
            onClick={() => borrar(categoria)}
          >
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
        <div
          className={
            'alert py-2 alert-' +
            (mensaje.ok ? 'success' : 'danger')
          }
          role="status"
        >
          {mensaje.texto}
        </div>
      )}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          <p>{errorCarga}</p>
          <button
            type="button"
            className="btn btn-outline-danger"
            disabled={ocupado}
            onClick={() => {
              Promise.allSettled([
                recargar(),
                recargarProductos(),
              ]);
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      <form
        onSubmit={crearNueva}
        noValidate
        className="row g-2 mb-3"
      >
        <div className="col-12 col-md-6">
          <label
            htmlFor="nueva-categoria"
            className="visually-hidden"
          >
            Nombre de la categoría
          </label>

          <input
            id="nueva-categoria"
            className={
              'form-control' +
              (errorNueva ? ' is-invalid' : '')
            }
            placeholder="Nueva categoría"
            value={nueva}
            disabled={ocupado || Boolean(errorCarga)}
            onChange={(e) => setNueva(e.target.value)}
          />

          {errorNueva && (
            <div className="invalid-feedback">
              {errorNueva}
            </div>
          )}
        </div>

        <div className="col-auto">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={ocupado || Boolean(errorCarga)}
          >
            {guardando ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </form>

      {ocupado && !guardando && (
        <p role="status">Cargando categorías...</p>
      )}

      {!cargando && !cargandoProductos && !errorCarga && (
        <TablaDatos
          columnas={columnas}
          filas={categoriasConConteo}
          claveFila="id"
          mensajeVacio="No hay categorías."
        />
      )}

      <p className="small text-body-secondary">
        Solo se pueden eliminar las categorías sin cartas.
        Al renombrar, también se actualizan sus productos asociados.
      </p>
    </>
  );
}
