
import TablaDatos from '../components/TablaDatos.jsx';
import TarjetaResumen from '../components/TarjetaResumen.jsx';

import { useProductos } from '../context/ProductosContext.jsx';
import { STOCK_CRITICO_DEFECTO } from '../data/datos.js';

import { formatearPrecio } from '../services/formato.js';
import { inventarioPorCategoria } from '../services/reportesService.js';

import SubmenuProductos from './SubmenuProductos.jsx';

// /admin/productos/reportes: inventario valorizado por categoría.
// Los productos se obtienen del contexto conectado a JSON Server.
export default function AdminProductosReportes() {
  const { cartas, cargando, error, recargar } = useProductos();

  const filas = inventarioPorCategoria(
    cartas,
    STOCK_CRITICO_DEFECTO
  );

  const unidades = filas.reduce(
    (suma, fila) => suma + fila.unidades,
    0
  );

  const valor = filas.reduce(
    (suma, fila) => suma + fila.valor,
    0
  );

  const criticos = filas.reduce(
    (suma, fila) => suma + fila.criticos,
    0
  );

  const columnas = [
    {
      clave: 'categoria',
      titulo: 'Categoría',
    },
    {
      clave: 'productos',
      titulo: 'Productos',
      clase: 'text-end',
    },
    {
      clave: 'unidades',
      titulo: 'Unidades',
      clase: 'text-end',
    },
    {
      clave: 'criticos',
      titulo: 'Críticos',
      clase: 'text-end',
    },
    {
      clave: 'valor',
      titulo: 'Valor del inventario',
      clase: 'text-end',
      render: (fila) => formatearPrecio(fila.valor),
    },
  ];

  if (cargando && cartas.length === 0) {
    return (
      <>
        <h1 className="h3 mb-3">Productos</h1>
        <SubmenuProductos />

        <p className="text-body-secondary" role="status">
          Cargando reporte de inventario...
        </p>
      </>
    );
  }

  if (error && cartas.length === 0) {
    return (
      <>
        <h1 className="h3 mb-3">Productos</h1>
        <SubmenuProductos />

        <div className="alert alert-danger" role="alert">
          No se pudo cargar el inventario desde JSON Server.
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => recargar().catch(() => {})}
        >
          Reintentar
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>

      <SubmenuProductos />

      <h2 className="h5">
        Reporte de inventario
      </h2>

      <div className="row row-cols-1 row-cols-md-3 g-3 mb-3">
        <div className="col">
          <TarjetaResumen
            titulo="Productos"
            valor={cartas.length}
          />
        </div>

        <div className="col">
          <TarjetaResumen
            titulo="Unidades en stock"
            valor={unidades}
            variante="info"
          />
        </div>

        <div className="col">
          <TarjetaResumen
            titulo="Valor del inventario"
            valor={formatearPrecio(valor)}
            detalle={`${criticos} productos en stock crítico`}
            variante="success"
          />
        </div>
      </div>

      <TablaDatos
        columnas={columnas}
        filas={filas}
        claveFila="categoria"
        mensajeVacio="No hay productos."
      />
    </>
  );
}
