import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario.jsx';
import { useSesion } from '../context/SesionContext.jsx';
import { cambiarClave } from '../services/usuariosService.js';
import { validarCambioClave } from '../services/validaciones.js';

// /admin/perfil : datos del administrador y cambio de contraseña.
export default function AdminPerfil() {
  const { usuario, actualizarPerfil } = useSesion();
  const [nombre, setNombre] = useState(usuario.nombre);
  const [errorNombre, setErrorNombre] = useState('');
  const [avisoNombre, setAvisoNombre] = useState('');
  const [claves, setClaves] = useState({ actual: '', nueva: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [mensajeClave, setMensajeClave] = useState(null);

  function guardarNombre(e) {
    e.preventDefault();
    setAvisoNombre('');
    if (nombre.trim().length < 2) {
      setErrorNombre('Ingresa tu nombre (mínimo 2 caracteres).');
      return;
    }
    setErrorNombre('');
    actualizarPerfil({ nombre: nombre.trim() });
    setAvisoNombre('Perfil actualizado.');
  }

  function guardarClave(e) {
    e.preventDefault();
    const nuevos = validarCambioClave(claves);
    setErrores(nuevos);
    setMensajeClave(null);
    if (Object.keys(nuevos).length > 0) return;
    try {
      cambiarClave(usuario.id, claves.actual, claves.nueva);
      setClaves({ actual: '', nueva: '', confirmar: '' });
      setMensajeClave({ ok: true, texto: 'Contraseña actualizada.' });
    } catch (error) {
      setMensajeClave({ ok: false, texto: error.message });
    }
  }

  const cambiarCampo = (e) => setClaves({ ...claves, [e.target.name]: e.target.value });

  return (
    <>
      <h1 className="h3 mb-3">Perfil</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <form onSubmit={guardarNombre} noValidate className="card card-body">
            <h2 className="h5">Mis datos</h2>
            {avisoNombre && <div className="alert alert-success py-2" role="status">{avisoNombre}</div>}
            <CampoFormulario className="mb-3" id="perfil-nombre" label="Nombre" value={nombre}
              onChange={(e) => setNombre(e.target.value)} error={errorNombre} />
            <p className="small text-body-secondary">
              Correo: {usuario.correo} · Rol: {usuario.rol}
            </p>
            <button type="submit" className="btn btn-primary align-self-start">Guardar</button>
          </form>
        </div>
        <div className="col-12 col-lg-6">
          <form onSubmit={guardarClave} noValidate className="card card-body">
            <h2 className="h5">Cambiar contraseña</h2>
            {mensajeClave && (
              <div className={'alert py-2 alert-' + (mensajeClave.ok ? 'success' : 'danger')} role="status">
                {mensajeClave.texto}
              </div>
            )}
            <CampoFormulario className="mb-3" id="clave-actual" name="actual" type="password" label="Contraseña actual"
              value={claves.actual} onChange={cambiarCampo} error={errores.actual} autoComplete="current-password" />
            <CampoFormulario className="mb-3" id="clave-nueva" name="nueva" type="password" label="Nueva contraseña"
              value={claves.nueva} onChange={cambiarCampo} error={errores.nueva} autoComplete="new-password" />
            <CampoFormulario className="mb-3" id="clave-confirmar" name="confirmar" type="password" label="Repetir nueva contraseña"
              value={claves.confirmar} onChange={cambiarCampo} error={errores.confirmar} autoComplete="new-password" />
            <button type="submit" className="btn btn-primary align-self-start">Cambiar contraseña</button>
          </form>
        </div>
      </div>
    </>
  );
}
