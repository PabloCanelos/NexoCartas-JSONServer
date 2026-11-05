
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import CampoFormulario from '../components/CampoFormulario.jsx';
import ResumenPedido from '../components/ResumenPedido.jsx';

import { useCarrito } from '../context/CarritoContext.jsx';
import { useProductos } from '../context/ProductosContext.jsx';
import { useSesion } from '../context/SesionContext.jsx';

import { METODOS_ENTREGA, REGIONES } from '../data/datos.js';
import { confirmarCompra } from '../services/ordenesService.js';
import { validarCheckout } from '../services/validaciones.js';

export default function Checkout() {
  const { lineas, subtotal, hayProblemas, vaciar } = useCarrito();
  const { recargar } = useProductos();
  const { usuario } = useSesion();
  const navigate = useNavigate();

  const [valores, setValores] = useState(() => {
    const partes = (usuario?.nombre || '').split(' ');

    return {
      nombre: partes[0] || '',
      apellido: partes.slice(1).join(' '),
      correo: usuario?.correo || '',
      telefono: '',
      calle: '',
      numero: '',
      region: '',
      comuna: '',
      referencias: '',
      entrega: 'domicilio',
      rechazar: false,
    };
  });

  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);

  const entrega =
    METODOS_ENTREGA.find((metodo) => metodo.id === valores.entrega) ||
    METODOS_ENTREGA[0];

  const comunas = REGIONES[valores.region] || [];

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;

    setValores((actual) => ({
      ...actual,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'region' ? { comuna: '' } : {}),
    }));
  }

  async function enviar(evento) {
    evento.preventDefault();

    if (procesando) return;

    const nuevosErrores = validarCheckout(valores);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0 || hayProblemas) {
      return;
    }

    setProcesando(true);

    try {
      const orden = await confirmarCompra({
        cliente: {
          nombre: valores.nombre.trim(),
          apellido: valores.apellido.trim(),
          correo: valores.correo.trim(),
          telefono: valores.telefono.trim(),
        },
        direccion: {
          calle: valores.calle.trim(),
          numero: valores.numero.trim(),
          region: valores.region,
          comuna: valores.comuna,
          referencias: valores.referencias.trim(),
        },
        entrega,
        lineas: lineas.map((linea) => ({
          id: linea.carta.id,
          cantidad: linea.cantidad,
        })),
        simularRechazo: valores.rechazar,
      });

      // La compra ya fue confirmada por el servicio.
      vaciar();

      // Actualizar el catálogo con el inventario vigente.
      try {
        await recargar();
      } catch {
        // La compra ya está confirmada.
        // Un fallo al refrescar el catálogo no debe
        // convertirla en una compra rechazada.
      }

      navigate(`/pago/correcto/${orden.id}`, {
        replace: true,
      });
    } catch (error) {
      navigate('/pago/error', {
        replace: true,
        state: {
          mensaje:
            error instanceof Error
              ? error.message
              : 'No fue posible completar la compra.',
        },
      });
    } finally {
      setProcesando(false);
    }
  }

  if (lineas.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">No hay productos para pagar</h1>

        <Link to="/productos" className="btn btn-primary">
          Ver productos
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Checkout</h1>

      <form onSubmit={enviar} noValidate>
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <fieldset className="card card-body mb-3">
              <legend className="h5">Datos del cliente</legend>

              <div className="row g-3">
                <CampoFormulario
                  className="col-12 col-md-6"
                  id="nombre"
                  name="nombre"
                  label="Nombre"
                  value={valores.nombre}
                  onChange={cambiar}
                  error={errores.nombre}
                  autoComplete="given-name"
                />

                <CampoFormulario
                  className="col-12 col-md-6"
                  id="apellido"
                  name="apellido"
                  label="Apellido"
                  value={valores.apellido}
                  onChange={cambiar}
                  error={errores.apellido}
                  autoComplete="family-name"
                />

                <CampoFormulario
                  className="col-12 col-md-6"
                  id="correo"
                  name="correo"
                  label="Correo"
                  type="email"
                  value={valores.correo}
                  onChange={cambiar}
                  error={errores.correo}
                  autoComplete="email"
                />

                <CampoFormulario
                  className="col-12 col-md-6"
                  id="telefono"
                  name="telefono"
                  label="Teléfono"
                  type="tel"
                  value={valores.telefono}
                  onChange={cambiar}
                  error={errores.telefono}
                  autoComplete="tel"
                />
              </div>
            </fieldset>

            <fieldset className="card card-body mb-3">
              <legend className="h5">Dirección</legend>

              <div className="row g-3">
                <CampoFormulario
                  className="col-12 col-md-8"
                  id="calle"
                  name="calle"
                  label="Calle"
                  value={valores.calle}
                  onChange={cambiar}
                  error={errores.calle}
                  autoComplete="address-line1"
                />

                <CampoFormulario
                  className="col-12 col-md-4"
                  id="numero"
                  name="numero"
                  label="Número"
                  value={valores.numero}
                  onChange={cambiar}
                  error={errores.numero}
                />

                <CampoFormulario
                  as="select"
                  className="col-12 col-md-6"
                  id="region"
                  name="region"
                  label="Región"
                  value={valores.region}
                  onChange={cambiar}
                  error={errores.region}
                >
                  <option value="">Selecciona una región</option>

                  {Object.keys(REGIONES).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </CampoFormulario>

                <CampoFormulario
                  as="select"
                  className="col-12 col-md-6"
                  id="comuna"
                  name="comuna"
                  label="Comuna"
                  value={valores.comuna}
                  onChange={cambiar}
                  error={errores.comuna}
                  disabled={comunas.length === 0}
                >
                  <option value="">Selecciona una comuna</option>

                  {comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </CampoFormulario>

                <CampoFormulario
                  className="col-12"
                  id="referencias"
                  name="referencias"
                  label="Referencias (opcional)"
                  value={valores.referencias}
                  onChange={cambiar}
                />
              </div>
            </fieldset>

            <fieldset className="card card-body mb-3">
              <legend className="h5">Entrega</legend>

              {METODOS_ENTREGA.map((metodo) => (
                <div className="form-check" key={metodo.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="entrega"
                    id={`entrega-${metodo.id}`}
                    value={metodo.id}
                    checked={valores.entrega === metodo.id}
                    onChange={cambiar}
                  />

                  <label
                    className="form-check-label"
                    htmlFor={`entrega-${metodo.id}`}
                  >
                    {metodo.nombre} —{' '}
                    {metodo.costo === 0
                      ? 'Gratis'
                      : '$' + metodo.costo.toLocaleString('es-CL')}
                  </label>
                </div>
              ))}
            </fieldset>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="rechazar"
                id="rechazar"
                checked={valores.rechazar}
                onChange={cambiar}
              />

              <label
                className="form-check-label small"
                htmlFor="rechazar"
              >
                Simular pago rechazado (solo para probar la vista de error)
              </label>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <ResumenPedido
              lineas={lineas}
              subtotal={subtotal}
              envio={entrega.costo}
            >
              {hayProblemas && (
                <div
                  className="alert alert-warning small mt-3 mb-0"
                  role="alert"
                >
                  Hay cantidades que superan el stock.{' '}
                  <Link to="/carrito">
                    Revisa tu carrito
                  </Link>.
                </div>
              )}

              <button
                type="submit"
                className="btn btn-success w-100 mt-3"
                disabled={procesando || hayProblemas}
              >
                {procesando
                  ? 'Procesando...'
                  : 'Confirmar y pagar'}
              </button>

              <p className="small text-body-secondary mt-2 mb-0">
                Compra simulada: no se realiza ningún cobro real.
              </p>
            </ResumenPedido>
          </div>
        </div>
      </form>
    </main>
  );
}
