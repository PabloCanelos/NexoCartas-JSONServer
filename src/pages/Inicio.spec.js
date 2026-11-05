import { createElement } from 'react';
import Inicio from './Inicio.jsx';
import { usarAlmacenamiento } from '../services/almacen.js';
import { crearAlmacenFalso, renderizar } from '../tests/utils.jsx';

describe('Página Inicio', () => {
  let vista;
  const almacenReal = typeof localStorage !== 'undefined' ? localStorage : null;

  beforeEach(() => usarAlmacenamiento(crearAlmacenFalso()));
  afterEach(() => {
    vista?.desmontar();
    usarAlmacenamiento(almacenReal);
  });

  it('presenta el catálogo y cartas reales de la colección en el hero', () => {
    vista = renderizar(createElement(Inicio, { onAgregar: () => {} }));

    expect(vista.contenedor.querySelector('.nexo-hero h1').textContent).toContain('colección');
    expect(vista.contenedor.querySelectorAll('.nexo-hero-card img').length).toBe(3);
    expect(vista.contenedor.querySelector('.nexo-hero-card img').getAttribute('src')).toContain('/img/cartas/');
    expect(vista.contenedor.querySelector('.nexo-hero a[href="/productos"]')).not.toBeNull();
    expect(vista.contenedor.querySelector('.nexo-hero a[href="/ofertas"]')).not.toBeNull();
  });
});
