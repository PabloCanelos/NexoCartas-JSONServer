import { ESTADOS_ORDEN } from '../data/datos.js';

// Etiqueta de color para el estado de una orden.
export default function EstadoOrden({ estado }) {
  const datos = ESTADOS_ORDEN.find((e) => e.id === estado);
  return (
    <span className={`badge text-bg-${datos ? datos.variante : 'secondary'}`}>
      {datos ? datos.nombre : estado}
    </span>
  );
}
