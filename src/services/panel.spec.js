
import { usarAlmacenamiento } from './almacen.js';
import { buscarCartaPorId, obtenerCartas } from './cartasService.js';
import { obtenerOrdenes } from './ordenesService.js';
import {
  filtrarPorFecha,
  resumenVentas,
  topProductos,
} from './reportesService.js';
import { eliminarUsuario, obtenerUsuarios } from './usuariosService.js';
import {
  validarCambioClave,
  validarProducto,
} from './validaciones.js';
import { crearAlmacenFalso } from '../tests/utils.jsx';

describe('Servicios del panel de administración', () => {
  const almacenReal =
    typeof localStorage !== 'undefined' ? localStorage : null;

  beforeEach(() => {
    usarAlmacenamiento(crearAlmacenFalso());
  });

  afterEach(() => {
    usarAlmacenamiento(almacenReal);
  });

  it('reportes: suma solo las órdenes vendidas y respeta el rango de fechas', () => {
    const ordenes = obtenerOrdenes();

    expect(ordenes.length).toBeGreaterThan(0);

    const resumen = resumenVentas(ordenes);

    const esperado = ordenes
      .filter((orden) =>
        ['confirmada', 'enviada', 'entregada'].includes(orden.estado),
      )
      .reduce((suma, orden) => suma + orden.total, 0);

    expect(resumen.total).toBe(esperado);

    expect(
      filtrarPorFecha(ordenes, '2999-01-01', '').length,
    ).toBe(0);

    expect(topProductos(ordenes, 2).length).toBeLessThanOrEqual(2);
  });

  it('usuarios: no se puede eliminar al último administrador activo', () => {
    const admin = obtenerUsuarios().find(
      (usuario) => usuario.rol === 'admin',
    );

    expect(() => eliminarUsuario(admin.id)).toThrowError(
      'Debe quedar al menos un administrador activo.',
    );
  });

  it('validaciones: precio de oferta mayor al normal y contraseñas distintas', () => {
    const base = {
      codigo: 'A',
      nombre: 'B',
      categoria: 'C',
      precio: 1000,
      stock: 1,
    };

    expect(
      validarProducto({
        ...base,
        oferta: true,
        precioOferta: 1500,
      }).precioOferta,
    ).toContain('menor');

    expect(
      validarProducto({
        ...base,
        oferta: true,
        precioOferta: 800,
      }),
    ).toEqual({});

    expect(
      validarCambioClave({
        actual: 'x',
        nueva: '123456',
        confirmar: '654321',
      }).confirmar,
    ).toContain('no coinciden');
  });

  it('cartas: los datos del panel parten del catálogo con productos de oferta', () => {
    const conOferta = obtenerCartas().filter(
      (carta) => carta.oferta,
    );

    expect(conOferta.length).toBeGreaterThan(0);

    conOferta.forEach((carta) => {
      expect(
        buscarCartaPorId(carta.id).precioOferta,
      ).toBeLessThan(carta.precio);
    });
  });
});
