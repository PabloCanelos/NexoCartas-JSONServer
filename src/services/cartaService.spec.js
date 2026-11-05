import {
  actualizarCarta,
  buscarCartaPorId,
  crearCarta,
  eliminarCarta,
  obtenerCartas,
} from './cartasService.js';
import { usarAlmacenamiento } from './almacen.js';
import { crearAlmacenFalso } from '../tests/utils.jsx';

describe('cartasService (CRUD)', () => {
  const almacenReal = typeof localStorage !== 'undefined' ? localStorage : null;
  const datosNuevos = {
    codigo: 'TST-900',
    nombre: 'Carta nueva',
    categoria: 'Coleccionables',
    precio: 5000,
    stock: 2,
    imagen: '/img/x.png',
  };

  // El almacén falso evita que las pruebas modifiquen el localStorage real.
  beforeEach(() => usarAlmacenamiento(crearAlmacenFalso()));
  afterEach(() => usarAlmacenamiento(almacenReal));

  // Prueba 9: operación CRUD completa (crear, leer, actualizar, eliminar)
  it('crea, lee, actualiza y elimina una carta', () => {
    const antes = obtenerCartas().length;

    const creada = crearCarta(datosNuevos);
    expect(obtenerCartas().length).toBe(antes + 1);
    expect(buscarCartaPorId(creada.id).nombre).toBe('Carta nueva');

    actualizarCarta(creada.id, { precio: 7000, stock: 0 });
    expect(buscarCartaPorId(creada.id).precio).toBe(7000);
    expect(buscarCartaPorId(creada.id).stock).toBe(0);

    expect(eliminarCarta(creada.id)).toBeTrue();
    expect(buscarCartaPorId(creada.id)).toBeNull();
    expect(obtenerCartas().length).toBe(antes);
  });

  // Prueba 10: mensajes de error de validación
  it('rechaza código repetido y precio negativo con un mensaje claro', () => {
    const codigoExistente = obtenerCartas()[0].codigo;
    expect(() => crearCarta({ ...datosNuevos, codigo: codigoExistente })).toThrowError(
      'Ya existe una carta con ese código.',
    );
    expect(() => crearCarta({ ...datosNuevos, precio: -1 })).toThrowError(
      'El precio debe ser un número mayor o igual a 0.',
    );
  });
});
