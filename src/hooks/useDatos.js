import { useState } from 'react';

// Lee una lista con la función "leer" (por ejemplo obtenerOrdenes) y la guarda
// en el estado. Después de cada cambio se llama a recargar() y la pantalla
// se actualiza con los datos nuevos.
export function useDatos(leer) {
  const [datos, setDatos] = useState(() => leer());
  const recargar = () => setDatos(leer());
  return [datos, recargar];
}
