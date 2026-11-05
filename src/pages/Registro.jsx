import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import CampoFormulario from '../components/CampoFormulario.jsx';
import { useSesion } from '../context/SesionContext.jsx';
import { validarRegistro } from '../services/validaciones.js';

// Página /registro : crea una cuenta de cliente y abre la sesión.
export default function Registro() {
  const { registrar } = useSesion();
  const navigate = useNavigate();
  const [valores, setValores] = useState({ nombre: '', correo: '', clave: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  function cambiar(e) {
    setValores({ ...valores, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    const nuevos = validarRegistro(valores);
    setErrores(nuevos);
    setErrorGeneral('');
    if (Object.keys(nuevos).length > 0) return;
    try {
      registrar({ nombre: valores.nombre, correo: valores.correo, clave: valores.clave });
      navigate('/', { replace: true });
    } catch (error) {
      setErrorGeneral(error.message);
    }
  }

  return (
    <main className="container py-4" style={{ maxWidth: '480px' }}>
      <h1 className="h3 mb-3">Crear cuenta</h1>
      <form onSubmit={enviar} noValidate className="card card-body">
        {errorGeneral && (
          <div className="alert alert-danger" role="alert">
            {errorGeneral}
          </div>
        )}
        <CampoFormulario className="mb-3" id="nombre" name="nombre" label="Nombre"
          value={valores.nombre} onChange={cambiar} error={errores.nombre} autoComplete="name" />
        <CampoFormulario className="mb-3" id="correo" name="correo" type="email" label="Correo"
          value={valores.correo} onChange={cambiar} error={errores.correo} autoComplete="email" />
        <CampoFormulario className="mb-3" id="clave" name="clave" type="password" label="Contraseña"
          value={valores.clave} onChange={cambiar} error={errores.clave} autoComplete="new-password" />
        <CampoFormulario className="mb-3" id="confirmar" name="confirmar" type="password"
          label="Repetir contraseña" value={valores.confirmar} onChange={cambiar}
          error={errores.confirmar} autoComplete="new-password" />
        <button type="submit" className="btn btn-primary w-100">
          Registrarme
        </button>
      </form>
      <p className="mt-3 small">
        ¿Ya tienes cuenta? <Link to="/login">Ingresa</Link>
      </p>
    </main>
  );
}
