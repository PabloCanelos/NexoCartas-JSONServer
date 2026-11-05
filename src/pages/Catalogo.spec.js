import { createElement } from 'react';
import Catalogo from './Catalogo.jsx';
import { ProductosProvider } from '../context/ProductosContext.jsx';
import { usarAlmacenamiento } from '../services/almacen.js';
import {
  crearAlmacenFalso,
  escribir,
  esperar,
  renderizar,
} from '../tests/utils.jsx';

describe('Página Catalogo', () => {
  let vista;

  const almacenReal =
    typeof localStorage !== 'undefined' ? localStorage : null;

  const cartasDePrueba = [
    {
      id: 101,
      codigo: 'TST-101',
      nombre: 'Charizard de prueba',
      categoria: 'Cartas Pokémon',
      precio: 19990,
      stock: 5,
      imagen: '/img/sin-imagen.svg',
      activo: true,
      destacado: true,
      oferta: false,
    },
    {
      id: 102,
      codigo: 'TST-102',
      nombre: 'Pikachu de prueba',
      categoria: 'Cartas Pokémon',
      precio: 12990,
      stock: 3,
      imagen: '/img/sin-imagen.svg',
      activo: true,
      destacado: false,
      oferta: false,
    },
    {
      id: 103,
      codigo: 'TST-103',
      nombre: 'Charizard especial',
      categoria: 'Cartas Pokémon',
      precio: 24990,
      stock: 2,
      imagen: '/img/sin-imagen.svg',
      activo: true,
      destacado: false,
      oferta: false,
    },
  ];

  beforeEach(() => {
    usarAlmacenamiento(crearAlmacenFalso());

    spyOn(globalThis, 'fetch').and.callFake(async () => {
      return new Response(JSON.stringify(cartasDePrueba), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  afterEach(() => {
    vista?.desmontar();
    vista = null;
    usarAlmacenamiento(almacenReal);
  });

  it('filtra las cartas en tiempo real al escribir en el buscador', async () => {
    vista = renderizar(
  createElement(
    ProductosProvider,
    null,
    createElement(Catalogo, {
      onAgregar: () => {},
    }),
  ),
);

    // Esperar a que termine la carga de productos.
    await esperar(100);

    const total = vista.contenedor.querySelectorAll(
      '.tarjeta-carta',
    ).length;

    expect(total).toBe(3);

    const buscador = vista.contenedor.querySelector('#buscador');

    expect(buscador).not.toBeNull();

    escribir(buscador, 'charizard');

    const filtradas = vista.contenedor.querySelectorAll(
      '.tarjeta-carta',
    );

    expect(filtradas.length).toBe(2);

    filtradas.forEach((tarjeta) => {
      expect(
        tarjeta.textContent.toLowerCase(),
      ).toContain('charizard');
    });

    escribir(buscador, 'zzzz-no-existe');

    expect(
      vista.contenedor.textContent,
    ).toContain('No hay cartas');
  });
});
