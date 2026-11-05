import { useState } from 'react';
import {
  actualizarCarta,
  crearCarta,
  eliminarCarta,
  obtenerCartas,
} from '../services/cartasService.js';

// Conecta el CRUD de datos simulados con React: cada operación guarda el
// cambio y vuelve a leer la lista, así la interfaz se actualiza sola.
export function useCartas() {
  const [cartas, setCartas] = useState(() => obtenerCartas());

  const recargar = () => setCartas(obtenerCartas());

  const crear = (datos) => {
    const nueva = crearCarta(datos);
    recargar();
    return nueva;
  };

  const actualizar = (id, cambios) => {
    const actualizada = actualizarCarta(id, cambios);
    recargar();
    return actualizada;
  };

  const eliminar = (id) => {
    const resultado = eliminarCarta(id);
    recargar();
    return resultado;
  };

  return { cartas, crear, actualizar, eliminar, recargar };
}
