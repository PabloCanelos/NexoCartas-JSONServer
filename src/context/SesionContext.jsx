import { createContext, useContext, useState } from 'react';
import { almacenActual } from '../services/almacen.js';
import { actualizarUsuario, autenticar, registrarUsuario } from '../services/usuariosService.js';

// Sesión demostrativa: guarda el usuario en el almacén (localStorage). No es seguridad real.
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

  const iniciarSesion = (correo, clave) => abrir(autenticar(correo, clave));
  const registrar = (datos) => abrir(registrarUsuario(datos));
  // Guarda cambios del propio usuario (por ejemplo su nombre) y refresca la sesión.
  const actualizarPerfil = (cambios) => abrir(actualizarUsuario(usuario.id, cambios));
  const cerrarSesion = () => {
    almacenActual().removeItem(CLAVE);
    setUsuario(null);
  };

  return (
    <Contexto.Provider value={{ usuario, iniciarSesion, registrar, actualizarPerfil, cerrarSesion }}>
      {children}
    </Contexto.Provider>
  );
}

export function useSesion() {
  return useContext(Contexto);
}
