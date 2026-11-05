import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';

// Carta de ejemplo que usan las pruebas de componentes.
export const cartaDePrueba = {
  id: 1,
  codigo: 'TST-001',
  nombre: 'Pikachu de prueba',
  categoria: 'Cartas Pokémon',
  precio: 12990,
  stock: 5,
  imagen: '/img/prueba.png',
  activo: true,
  destacado: false,
};

// Monta un componente dentro de un MemoryRouter (los componentes con
// NavLink/Link lo necesitan) y devuelve el contenedor DOM para consultarlo.
// "ruta" es la dirección inicial, útil para probar rutas protegidas.
export function renderizar(elemento, { ruta = '/' } = {}) {
  const contenedor = document.createElement('div');
  document.body.appendChild(contenedor);
  const raiz = createRoot(contenedor);
  flushSync(() => {
    raiz.render(<MemoryRouter initialEntries={[ruta]}>{elemento}</MemoryRouter>);
  });
  let montado = true;
  return {
    contenedor,
    desmontar() {
      if (!montado) return;
      montado = false;
      flushSync(() => raiz.unmount());
      contenedor.remove();
    },
  };
}

// Espera un momento: React Router aplica las redirecciones (Navigate) de forma
// asíncrona, así que las pruebas de rutas deben esperar antes de revisar el DOM.
export const esperar = (ms = 40) => new Promise((resolver) => setTimeout(resolver, ms));

export function hacerClic(elemento) {
  flushSync(() => {
    elemento.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
}

// Simula que el usuario escribe en un input controlado de React.
export function escribir(input, valor) {
  const asignar = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  flushSync(() => {
    asignar.call(input, valor);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

// Almacén en memoria con la misma interfaz que localStorage (mock).
export function crearAlmacenFalso() {
  const datos = new Map();
  return {
    getItem: (clave) => (datos.has(clave) ? datos.get(clave) : null),
    setItem: (clave, valor) => datos.set(clave, String(valor)),
    removeItem: (clave) => datos.delete(clave),
    clear: () => datos.clear(),
  };
}
