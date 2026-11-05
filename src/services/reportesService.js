// Funciones puras para los reportes del administrador. Reciben las listas
// ya leídas (órdenes, cartas) y devuelven los números calculados.
import { ESTADOS_ORDEN } from '../data/datos.js';
import { precioFinal } from './formato.js';

export function esVendida(orden) {
  return ESTADOS_ORDEN.some((e) => e.id === orden.estado && e.vendida);
}

// Filtra por fecha ("AAAA-MM-DD"). Si desde o hasta vienen vacíos, no se aplican.
export function filtrarPorFecha(ordenes, desde = '', hasta = '') {
  return ordenes.filter((orden) => {
    const dia = orden.fecha.slice(0, 10);
    return (!desde || dia >= desde) && (!hasta || dia <= hasta);
  });
}

export function resumenVentas(ordenes) {
  const vendidas = ordenes.filter(esVendida);
  const total = vendidas.reduce((suma, o) => suma + o.total, 0);
  return {
    cantidad: vendidas.length,
    total,
    promedio: vendidas.length ? Math.round(total / vendidas.length) : 0,
  };
}

export function topProductos(ordenes, limite = 5) {
  const acumulado = new Map();
  ordenes.filter(esVendida).forEach((orden) => {
    orden.items.forEach((item) => {
      const actual = acumulado.get(item.productoId) || {
        productoId: item.productoId,
        nombre: item.nombre,
        unidades: 0,
        total: 0,
      };
      actual.unidades += item.cantidad;
      actual.total += item.subtotal;
      acumulado.set(item.productoId, actual);
    });
  });
  return [...acumulado.values()]
    .sort((a, b) => b.unidades - a.unidades || b.total - a.total)
    .slice(0, limite);
}

export function ventasPorCategoria(ordenes, cartas) {
  const categoriaDe = new Map(cartas.map((c) => [c.id, c.categoria]));
  const acumulado = new Map();
  ordenes.filter(esVendida).forEach((orden) => {
    orden.items.forEach((item) => {
      const categoria = categoriaDe.get(item.productoId) || 'Sin categoría';
      const actual = acumulado.get(categoria) || { categoria, unidades: 0, total: 0 };
      actual.unidades += item.cantidad;
      actual.total += item.subtotal;
      acumulado.set(categoria, actual);
    });
  });
  return [...acumulado.values()].sort((a, b) => b.total - a.total);
}

export function productosCriticos(cartas, umbral) {
  return cartas.filter((c) => c.stock <= umbral).sort((a, b) => a.stock - b.stock);
}

export function inventarioPorCategoria(cartas, umbral) {
  const acumulado = new Map();
  cartas.forEach((carta) => {
    const actual = acumulado.get(carta.categoria) || {
      categoria: carta.categoria,
      productos: 0,
      unidades: 0,
      valor: 0,
      criticos: 0,
    };
    actual.productos += 1;
    actual.unidades += carta.stock;
    actual.valor += precioFinal(carta) * carta.stock;
    if (carta.stock <= umbral) actual.criticos += 1;
    acumulado.set(carta.categoria, actual);
  });
  return [...acumulado.values()].sort((a, b) => a.categoria.localeCompare(b.categoria));
}
