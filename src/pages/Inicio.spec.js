
import { createElement } from 'react';

import Inicio from './Inicio.jsx';
import { ProductosProvider } from '../context/ProductosContext.jsx';
import { usarAlmacenamiento } from '../services/almacen.js';
import {
  crearAlmacenFalso,
  esperar,
  renderizar,
} from '../tests/utils.jsx';

describe('Página Inicio', () => {
  let vista;

  const almacenReal =
    typeof localStorage !== 'undefined' ? localStorage : null;

  const cartasDePrueba = [
    {
      id: 101,
      codigo: 'TST-101',
      nombre: 'Pikachu de prueba',
      categoria: 'Cartas Pokémon',
      precio: 12990,
      stock: 5,
      imagen: '/img/cartas/pikachu.png',
      activo: true,
      destacado: true,
      oferta: false,
    },
    {
      id: 102,
      codigo: 'TST-102',
      nombre: 'Charizard de prueba',
      categoria: 'Cartas Pokémon',
      precio: 19990,
      stock: 3,
      imagen: '/img/cartas/charizard.png',
      activo: true,
      destacado: true,
      oferta: false,
    },
    {
      id: 103,
      codigo: 'TST-103',
      nombre: 'Mewtwo de prueba',
      categoria: 'Cartas Pokémon',
      precio: 15990,
      stock: 4,
      imagen: '/img/cartas/mewtwo.png',
      activo: true,
      destacado: true,
      oferta: false,
    },
  ];

  beforeEach(() => {
    vista = null;

    usarAlmacenamiento(crearAlmacenFalso());

    // Simulamos la API sin utilizar JSON Server.
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

  it('presenta el catálogo y cartas de la colección en el hero', async () => {
    vista = renderizar(
      createElement(
        ProductosProvider,
        null,
        createElement(Inicio, {
          onAgregar: () => {},
        }),
      ),
    );

    // Esperamos la actualización del contexto de productos.
    await esperar(100);

    const titulo = vista.contenedor.querySelector(
      '.nexo-hero h1',
    );

    expect(titulo).not.toBeNull();
    expect(titulo?.textContent).toContain('colección');

    // Comprobamos que se renderizan las tres cartas.
    const tarjetas = Array.from(
      vista.contenedor.querySelectorAll(
        '.nexo-hero-card',
      ),
    );

    expect(tarjetas.length).toBe(3);

    // Verificamos las cartas por sus datos,
    // independientemente de la carga de las imágenes.
    cartasDePrueba.forEach((carta) => {
      const tarjeta = tarjetas.find(
        (elemento) =>
          elemento.getAttribute('href') ===
          `/productos/${carta.id}`,
      );

      expect(tarjeta)
        .withContext(`Debe mostrarse la carta ${carta.nombre}`)
        .toBeDefined();

      expect(tarjeta?.getAttribute('aria-label'))
        .toBe(`Ver ${carta.nombre}`);

      expect(
        tarjeta?.querySelector('img')?.getAttribute('alt'),
      ).toBe(carta.nombre);
    });

    // Comprobamos los enlaces principales del hero.
    expect(
      vista.contenedor.querySelector(
        '.nexo-hero a[href="/productos"]',
      ),
    ).not.toBeNull();

    expect(
      vista.contenedor.querySelector(
        '.nexo-hero a[href="/ofertas"]',
      ),
    ).not.toBeNull();
  });
});
