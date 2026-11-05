// Almacén compartido por todos los servicios (por defecto, localStorage).
// En las pruebas unitarias se reemplaza por un almacén falso (mock) para no
// tocar el localStorage real del navegador.
let almacen = typeof localStorage !== 'undefined' ? localStorage : null;

export function usarAlmacenamiento(nuevoAlmacen) {
  almacen = nuevoAlmacen;
}

export function almacenActual() {
  return almacen;
}
