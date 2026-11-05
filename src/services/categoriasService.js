
import { solicitarApi } from './apiClient.js';

// Obtiene las categorías almacenadas en JSON Server.
export async function obtenerCategoriasApi() {
  const categorias = await solicitarApi('/categorias');

  if (!Array.isArray(categorias)) {
    throw new Error('La API devolvió categorías inválidas.');
  }

  return categorias;
}

// Crea una categoría nueva.
export async function crearCategoriaApi(nombre) {
  const limpio = String(nombre ?? '').trim();

  if (limpio.length < 2) {
    throw new Error('El nombre debe tener al menos 2 caracteres.');
  }

  const categorias = await obtenerCategoriasApi();

  const duplicada = categorias.some(
    (categoria) =>
      categoria.nombre.toLowerCase() === limpio.toLowerCase(),
  );

  if (duplicada) {
    throw new Error('Ya existe una categoría con ese nombre.');
  }

  return solicitarApi('/categorias', {
    method: 'POST',
    body: JSON.stringify({ nombre: limpio }),
  });
}

// Cambia el nombre de una categoría.
// La actualización de productos asociados se gestionará
// desde una operación coordinada antes de habilitarla en la interfaz.
export async function actualizarCategoriaApi(id, nombre) {
  const limpio = String(nombre ?? '').trim();

  if (limpio.length < 2) {
    throw new Error('El nombre debe tener al menos 2 caracteres.');
  }

  const categorias = await obtenerCategoriasApi();

  const actual = categorias.find(
    (categoria) => Number(categoria.id) === Number(id),
  );

  if (!actual) {
    throw new Error('La categoría no existe.');
  }

  const duplicada = categorias.some(
    (categoria) =>
      Number(categoria.id) !== Number(id) &&
      categoria.nombre.toLowerCase() === limpio.toLowerCase(),
  );

  if (duplicada) {
    throw new Error('Ya existe una categoría con ese nombre.');
  }

  return solicitarApi(`/categorias/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ nombre: limpio }),
  });
}

// Elimina una categoría únicamente si no tiene productos asociados.
export async function eliminarCategoriaApi(id) {
  const categorias = await obtenerCategoriasApi();

  const categoria = categorias.find(
    (elemento) => Number(elemento.id) === Number(id),
  );

  if (!categoria) {
    throw new Error('La categoría no existe.');
  }

  const productos = await solicitarApi('/cartas');

  if (!Array.isArray(productos)) {
    throw new Error('La API devolvió productos inválidos.');
  }

  const tieneProductos = productos.some(
    (producto) => producto.categoria === categoria.nombre,
  );

  if (tieneProductos) {
    throw new Error(
      'No se puede eliminar: la categoría todavía tiene cartas.',
    );
  }

  await solicitarApi(
    `/categorias/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );

  return true;
}
