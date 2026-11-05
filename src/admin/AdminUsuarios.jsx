import { useState } from 'react';
import { Link } from 'react-router';
import CampoFormulario from '../components/CampoFormulario.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import { useSesion } from '../context/SesionContext.jsx';
import { useDatos } from '../hooks/useDatos.js';
import { formatearPrecio } from '../services/formato.js';
import { obtenerOrdenes } from '../services/ordenesService.js';
import { esVendida } from '../services/reportesService.js';
import {
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  registrarUsuario,
} from '../services/usuariosService.js';
import { validarRegistro } from '../services/validaciones.js';

const FORM_VACIO = { nombre: '', correo: '', clave: '', rol: 'cliente' };

// /admin/usuarios : listado, alta, activar/desactivar y eliminar.
export default function AdminUsuarios() {
  const { usuario: yo } = useSesion();
  const [usuarios, recargar] = useDatos(obtenerUsuarios);
  const [ordenes] = useDatos(obtenerOrdenes);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [valores, setValores] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  function comprasDe(u) {
    const propias = ordenes.filter((o) => o.cliente.correo.toLowerCase() === u.correo.toLowerCase());
    const vendidas = propias.filter(esVendida);
    return { cantidad: propias.length, total: vendidas.reduce((suma, o) => suma + o.total, 0) };
  }

  function intentar(accion, textoOk) {
    try {
      accion();
      setMensaje({ ok: true, texto: textoOk });
    } catch (error) {
      setMensaje({ ok: false, texto: error.message });
    }
    recargar();
  }

  function crear(e) {
    e.preventDefault();
    const nuevos = validarRegistro({ ...valores, confirmar: valores.clave });
    delete nuevos.confirmar;
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    try {
      registrarUsuario(valores);
      setValores(FORM_VACIO);
      setMostrarForm(false);
      setMensaje({ ok: true, texto: 'Usuario creado.' });
    } catch (error) {
      setMensaje({ ok: false, texto: error.message });
    }
    recargar();
  }

  const columnas = [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'correo', titulo: 'Correo' },
    {
      clave: 'rol',
      titulo: 'Rol',
      render: (u) => <span className={'badge text-bg-' + (u.rol === 'admin' ? 'warning' : 'secondary')}>{u.rol}</span>,
    },
    { clave: 'activo', titulo: 'Estado', render: (u) => (u.activo ? 'Activo' : 'Inactivo') },
    { clave: 'compras', titulo: 'Compras', clase: 'text-end', render: (u) => comprasDe(u).cantidad },
    { clave: 'gastado', titulo: 'Total comprado', clase: 'text-end', render: (u) => formatearPrecio(comprasDe(u).total) },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (u) => {
        const soyYo = yo && u.id === yo.id;
        return (
          <span className="d-inline-flex flex-wrap gap-1">
            <Link to={`/admin/usuarios/${u.id}`} className="btn btn-outline-primary btn-sm">Historial</Link>
            <button type="button" className="btn btn-outline-secondary btn-sm" disabled={soyYo}
              onClick={() => intentar(() => actualizarUsuario(u.id, { activo: !u.activo }),
                u.activo ? 'Usuario desactivado.' : 'Usuario activado.')}>
              {u.activo ? 'Desactivar' : 'Activar'}
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm" disabled={soyYo}
              onClick={() => intentar(() => eliminarUsuario(u.id), 'Usuario eliminado.')}>
              Eliminar
            </button>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <button type="button" className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cerrar formulario' : 'Nuevo usuario'}
        </button>
      </div>
      {mensaje && (
        <div className={'alert py-2 alert-' + (mensaje.ok ? 'success' : 'danger')} role="status">
          {mensaje.texto}
        </div>
      )}
      {mostrarForm && (
        <form onSubmit={crear} noValidate className="card card-body mb-3">
          <div className="row g-3">
            <CampoFormulario className="col-12 col-md-6" id="u-nombre" label="Nombre" value={valores.nombre}
              onChange={(e) => setValores({ ...valores, nombre: e.target.value })} error={errores.nombre} />
            <CampoFormulario className="col-12 col-md-6" id="u-correo" label="Correo" type="email" value={valores.correo}
              onChange={(e) => setValores({ ...valores, correo: e.target.value })} error={errores.correo} />
            <CampoFormulario className="col-12 col-md-6" id="u-clave" label="Contraseña" type="password" value={valores.clave}
              onChange={(e) => setValores({ ...valores, clave: e.target.value })} error={errores.clave} />
            <CampoFormulario as="select" className="col-12 col-md-6" id="u-rol" label="Rol" value={valores.rol}
              onChange={(e) => setValores({ ...valores, rol: e.target.value })}>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </CampoFormulario>
          </div>
          <button type="submit" className="btn btn-primary mt-3 align-self-start">Crear usuario</button>
        </form>
      )}
      <TablaDatos columnas={columnas} filas={usuarios} claveFila="id" mensajeVacio="No hay usuarios." />
    </>
  );
}
