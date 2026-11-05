// Órdenes (boletas) de la compra simulada, guardadas en localStorage.
// Sigue el flujo del ERS: revalidar stock -> crear orden pendiente ->
// descontar stock -> marcar confirmada.
import { ORDENES_INICIALES } from '../data/datos.js';
import { almacenActual } from './almacen.js';
import { actualizarCarta, buscarCartaPorId } from './cartasService.js';
import { precioFinal } from './formato.js';

const CLAVE = 'nexoOrdenes';

function leer() {
  try {
    const texto = almacenActual().getItem(CLAVE);
    if (texto === null) {
      // primera vez: se parte con las órdenes de ejemplo
      guardar(ORDENES_INICIALES);
      return JSON.parse(JSON.stringify(ORDENES_INICIALES));
    }
    const lista = JSON.parse(texto);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function guardar(ordenes) {
  almacenActual().setItem(CLAVE, JSON.stringify(ordenes));
}

export function obtenerOrdenes() {
  return leer();
}

export function buscarOrdenPorId(id) {
  return leer().find((orden) => orden.id === id) || null;
}

export function ordenesDeUsuario(correo) {
  const buscado = String(correo).trim().toLowerCase();
  return leer().filter((orden) => orden.cliente.correo.toLowerCase() === buscado);
}

export function actualizarEstadoOrden(id, estado) {
  const ordenes = leer();
  const orden = ordenes.find((o) => o.id === id);
  if (!orden) throw new Error('La orden no existe.');
  orden.estado = estado;
  guardar(ordenes);
  return orden;
}

// lineas: [{ id, cantidad }]. Devuelve la orden confirmada o lanza un Error
// con un mensaje que se muestra en la vista "Pago con error".
export function confirmarCompra({ cliente, direccion, entrega, lineas, simularRechazo = false }) {
  if (!lineas || lineas.length === 0) throw new Error('El carrito está vacío.');

  // 1) Revalidar existencias y disponibilidad con los datos vigentes.
  const items = lineas.map((linea) => {
    const carta = buscarCartaPorId(linea.id);
    if (!carta || !carta.activo) {
      throw new Error('Una de las cartas del carrito ya no está disponible.');
    }
    if (linea.cantidad > carta.stock) {
      throw new Error(`Stock insuficiente para "${carta.nombre}": quedan ${carta.stock}.`);
    }
    const precioUnitario = precioFinal(carta);
    return {
      productoId: carta.id,
      nombre: carta.nombre,
      precioUnitario,
      cantidad: linea.cantidad,
      subtotal: precioUnitario * linea.cantidad,
    };
  });

  // 2) Simulación del cobro: aquí no hay pasarela real.
  if (simularRechazo) {
    throw new Error('El pago fue rechazado por el emisor de la tarjeta (simulación).');
  }

  const subtotal = items.reduce((suma, item) => suma + item.subtotal, 0);
  const total = subtotal + entrega.costo;
  const ordenes = leer();
  const orden = {
    id: 'o-' + Date.now(),
    boleta: ordenes.reduce((mayor, o) => Math.max(mayor, o.boleta), 1000) + 1,
    fecha: new Date().toISOString(),
    cliente,
    direccion,
    entrega,
    items,
    subtotal,
    total,
    estado: 'pendiente',
  };
  guardar([...ordenes, orden]);

  // 3) Descontar el stock y confirmar. Si algo falla, queda "requiere_revision".
  try {
    items.forEach((item) => {
      const carta = buscarCartaPorId(item.productoId);
      actualizarCarta(item.productoId, { stock: carta.stock - item.cantidad });
    });
    return actualizarEstadoOrden(orden.id, 'confirmada');
  } catch {
    actualizarEstadoOrden(orden.id, 'requiere_revision');
    throw new Error(
      `No se pudo completar la actualización de inventario. La orden ${orden.id} quedó en revisión.`,
    );
  }
}
