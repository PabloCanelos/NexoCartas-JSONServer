
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  crearCategoriaApi,
  actualizarCategoriaApi,
  eliminarCategoriaApi,
  obtenerCategoriasApi,
} from '../services/categoriasService.js';

import { obtenerCartasApi } from '../services/cartasService.js';
import { useProductos } from './ProductosContext.jsx';

const CategoriasContext = createContext(null);

export function CategoriasProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const {
    recargar: recargarProductos,
    actualizar: actualizarProducto,
  } = useProductos();

  // Recarga las categorías desde JSON Server.
  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const datos = await obtenerCategoriasApi();
      setCategorias(datos);
      return datos;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible cargar las categorías.',
      );

      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial asíncrona de categorías.
  useEffect(() => {
    let activo = true;

    async function cargarInicialmente() {
      try {
        const datos = await obtenerCategoriasApi();

        if (activo) {
          setCategorias(datos);
          setError(null);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : 'No fue posible cargar las categorías.',
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

  // Sincroniza categorías y productos con la API.
  const sincronizar = useCallback(async () => {
    const resultados = await Promise.allSettled([
      recargar(),
      recargarProductos(),
    ]);

    const fallo = resultados.find(
      (resultado) => resultado.status === 'rejected',
    );

    if (fallo) {
      throw new Error(
        'No fue posible sincronizar todos los datos con la API.',
      );
    }
  }, [recargar, recargarProductos]);

  // Centraliza la ejecución y el estado de las operaciones.
  const ejecutarOperacion = useCallback(
    async (operacion) => {
      if (guardando) {
        throw new Error('Ya existe una operación en curso.');
      }

      setGuardando(true);

      try {
        const resultado = await operacion();

        await sincronizar();

        return resultado;
      } catch (err) {
        // Intentamos recuperar el estado actualizado de la API.
        await sincronizar().catch(() => {});

        throw err;
      } finally {
        setGuardando(false);
      }
    },
    [guardando, sincronizar],
  );

  // Crear una categoría.
  const crear = useCallback(
    (nombre) =>
      ejecutarOperacion(() => crearCategoriaApi(nombre)),
    [ejecutarOperacion],
  );

  // Eliminar una categoría.
  const eliminar = useCallback(
    (id) =>
      ejecutarOperacion(() => eliminarCategoriaApi(id)),
    [ejecutarOperacion],
  );

  // Renombrar una categoría y actualizar sus productos asociados.
  const renombrar = useCallback(
    (id, nuevoNombre) =>
      ejecutarOperacion(async () => {
        // Consultamos las categorías actuales de la API.
        const actuales = await obtenerCategoriasApi();

        const categoria = actuales.find(
          (elemento) => Number(elemento.id) === Number(id),
        );

        if (!categoria) {
          throw new Error('La categoría no existe.');
        }

        const limpio = String(nuevoNombre ?? '').trim();

        // Validación de longitud.
        if (limpio.length < 2) {
          throw new Error(
            'El nombre debe tener al menos 2 caracteres.',
          );
        }

        // Evitamos categorías duplicadas.
        const repetida = actuales.some(
          (elemento) =>
            Number(elemento.id) !== Number(id) &&
            elemento.nombre.toLowerCase() === limpio.toLowerCase(),
        );

        if (repetida) {
          throw new Error(
            'Ya existe una categoría con ese nombre.',
          );
        }

        // No realizamos solicitudes de escritura innecesarias.
        if (categoria.nombre === limpio) {
          return categoria;
        }

        // Consultamos los productos actuales directamente desde la API.
        const productos = await obtenerCartasApi();

        // Identificamos los productos de la categoría original.
        const asociados = productos.filter(
          (producto) =>
            producto.categoria === categoria.nombre,
        );

        // Actualizamos los productos relacionados.
        // Si una actualización falla, detenemos la operación.
        for (const producto of asociados) {
          await actualizarProducto(producto.id, {
            categoria: limpio,
          });
        }

        // Finalmente actualizamos el nombre de la categoría.
        return actualizarCategoriaApi(id, limpio);
      }),
    [ejecutarOperacion, actualizarProducto],
  );

  // Compartimos las operaciones y los estados con los componentes.
  const valor = useMemo(
    () => ({
      categorias,
      cargando,
      guardando,
      error,
      recargar,
      crear,
      renombrar,
      eliminar,
    }),
    [
      categorias,
      cargando,
      guardando,
      error,
      recargar,
      crear,
      renombrar,
      eliminar,
    ],
  );

  return (
    <CategoriasContext.Provider value={valor}>
      {children}
    </CategoriasContext.Provider>
  );
}

// Conservamos el hook en este módulo para mantener las importaciones.
// eslint-disable-next-line react-refresh/only-export-components
export function useCategorias() {
  const contexto = useContext(CategoriasContext);

  if (!contexto) {
    throw new Error(
      'useCategorias debe utilizarse dentro de CategoriasProvider.',
    );
  }

  return contexto;
}
