// CRUD de cartas sobre la fuente de datos simulada (src/data/datos.js).
// Los cambios se guardan en localStorage para que no se pierdan al recargar.
import { CARTAS_INICIALES } from '../data/datos.js';
import { almacenActual } from './almacen.js';

export { usarAlmacenamiento } from './almacen.js';

const CLAVE = 'nexoCartas2';

function copiar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function guardar(cartas) {
  almacenActual().setItem(CLAVE, JSON.stringify(cartas));
}

// READ: devuelve todas las cartas. Si no hay nada guardado, parte con las iniciales.
export function obtenerCartas() {
  const texto = almacenActual().getItem(CLAVE);
  if (!texto) {
    guardar(CARTAS_INICIALES);
    return copiar(CARTAS_INICIALES);
  }
  return JSON.parse(texto);
}

export function buscarCartaPorId(id) {
  return obtenerCartas().find((carta) => carta.id === Number(id)) || null;
}

function validar(datos, cartas, idActual = null) {
  if (!datos.nombre || !String(datos.nombre).trim()) {
    throw new Error('El nombre es obligatorio.');
  }
  if (!datos.codigo || !String(datos.codigo).trim()) {
    throw new Error('El código es obligatorio.');
  }
  const repetido = cartas.some(
    (carta) => carta.codigo === datos.codigo && carta.id !== idActual,
  );
  if (repetido) {
    throw new Error('Ya existe una carta con ese código.');
  }
  if (!Number.isFinite(Number(datos.precio)) || Number(datos.precio) < 0) {
    throw new Error('El precio debe ser un número mayor o igual a 0.');
  }
  if (!Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
    throw new Error('El stock debe ser un número entero mayor o igual a 0.');
  }
}

// CREATE: valida, asigna un id nuevo y guarda.
export function crearCarta(datos) {
  const cartas = obtenerCartas();
  validar(datos, cartas);
  const id = cartas.reduce((mayor, carta) => Math.max(mayor, carta.id), 0) + 1;
  const nueva = {
    activo: true,
    destacado: false,
    ...datos,
    id,
    precio: Number(datos.precio),
    stock: Number(datos.stock),
  };
  guardar([...cartas, nueva]);
  return nueva;
}

// UPDATE: mezcla los cambios con la carta existente.
export function actualizarCarta(id, cambios) {
  const cartas = obtenerCartas();
  const posicion = cartas.findIndex((carta) => carta.id === Number(id));
  if (posicion === -1) {
    throw new Error('La carta no existe.');
  }
  const actualizada = { ...cartas[posicion], ...cambios, id: cartas[posicion].id };
  validar(actualizada, cartas, actualizada.id);
  actualizada.precio = Number(actualizada.precio);
  actualizada.stock = Number(actualizada.stock);
  cartas[posicion] = actualizada;
  guardar(cartas);
  return actualizada;
}

// DELETE: devuelve true si la carta existía.
export function eliminarCarta(id) {
  const cartas = obtenerCartas();
  const restantes = cartas.filter((carta) => carta.id !== Number(id));
  if (restantes.length === cartas.length) return false;
  guardar(restantes);
  return true;
}

export function reiniciarCartas() {
  guardar(CARTAS_INICIALES);
}
