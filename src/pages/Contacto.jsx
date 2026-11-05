import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario.jsx';
import { validarContacto } from '../services/validaciones.js';

const VACIO = { nombre: '', correo: '', asunto: '', mensaje: '' };

// Página /contacto : formulario validado. No envía correo real (RF-13).
export default function Contacto() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(e) {
    setValores({ ...valores, [e.target.name]: e.target.value });
    setEnviado(false);
  }

  function enviar(e) {
    e.preventDefault();
    const nuevos = validarContacto(valores);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      setEnviado(false);
      return;
    }
    setEnviado(true);
    setValores(VACIO);
  }

  return (
    <main className="container py-4" style={{ maxWidth: '640px' }}>
      <h1 className="h3 mb-3">Contacto</h1>
      {enviado && (
        <div className="alert alert-success" role="status">
          ¡Gracias! Registramos tu mensaje. Es una demostración: no se envía un correo real.
        </div>
      )}
      <form onSubmit={enviar} noValidate className="card card-body">
        <CampoFormulario className="mb-3" id="nombre" name="nombre" label="Nombre"
          value={valores.nombre} onChange={cambiar} error={errores.nombre} />
        <CampoFormulario className="mb-3" id="correo" name="correo" type="email" label="Correo"
          value={valores.correo} onChange={cambiar} error={errores.correo} />
        <CampoFormulario className="mb-3" id="asunto" name="asunto" label="Asunto"
          value={valores.asunto} onChange={cambiar} error={errores.asunto} />
        <CampoFormulario as="textarea" rows="5" className="mb-3" id="mensaje" name="mensaje" label="Mensaje"
          value={valores.mensaje} onChange={cambiar} error={errores.mensaje} />
        <button type="submit" className="btn btn-primary align-self-start">
          Enviar mensaje
        </button>
      </form>
    </main>
  );
}
