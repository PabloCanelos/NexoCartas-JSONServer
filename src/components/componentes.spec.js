import ListaCartas from './ListaCartas.jsx';
import Navbar from './Navbar.jsx';
import TarjetaCarta from './TarjetaCarta.jsx';
import { cartaDePrueba, hacerClic, renderizar } from '../tests/utils.jsx';

describe('TarjetaCarta', () => {
  let vista;
  afterEach(() => vista?.desmontar());

  // Prueba 1: renderizado correcto con los datos recibidos por props
  it('muestra el nombre, el precio formateado y la imagen de la carta', () => {
    vista = renderizar(<TarjetaCarta carta={cartaDePrueba} onAgregar={() => {}} />);
    expect(vista.contenedor.textContent).toContain('Pikachu de prueba');
    expect(vista.contenedor.textContent).toContain('$12.990');
    expect(vista.contenedor.querySelector('img').getAttribute('alt')).toBe('Pikachu de prueba');
  });

  // Prueba 2: renderizado condicional según el stock
  it('deshabilita el botón y muestra "Sin stock" cuando el stock es 0', () => {
    vista = renderizar(<TarjetaCarta carta={{ ...cartaDePrueba, stock: 0 }} onAgregar={() => {}} />);
    expect(vista.contenedor.querySelector('button').disabled).toBeTrue();
    expect(vista.contenedor.textContent).toContain('Sin stock');
  });

  // Prueba 3: props de función + evento de clic (mock con jasmine.createSpy)
  it('llama a onAgregar con el id de la carta al hacer clic', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    vista = renderizar(<TarjetaCarta carta={cartaDePrueba} onAgregar={onAgregar} />);
    hacerClic(vista.contenedor.querySelector('button'));
    expect(onAgregar).toHaveBeenCalledOnceWith(1);
  });
});

describe('ListaCartas', () => {
  let vista;
  afterEach(() => vista?.desmontar());

  // Prueba 4: la lista dibuja todos los elementos del conjunto de datos
  it('renderiza una tarjeta por cada carta recibida', () => {
    const cartas = [1, 2, 3].map((n) => ({ ...cartaDePrueba, id: n, nombre: `Carta ${n}` }));
    vista = renderizar(<ListaCartas cartas={cartas} onAgregar={() => {}} />);
    expect(vista.contenedor.querySelectorAll('.tarjeta-carta').length).toBe(3);
  });

  // Prueba 5: mensaje que solo aparece cuando no hay datos
  it('muestra un mensaje y ninguna tarjeta cuando la lista está vacía', () => {
    vista = renderizar(<ListaCartas cartas={[]} onAgregar={() => {}} />);
    expect(vista.contenedor.querySelector('[role="status"]').textContent).toContain('No hay cartas');
    expect(vista.contenedor.querySelectorAll('.tarjeta-carta').length).toBe(0);
  });
});

describe('Navbar', () => {
  let vista;
  afterEach(() => vista?.desmontar());

  // Prueba 6: el contador del carrito aparece solo si hay productos
  it('muestra el contador del carrito solo cuando la cantidad es mayor que 0', () => {
    vista = renderizar(<Navbar cantidadCarrito={0} />);
    expect(vista.contenedor.querySelector('[data-testid="contador-carrito"]')).toBeNull();
    vista.desmontar();
    vista = renderizar(<Navbar cantidadCarrito={4} />);
    expect(vista.contenedor.querySelector('[data-testid="contador-carrito"]').textContent).toBe('4');
  });

  // Prueba 7: cambio de estado interno (abrir y cerrar el menú)
  it('abre y cierra el menú móvil al presionar el botón hamburguesa', () => {
    vista = renderizar(<Navbar />);
    const boton = vista.contenedor.querySelector('.navbar-toggler');
    const menu = vista.contenedor.querySelector('#menu-principal');
    expect(menu.classList.contains('show')).toBeFalse();
    hacerClic(boton);
    expect(menu.classList.contains('show')).toBeTrue();
    expect(boton.getAttribute('aria-expanded')).toBe('true');
    hacerClic(boton);
    expect(menu.classList.contains('show')).toBeFalse();
  });
});
