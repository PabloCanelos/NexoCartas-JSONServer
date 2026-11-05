// Muestra un precio en pesos chilenos, por ejemplo 12990 -> "$12.990".
export function formatearPrecio(valor) {
  return '$' + Number(valor).toLocaleString('es-CL');
}

// Precio que paga el cliente: el de oferta si la carta está en oferta.
export function precioFinal(carta) {
  return carta.oferta && carta.precioOferta ? carta.precioOferta : carta.precio;
}

// "2026-10-15" -> "15 de octubre de 2026"
export function formatearFecha(texto) {
  const fecha = new Date(texto + (String(texto).length === 10 ? 'T12:00:00' : ''));
  return fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}
