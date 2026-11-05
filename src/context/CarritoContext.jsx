
import { createContext, useContext, useState } from 'react';
import { almacenActual } from '../services/almacen.js';
import { precioFinal } from '../services/formato.js';
import { useProductos } from './ProductosContext.jsx';

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
  const { cartas, cargando } = useProductos();

  function actualizar(nuevas) {
    almacenActual().setItem(CLAVE, JSON.stringify(nuevas));
    setLineas(nuevas);
  }

  function buscarCarta(id) {
    return cartas.find((carta) => carta.id === Number(id)) || null;
  }

  function agregar(id, cantidad = 1) {
    if (cargando) {
      return {
        ok: false,
        mensaje: 'Los productos todavía se están cargando.',
      };
    }

    const carta = buscarCarta(id);

    if (!carta || !carta.activo || carta.stock <= 0) {
      return {
        ok: false,
        mensaje: 'Esta carta no está disponible.',
      };
    }

    const unidades = Number(cantidad);

    if (!Number.isInteger(unidades) || unidades <= 0) {
      return {
        ok: false,
        mensaje: 'La cantidad debe ser un número entero positivo.',
      };
    }

    const linea = lineasGuardadas.find(
      (item) => item.id === carta.id,
    );

    const actual = linea ? linea.cantidad : 0;
    const nueva = Math.min(actual + unidades, carta.stock);

    if (nueva === actual) {
      return {
        ok: false,
        mensaje: `Ya tienes las ${carta.stock} unidades disponibles de "${carta.nombre}".`,
      };
    }

    actualizar(
      linea
        ? lineasGuardadas.map((item) =>
            item.id === carta.id
              ? { ...item, cantidad: nueva }
              : item,
          )
        : [...lineasGuardadas, { id: carta.id, cantidad: nueva }],
    );

    return {
      ok: true,
      mensaje: `"${carta.nombre}" agregada al carrito.`,
    };
  }

  function cambiarCantidad(id, cantidad) {
    const carta = buscarCarta(id);
    const entero = Number(cantidad);

    if (
      !carta ||
      !Number.isInteger(entero) ||
      entero <= 0
    ) {
      return;
    }

    const limitada = Math.min(
      entero,
      Math.max(carta.stock, 1),
    );

    actualizar(
      lineasGuardadas.map((item) =>
        item.id === Number(id)
          ? { ...item, cantidad: limitada }
          : item,
      ),
    );
  }

  function quitar(id) {
    actualizar(
      lineasGuardadas.filter(
        (item) => item.id !== Number(id),
      ),
    );
  }

  function vaciar() {
    actualizar([]);
  }

  const lineas = lineasGuardadas
    .map((linea) => {
      const carta = buscarCarta(linea.id);

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
    cantidadTotal: lineas.reduce(
      (suma, linea) => suma + linea.cantidad,
      0,
    ),
    subtotal: lineas.reduce(
      (suma, linea) => suma + linea.subtotal,
      0,
    ),
    hayProblemas: lineas.some(
      (linea) => !linea.disponible,
    ),
    agregar,
    cambiarCantidad,
    quitar,
    vaciar,
  };

  return (
    <Contexto.Provider value={valor}>
      {children}
    </Contexto.Provider>
  );
}

// Conservamos el hook en este módulo para mantener las importaciones.
// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito() {
  return useContext(Contexto);
}
