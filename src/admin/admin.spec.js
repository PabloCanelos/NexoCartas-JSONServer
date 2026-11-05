import { Route, Routes } from 'react-router';
import RutaAdmin from './RutaAdmin.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import TarjetaResumen from '../components/TarjetaResumen.jsx';
import { SesionProvider } from '../context/SesionContext.jsx';
import { usarAlmacenamiento } from '../services/almacen.js';
import { crearAlmacenFalso, esperar, renderizar } from '../tests/utils.jsx';

describe('RutaAdmin (acceso al panel)', () => {
  let vista;
  const almacenReal = typeof localStorage !== 'undefined' ? localStorage : null;
  let almacen;

  function montarPanel() {
    vista = renderizar(
      <SesionProvider>
        <Routes>
          <Route element={<RutaAdmin />}>
            <Route path="/admin" element={<p>contenido admin</p>} />
          </Route>
          <Route path="/login" element={<p>pantalla login</p>} />
          <Route path="/" element={<p>tienda</p>} />
        </Routes>
      </SesionProvider>,
      { ruta: '/admin' },
    );
  }

  beforeEach(() => {
    almacen = crearAlmacenFalso();
    usarAlmacenamiento(almacen);
  });
  afterEach(() => {
    vista?.desmontar();
    usarAlmacenamiento(almacenReal);
  });

  it('redirige a /login cuando no hay sesión', async () => {
    montarPanel();
    await esperar();
    expect(vista.contenedor.textContent).toBe('pantalla login');
  });

  it('manda a la tienda a un cliente que intenta entrar al panel', async () => {
    almacen.setItem('nexoSesion', JSON.stringify({ id: 2, nombre: 'Cliente', rol: 'cliente' }));
    montarPanel();
    await esperar();
    expect(vista.contenedor.textContent).toBe('tienda');
  });

  it('muestra el contenido al administrador', async () => {
    almacen.setItem('nexoSesion', JSON.stringify({ id: 1, nombre: 'Admin', rol: 'admin' }));
    montarPanel();
    await esperar();
    expect(vista.contenedor.textContent).toBe('contenido admin');
  });
});

describe('Componentes del panel', () => {
  let vista;
  afterEach(() => vista?.desmontar());

  it('TarjetaResumen muestra el título, el valor y el enlace solo si recibe "to"', () => {
    vista = renderizar(<TarjetaResumen titulo="Órdenes" valor={7} to="/admin/ordenes" />);
    expect(vista.contenedor.textContent).toContain('Órdenes');
    expect(vista.contenedor.querySelector('[data-testid="valor-resumen"]').textContent).toBe('7');
    expect(vista.contenedor.querySelector('a').getAttribute('href')).toBe('/admin/ordenes');
    vista.desmontar();
    vista = renderizar(<TarjetaResumen titulo="Órdenes" valor={7} />);
    expect(vista.contenedor.querySelector('a')).toBeNull();
  });

  it('TablaDatos dibuja una fila por registro o un aviso si no hay datos', () => {
    const columnas = [{ clave: 'nombre', titulo: 'Nombre' }];
    vista = renderizar(
      <TablaDatos columnas={columnas} filas={[{ id: 1, nombre: 'Ana' }, { id: 2, nombre: 'Luis' }]} claveFila="id" />,
    );
    expect(vista.contenedor.querySelectorAll('tbody tr').length).toBe(2);
    vista.desmontar();
    vista = renderizar(<TablaDatos columnas={columnas} filas={[]} claveFila="id" mensajeVacio="Sin datos." />);
    expect(vista.contenedor.querySelector('[role="status"]').textContent).toBe('Sin datos.');
  });
});
