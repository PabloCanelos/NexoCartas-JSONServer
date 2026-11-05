import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import CampoFormulario from '../components/CampoFormulario.jsx';
import { useSesion } from '../context/SesionContext.jsx';
import { validarLogin } from '../services/validaciones.js';

// Página /login : inicia sesión con una cuenta demostrativa.
export default function Login() {
  const { iniciarSesion } = useSesion();
  const navigate = useNavigate();
  const [valores, setValores] = useState({ correo: '', clave: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  function cambiar(e) {
    setValores({ ...valores, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    const nuevos = validarLogin(valores);
    setErrores(nuevos);
    setErrorGeneral('');
    if (Object.keys(nuevos).length > 0) return;
    try {
      const usuario = iniciarSesion(valores.correo, valores.clave);
      navigate(usuario.rol === 'admin' ? '/admin' : '/', { replace: true });
    } catch (error) {
      setErrorGeneral(error.message);
    }
  }

  return (
    <main className="container py-4" style={{ maxWidth: '480px' }}>
      <h1 className="h3 mb-3">Ingresar</h1>
      <form onSubmit={enviar} noValidate className="card card-body">
        {errorGeneral && (
          <div className="alert alert-danger" role="alert">
            {errorGeneral}
          </div>
        )}
        <CampoFormulario className="mb-3" id="correo" name="correo" type="email" label="Correo"
          value={valores.correo} onChange={cambiar} error={errores.correo} autoComplete="email" />
        <CampoFormulario className="mb-3" id="clave" name="clave" type="password" label="Contraseña"
          value={valores.clave} onChange={cambiar} error={errores.clave} autoComplete="current-password" />
        <button type="submit" className="btn btn-primary w-100">
          Ingresar
        </button>
      </form>
      <p className="mt-3 small">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
      <p className="small text-body-secondary">
        Cuentas de prueba: cliente@nexocartas.cl / 1234 · admin@nexocartas.cl / admin123
      </p>
    </main>
  );
}
