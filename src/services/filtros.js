// Función pura: recibe la lista y devuelve solo las cartas que cumplen el filtro.
// Se usa en el catálogo y es fácil de probar porque no depende de React.
export function filtrarCartas(cartas, { busqueda = '', categoria = '' } = {}) {
  const texto = busqueda.trim().toLowerCase();
  return cartas.filter((carta) => {
    const coincideTexto =
      texto === '' ||
      carta.nombre.toLowerCase().includes(texto) ||
      carta.codigo.toLowerCase().includes(texto);
    const coincideCategoria = categoria === '' || carta.categoria === categoria;
    return carta.activo && coincideTexto && coincideCategoria;
  });
}

export function obtenerCategorias(cartas) {
  return [...new Set(cartas.map((carta) => carta.categoria))].sort();
}
