
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  actualizarCartaApi,
  crearCartaApi,
  eliminarCartaApi,
  obtenerCartasApi,
} from '../services/cartasService.js';

const ProductosContext = createContext(null);

export function ProductosProvider({ children }) {
  const [cartas, setCartas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const productos = await obtenerCartasApi();
      setCartas(productos);
      return productos;
    } catch (err) {
      const mensaje =
        err instanceof Error
          ? err.message
          : 'No fue posible cargar los productos.';

      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  // La carga inicial se ejecuta como operación asíncrona.
  useEffect(() => {
    let activo = true;

    async function cargarInicialmente() {
      try {
        const productos = await obtenerCartasApi();

        if (activo) {
          setCartas(productos);
          setError(null);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : 'No fue posible cargar los productos.',
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarInicialmente();

    return () => {
      activo = false;
    };
  }, []);

  const crear = useCallback(async (datos) => {
    const nuevaCarta = await crearCartaApi(datos);

    setCartas((anteriores) => [...anteriores, nuevaCarta]);

    return nuevaCarta;
  }, []);

  const actualizar = useCallback(async (id, cambios) => {
    const cartaActualizada = await actualizarCartaApi(id, cambios);

    setCartas((anteriores) =>
      anteriores.map((carta) =>
        carta.id === Number(id) ? cartaActualizada : carta,
      ),
    );

    return cartaActualizada;
  }, []);

  const eliminar = useCallback(async (id) => {
    await eliminarCartaApi(id);

    setCartas((anteriores) =>
      anteriores.filter((carta) => carta.id !== Number(id)),
    );

    return true;
  }, []);

  const valor = useMemo(
    () => ({
      cartas,
      cargando,
      error,
      recargar,
      crear,
      actualizar,
      eliminar,
    }),
    [cartas, cargando, error, recargar, crear, actualizar, eliminar],
  );

  return (
    <ProductosContext.Provider value={valor}>
      {children}
    </ProductosContext.Provider>
  );
}

// Se mantiene esta exportación para no romper las importaciones existentes.
// eslint-disable-next-line react-refresh/only-export-components
export function useProductos() {
  const contexto = useContext(ProductosContext);

  if (!contexto) {
    throw new Error(
      'useProductos debe utilizarse dentro de ProductosProvider.',
    );
  }

  return contexto;
}
