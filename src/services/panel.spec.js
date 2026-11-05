import { usarAlmacenamiento } from './almacen.js';
import {
  crearCategoria,
  eliminarCategoria,
  obtenerCategoriasConConteo,
  renombrarCategoria,
} from './categoriasService.js';
import { buscarCartaPorId, obtenerCartas } from './cartasService.js';
import { obtenerOrdenes } from './ordenesService.js';
import { filtrarPorFecha, resumenVentas, topProductos } from './reportesService.js';
import { eliminarUsuario, obtenerUsuarios } from './usuariosService.js';
import { validarCambioClave, validarProducto } from './validaciones.js';
import { crearAlmacenFalso } from '../tests/utils.jsx';

describe('Servicios del panel de administración', () => {
  const almacenReal = typeof localStorage !== 'undefined' ? localStorage : null;
  beforeEach(() => usarAlmacenamiento(crearAlmacenFalso()));
  afterEach(() => usarAlmacenamiento(almacenReal));

  it('reportes: suma solo las órdenes vendidas y respeta el rango de fechas', () => {
    const ordenes = obtenerOrdenes();
    expect(ordenes.length).toBeGreaterThan(0);
    const resumen = resumenVentas(ordenes);
    const esperado = ordenes
      .filter((o) => ['confirmada', 'enviada', 'entregada'].includes(o.estado))
      .reduce((suma, o) => suma + o.total, 0);
    expect(resumen.total).toBe(esperado);
    expect(filtrarPorFecha(ordenes, '2999-01-01', '').length).toBe(0);
    expect(topProductos(ordenes, 2).length).toBeLessThanOrEqual(2);
  });

  it('categorías: renombrar actualiza las cartas y no deja eliminar una categoría con cartas', () => {
    const nombre = obtenerCartas()[0].categoria;
    const cantidad = obtenerCategoriasConConteo().find((c) => c.nombre === nombre).cantidad;
    expect(() => eliminarCategoria(nombre)).toThrowError('No se puede eliminar: la categoría todavía tiene cartas.');

    renombrarCategoria(nombre, 'Categoría renombrada');
    expect(obtenerCartas().filter((c) => c.categoria === 'Categoría renombrada').length).toBe(cantidad);

    crearCategoria('Vacía');
    expect(eliminarCategoria('Vacía')).toBeTrue();
  });

  it('usuarios: no se puede eliminar al último administrador activo', () => {
    const admin = obtenerUsuarios().find((u) => u.rol === 'admin');
    expect(() => eliminarUsuario(admin.id)).toThrowError('Debe quedar al menos un administrador activo.');
  });

  it('validaciones: precio de oferta mayor al normal y contraseñas distintas', () => {
    const base = { codigo: 'A', nombre: 'B', categoria: 'C', precio: 1000, stock: 1 };
    expect(validarProducto({ ...base, oferta: true, precioOferta: 1500 }).precioOferta).toContain('menor');
    expect(validarProducto({ ...base, oferta: true, precioOferta: 800 })).toEqual({});
    expect(validarCambioClave({ actual: 'x', nueva: '123456', confirmar: '654321' }).confirmar).toContain('no coinciden');
  });

  it('cartas: los datos del panel parten del catálogo con productos de oferta', () => {
    const conOferta = obtenerCartas().filter((c) => c.oferta);
    expect(conOferta.length).toBeGreaterThan(0);
    conOferta.forEach((c) => expect(buscarCartaPorId(c.id).precioOferta).toBeLessThan(c.precio));
  });
});
