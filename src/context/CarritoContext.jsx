import { createContext, useContext, useState } from 'react';
import { almacenActual } from '../services/almacen.js';
import { buscarCartaPorId } from '../services/cartasService.js';
import { precioFinal } from '../services/formato.js';

// El carrito guarda solo líneas { id, cantidad }. Los datos de cada carta
// (nombre, precio, stock) se leen siempre de la fuente de datos vigente.
const CLAVE = 'nexoCarrito';
const Contexto = createContext(null);

function leer() {
  try {
    const lista = JSON.parse(almacenActual().getItem(CLAVE));
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function CarritoProvider({ children }) {
  const [lineasGuardadas, setLineas] = useState(leer);

  function actualizar(nuevas) {
    almacenActual().setItem(CLAVE, JSON.stringify(nuevas));
    setLineas(nuevas);
  }

  // Agrega unidades respetando el stock (RN-01). Devuelve { ok, mensaje }.
  function agregar(id, cantidad = 1) {
    const carta = buscarCartaPorId(id);
    if (!carta || !carta.activo || carta.stock <= 0) {
      return { ok: false, mensaje: 'Esta carta no está disponible.' };
    }
    const linea = lineasGuardadas.find((l) => l.id === carta.id);
    const actual = linea ? linea.cantidad : 0;
    const nueva = Math.min(actual + cantidad, carta.stock);
    if (nueva === actual) {
      return {
        ok: false,
        mensaje: `Ya tienes las ${carta.stock} unidades disponibles de "${carta.nombre}".`,
      };
    }
    actualizar(
      linea
        ? lineasGuardadas.map((l) => (l.id === carta.id ? { ...l, cantidad: nueva } : l))
        : [...lineasGuardadas, { id: carta.id, cantidad: nueva }],
    );
    return { ok: true, mensaje: `"${carta.nombre}" agregada al carrito.` };
  }

  function cambiarCantidad(id, cantidad) {
    const carta = buscarCartaPorId(id);
    const entero = Math.floor(Number(cantidad));
    if (!carta || !Number.isFinite(entero)) return;
    const limitada = Math.max(1, Math.min(entero, Math.max(carta.stock, 1)));
    actualizar(lineasGuardadas.map((l) => (l.id === Number(id) ? { ...l, cantidad: limitada } : l)));
  }

  function quitar(id) {
    actualizar(lineasGuardadas.filter((l) => l.id !== Number(id)));
  }

  function vaciar() {
    actualizar([]);
  }

  // Líneas con los datos completos de cada carta (ignora las que ya no existen).
  const lineas = lineasGuardadas
    .map((linea) => {
      const carta = buscarCartaPorId(linea.id);
      if (!carta || !carta.activo) return null;
      const precioUnitario = precioFinal(carta);
      return {
        carta,
        cantidad: linea.cantidad,
        precioUnitario,
        subtotal: precioUnitario * linea.cantidad,
        disponible: linea.cantidad <= carta.stock,
      };
    })
    .filter(Boolean);

  const valor = {
    lineas,
    cantidadTotal: lineas.reduce((suma, l) => suma + l.cantidad, 0),
    subtotal: lineas.reduce((suma, l) => suma + l.subtotal, 0),
    hayProblemas: lineas.some((l) => !l.disponible),
    agregar,
    cambiarCantidad,
    quitar,
    vaciar,
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrito() {
  return useContext(Contexto);
}
