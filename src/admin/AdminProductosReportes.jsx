import TablaDatos from '../components/TablaDatos.jsx';
import TarjetaResumen from '../components/TarjetaResumen.jsx';
import { STOCK_CRITICO_DEFECTO } from '../data/datos.js';
import { useCartas } from '../hooks/useCartas.js';
import { formatearPrecio } from '../services/formato.js';
import { inventarioPorCategoria } from '../services/reportesService.js';
import SubmenuProductos from './SubmenuProductos.jsx';

// /admin/productos/reportes : inventario valorizado por categoría.
export default function AdminProductosReportes() {
  const { cartas } = useCartas();
  const filas = inventarioPorCategoria(cartas, STOCK_CRITICO_DEFECTO);
  const unidades = filas.reduce((suma, f) => suma + f.unidades, 0);
  const valor = filas.reduce((suma, f) => suma + f.valor, 0);
  const criticos = filas.reduce((suma, f) => suma + f.criticos, 0);

  const columnas = [
    { clave: 'categoria', titulo: 'Categoría' },
    { clave: 'productos', titulo: 'Productos', clase: 'text-end' },
    { clave: 'unidades', titulo: 'Unidades', clase: 'text-end' },
    { clave: 'criticos', titulo: 'Críticos', clase: 'text-end' },
    { clave: 'valor', titulo: 'Valor del inventario', clase: 'text-end', render: (f) => formatearPrecio(f.valor) },
  ];

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>
      <SubmenuProductos />
      <h2 className="h5">Reporte de inventario</h2>
      <div className="row row-cols-1 row-cols-md-3 g-3 mb-3">
        <div className="col"><TarjetaResumen titulo="Productos" valor={cartas.length} /></div>
        <div className="col"><TarjetaResumen titulo="Unidades en stock" valor={unidades} variante="info" /></div>
        <div className="col"><TarjetaResumen titulo="Valor del inventario" valor={formatearPrecio(valor)}
          detalle={`${criticos} productos en stock crítico`} variante="success" /></div>
      </div>
      <TablaDatos columnas={columnas} filas={filas} claveFila="categoria" mensajeVacio="No hay productos." />
    </>
  );
}
