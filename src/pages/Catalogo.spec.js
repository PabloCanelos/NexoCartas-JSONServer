import Catalogo from './Catalogo.jsx';
import { usarAlmacenamiento } from '../services/almacen.js';
import { crearAlmacenFalso, escribir, renderizar } from '../tests/utils.jsx';

describe('Página Catalogo', () => {
  let vista;
  const almacenReal = typeof localStorage !== 'undefined' ? localStorage : null;

  beforeEach(() => usarAlmacenamiento(crearAlmacenFalso()));
  afterEach(() => {
    vista?.desmontar();
    usarAlmacenamiento(almacenReal);
  });

  // Prueba 8: formulario (input controlado) que actualiza el estado y filtra la lista
  it('filtra las cartas en tiempo real al escribir en el buscador', () => {
    vista = renderizar(<Catalogo onAgregar={() => {}} />);
    const total = vista.contenedor.querySelectorAll('.tarjeta-carta').length;
    expect(total).toBeGreaterThan(1);

    escribir(vista.contenedor.querySelector('#buscador'), 'charizard');
    const filtradas = vista.contenedor.querySelectorAll('.tarjeta-carta');
    expect(filtradas.length).toBeGreaterThan(0);
    expect(filtradas.length).toBeLessThan(total);
    filtradas.forEach((tarjeta) => {
      expect(tarjeta.textContent.toLowerCase()).toContain('charizard');
    });

    escribir(vista.contenedor.querySelector('#buscador'), 'zzzz-no-existe');
    expect(vista.contenedor.textContent).toContain('No hay cartas');
  });
});
