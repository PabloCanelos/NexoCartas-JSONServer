import { Link } from 'react-router';
import ItemCarrito from '../components/ItemCarrito.jsx';
import ResumenPedido from '../components/ResumenPedido.jsx';
import { useCarrito } from '../context/CarritoContext.jsx';

// Página /carrito : líneas editables y resumen con el total.
export default function Carrito() {
  const { lineas, subtotal, hayProblemas, cambiarCantidad, quitar, vaciar } = useCarrito();

  if (lineas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">Tu carrito está vacío</h1>
        <p className="text-body-secondary">Agrega cartas desde el catálogo para comenzar.</p>
        <Link to="/productos" className="btn btn-primary">
          Ver productos
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Carrito</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="table-responsive">
            <table className="table align-middle bg-white">
              <thead>
                <tr>
                  <th scope="col">Carta</th>
                  <th scope="col" className="text-end">Precio</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col" className="text-end">Subtotal</th>
                  <th scope="col"><span className="visually-hidden">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {lineas.map((linea) => (
                  <ItemCarrito
                    key={linea.carta.id}
                    linea={linea}
                    onCantidad={cambiarCantidad}
                    onQuitar={quitar}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={vaciar}>
            Vaciar carrito
          </button>
        </div>
        <div className="col-12 col-lg-4">
          <ResumenPedido lineas={lineas} subtotal={subtotal}>
            {hayProblemas && (
              <div className="alert alert-warning small mt-3 mb-0" role="alert">
                Ajusta las cantidades: algunas superan el stock disponible.
              </div>
            )}
            <Link
              to="/checkout"
              className={'btn btn-primary w-100 mt-3' + (hayProblemas ? ' disabled' : '')}
              aria-disabled={hayProblemas}
            >
              Ir al checkout
            </Link>
          </ResumenPedido>
        </div>
      </div>
    </main>
  );
}
