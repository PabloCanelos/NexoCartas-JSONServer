
import { createContext, useContext, useState } from 'react';
import { almacenActual } from '../services/almacen.js';
import {
  actualizarUsuario,
  autenticar,
  registrarUsuario,
} from '../services/usuariosService.js';

// Sesión demostrativa almacenada en localStorage.
// No constituye un mecanismo de autenticación seguro.
const CLAVE = 'nexoSesion';
const Contexto = createContext(null);

function leer() {
  try {
    return JSON.parse(almacenActual().getItem(CLAVE));
  } catch {
    return null;
  }
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leer);

  function abrir(nuevo) {
    almacenActual().setItem(CLAVE, JSON.stringify(nuevo));
    setUsuario(nuevo);
    return nuevo;
  }

  const iniciarSesion = (correo, clave) =>
    abrir(autenticar(correo, clave));

  const registrar = (datos) =>
    abrir(registrarUsuario(datos));

  // Actualiza el perfil del usuario y refresca su sesión.
  const actualizarPerfil = (cambios) =>
    abrir(actualizarUsuario(usuario.id, cambios));

  const cerrarSesion = () => {
    almacenActual().removeItem(CLAVE);
    setUsuario(null);
  };

  return (
    <Contexto.Provider
      value={{
        usuario,
        iniciarSesion,
        registrar,
        actualizarPerfil,
        cerrarSesion,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

// Conservamos el hook en este módulo para mantener las importaciones.
// eslint-disable-next-line react-refresh/only-export-components
export function useSesion() {
  return useContext(Contexto);
}
