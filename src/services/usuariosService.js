// Usuarios de demostración guardados en localStorage (no hay backend).
// Las contraseñas se guardan en texto plano SOLO porque es una demo.
import { CUENTAS_DEMO } from '../data/datos.js';
import { almacenActual } from './almacen.js';

const CLAVE = 'nexoUsuarios';

function leer() {
  try {
    const texto = almacenActual().getItem(CLAVE);
    if (texto) return JSON.parse(texto);
  } catch {
    // si el JSON está dañado se vuelve a partir de las cuentas demo
  }
  const base = CUENTAS_DEMO.map((cuenta, i) => ({ id: i + 1, creado: '2026-09-24', ...cuenta }));
  guardar(base);
  return base;
}

function guardar(usuarios) {
  almacenActual().setItem(CLAVE, JSON.stringify(usuarios));
}

function sinClave(usuario) {
  const { clave: _clave, ...resto } = usuario;
  return resto;
}

export function obtenerUsuarios() {
  return leer().map(sinClave);
}

export function buscarUsuarioPorId(id) {
  const usuario = leer().find((u) => u.id === Number(id));
  return usuario ? sinClave(usuario) : null;
}

export function autenticar(correo, clave) {
  const usuario = leer().find((u) => u.correo.toLowerCase() === String(correo).trim().toLowerCase());
  if (!usuario || usuario.clave !== clave) {
    throw new Error('Correo o contraseña incorrectos.');
  }
  if (!usuario.activo) {
    throw new Error('Tu cuenta está inactiva. Contacta a la tienda.');
  }
  return sinClave(usuario);
}

// rol es opcional: el registro público siempre crea clientes; el panel admin
// puede crear también administradores.
export function registrarUsuario({ nombre, correo, clave, rol = 'cliente' }) {
  const usuarios = leer();
  const existe = usuarios.some((u) => u.correo.toLowerCase() === String(correo).trim().toLowerCase());
  if (existe) throw new Error('Ya existe una cuenta con ese correo.');
  const id = usuarios.reduce((mayor, u) => Math.max(mayor, u.id), 0) + 1;
  const nuevo = {
    id,
    correo: String(correo).trim(),
    clave,
    rol,
    nombre: String(nombre).trim(),
    activo: true,
    creado: new Date().toISOString().slice(0, 10),
  };
  guardar([...usuarios, nuevo]);
  return sinClave(nuevo);
}

function quedaAdminActivo(usuarios) {
  return usuarios.some((u) => u.rol === 'admin' && u.activo);
}

export function actualizarUsuario(id, cambios) {
  const usuarios = leer();
  const posicion = usuarios.findIndex((u) => u.id === Number(id));
  if (posicion === -1) throw new Error('El usuario no existe.');
  const actualizado = { ...usuarios[posicion], ...cambios, id: usuarios[posicion].id };
  const copia = usuarios.map((u, i) => (i === posicion ? actualizado : u));
  if (!quedaAdminActivo(copia)) {
    throw new Error('Debe quedar al menos un administrador activo.');
  }
  guardar(copia);
  return sinClave(actualizado);
}

export function cambiarClave(id, actual, nueva) {
  const usuarios = leer();
  const usuario = usuarios.find((u) => u.id === Number(id));
  if (!usuario) throw new Error('El usuario no existe.');
  if (usuario.clave !== actual) throw new Error('La contraseña actual no es correcta.');
  usuario.clave = nueva;
  guardar(usuarios);
}

export function eliminarUsuario(id) {
  const usuarios = leer();
  const restantes = usuarios.filter((u) => u.id !== Number(id));
  if (restantes.length === usuarios.length) return false;
  if (!quedaAdminActivo(restantes)) {
    throw new Error('Debe quedar al menos un administrador activo.');
  }
  guardar(restantes);
  return true;
}
