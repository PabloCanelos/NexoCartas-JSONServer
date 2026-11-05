
import { ORDENES_INICIALES } from '../data/datos.js';
import { almacenActual } from './almacen.js';
import {
  actualizarCartaApi,
  buscarCartaPorIdApi,
} from './cartasService.js';
import { precioFinal } from './formato.js';

const CLAVE = 'nexoOrdenes';

function guardar(ordenes) {
  almacenActual().setItem(CLAVE, JSON.stringify(ordenes));
}

function leer() {
  try {
    const texto = almacenActual().getItem(CLAVE);

    if (texto === null) {
      guardar(ORDENES_INICIALES);
      return structuredClone(ORDENES_INICIALES);
    }

    const lista = JSON.parse(texto);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function obtenerOrdenes() {
  return leer();
}

export function buscarOrdenPorId(id) {
  return leer().find((orden) => orden.id === id) || null;
}

export function ordenesDeUsuario(correo) {
  const buscado = String(correo).trim().toLowerCase();

  return leer().filter(
    (orden) => orden.cliente.correo.toLowerCase() === buscado,
  );
}

export function actualizarEstadoOrden(id, estado) {
  const ordenes = leer();
  const orden = ordenes.find((item) => item.id === id);

  if (!orden) {
    throw new Error('La orden no existe.');
  }

  orden.estado = estado;
  guardar(ordenes);

  return orden;
}

export async function confirmarCompra({
  cliente,
  direccion,
  entrega,
  lineas,
  simularRechazo = false,
}) {
  if (!Array.isArray(lineas) || lineas.length === 0) {
    throw new Error('El carrito está vacío.');
  }

  // Consultar el inventario actualizado desde JSON Server.
  const items = [];

  for (const linea of lineas) {
    const cantidad = Number(linea.cantidad);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error('La cantidad solicitada no es válida.');
    }

    const carta = await buscarCartaPorIdApi(linea.id);

    if (!carta.activo) {
      throw new Error(
        `La carta "${carta.nombre}" ya no está disponible.`,
      );
    }

    if (cantidad > carta.stock) {
      throw new Error(
        `Stock insuficiente para "${carta.nombre}": quedan ${carta.stock}.`,
      );
    }

    const precioUnitario = precioFinal(carta);

    items.push({
      productoId: carta.id,
      nombre: carta.nombre,
      precioUnitario,
      cantidad,
      subtotal: precioUnitario * cantidad,
      stockAnterior: carta.stock,
    });
  }

  if (simularRechazo) {
    throw new Error(
      'El pago fue rechazado por el emisor de la tarjeta (simulación).',
    );
  }

  const subtotal = items.reduce(
    (suma, item) => suma + item.subtotal,
    0,
  );

  const ordenes = leer();

  const orden = {
    id: 'o-' + Date.now(),
    boleta:
      ordenes.reduce(
        (mayor, item) => Math.max(mayor, item.boleta),
        1000,
      ) + 1,
    fecha: new Date().toISOString(),
    cliente,
    direccion,
    entrega,

    // Guardamos únicamente los datos comerciales de cada producto.
    // stockAnterior se conserva en items para restaurar inventario.
    items: items.map((item) => ({
      productoId: item.productoId,
      nombre: item.nombre,
      precioUnitario: item.precioUnitario,
      cantidad: item.cantidad,
      subtotal: item.subtotal,
    })),

    subtotal,
    total: subtotal + entrega.costo,
    estado: 'pendiente',
  };

  guardar([...ordenes, orden]);

  const actualizados = [];

  try {
    for (const item of items) {
      await actualizarCartaApi(item.productoId, {
        stock: item.stockAnterior - item.cantidad,
      });

      actualizados.push(item);
    }

    return actualizarEstadoOrden(orden.id, 'confirmada');
  } catch {
    // Intentar restaurar el stock de los productos ya actualizados.
    let restauracionFallida = false;

    for (const item of actualizados.reverse()) {
      try {
        await actualizarCartaApi(item.productoId, {
          stock: item.stockAnterior,
        });
      } catch {
        restauracionFallida = true;
      }
    }

    actualizarEstadoOrden(orden.id, 'requiere_revision');

    throw new Error(
      restauracionFallida
        ? `No se pudo completar la compra y falló la restauración del inventario. La orden ${orden.id} requiere revisión manual.`
        : `No se pudo completar la actualización del inventario. La orden ${orden.id} quedó en revisión.`,
    );
  }
}
