// CRUD de categorías. La lista parte con las categorías de las cartas iniciales
// y se guarda aparte, así una categoría puede existir aunque aún no tenga cartas.
import { almacenActual } from './almacen.js';
import { actualizarCarta, obtenerCartas } from './cartasService.js';

const CLAVE = 'nexoCategorias';

function guardar(nombres) {
  almacenActual().setItem(CLAVE, JSON.stringify(nombres));
}

function leer() {
  const texto = almacenActual().getItem(CLAVE);
  if (texto) return JSON.parse(texto);
  const iniciales = [...new Set(obtenerCartas().map((c) => c.categoria))].sort();
  guardar(iniciales);
  return iniciales;
}

export function obtenerNombresCategorias() {
  return leer();
}

// Cada categoría con la cantidad de cartas que la usan.
export function obtenerCategoriasConConteo() {
  const cartas = obtenerCartas();
  return leer().map((nombre) => ({
    nombre,
    cantidad: cartas.filter((c) => c.categoria === nombre).length,
  }));
}

function existe(nombres, nombre, ignorar = '') {
  return nombres.some(
    (n) => n.toLowerCase() === nombre.toLowerCase() && n.toLowerCase() !== ignorar.toLowerCase(),
  );
}

export function crearCategoria(nombre) {
  const limpio = String(nombre || '').trim();
  if (limpio.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.');
  const nombres = leer();
  if (existe(nombres, limpio)) throw new Error('Ya existe una categoría con ese nombre.');
  guardar([...nombres, limpio].sort());
  return limpio;
}

// Renombrar también actualiza las cartas que usaban el nombre anterior.
export function renombrarCategoria(actual, nuevo) {
  const limpio = String(nuevo || '').trim();
  if (limpio.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.');
  const nombres = leer();
  if (!nombres.includes(actual)) throw new Error('La categoría no existe.');
  if (existe(nombres, limpio, actual)) throw new Error('Ya existe una categoría con ese nombre.');
  guardar(nombres.map((n) => (n === actual ? limpio : n)).sort());
  obtenerCartas()
    .filter((c) => c.categoria === actual)
    .forEach((c) => actualizarCarta(c.id, { categoria: limpio }));
  return limpio;
}

// No se puede eliminar una categoría que todavía tiene cartas.
export function eliminarCategoria(nombre) {
  const nombres = leer();
  if (!nombres.includes(nombre)) return false;
  if (obtenerCartas().some((c) => c.categoria === nombre)) {
    throw new Error('No se puede eliminar: la categoría todavía tiene cartas.');
  }
  guardar(nombres.filter((n) => n !== nombre));
  return true;
}
