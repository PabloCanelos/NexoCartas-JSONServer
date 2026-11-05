
import {
  obtenerCategoriasApi,
  crearCategoriaApi,
  actualizarCategoriaApi,
  eliminarCategoriaApi,
} from './categoriasService.js';

describe('API de categorías', () => {
  let categoriasSimuladas;
  let productosSimulados;

  const baseUrl = 'http://localhost:3001';

  const respuestaJson = (datos, estado = 200) =>
    new Response(JSON.stringify(datos), {
      status: estado,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  beforeEach(() => {
    categoriasSimuladas = [
      { id: 1, nombre: 'Cartas Pokémon' },
      { id: 2, nombre: 'Coleccionables' },
    ];

    productosSimulados = [];

    // Simulamos JSON Server sin modificar db.json.
    spyOn(globalThis, 'fetch').and.callFake(async (url, opciones = {}) => {
      const metodo = opciones.method ?? 'GET';

      if (url === `${baseUrl}/categorias` && metodo === 'GET') {
        return respuestaJson(categoriasSimuladas);
      }

      if (url === `${baseUrl}/categorias` && metodo === 'POST') {
        const datos = JSON.parse(opciones.body);

        return respuestaJson({
          id: 3,
          nombre: datos.nombre,
        }, 201);
      }

      if (url === `${baseUrl}/categorias/1` && metodo === 'PATCH') {
        const datos = JSON.parse(opciones.body);

        return respuestaJson({
          id: 1,
          nombre: datos.nombre,
        });
      }

      if (url === `${baseUrl}/cartas` && metodo === 'GET') {
        return respuestaJson(productosSimulados);
      }

      if (url === `${baseUrl}/categorias/2` && metodo === 'DELETE') {
        return new Response(null, { status: 204 });
      }

      return respuestaJson(
        { error: 'Solicitud no simulada' },
        404,
      );
    });
  });

  it('GET: obtiene las categorías desde la API', async () => {
    const categorias = await obtenerCategoriasApi();

    expect(categorias).toEqual(categoriasSimuladas);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${baseUrl}/categorias`,
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('POST: crea una categoría con el nombre limpio', async () => {
    const resultado = await crearCategoriaApi('  Accesorios  ');

    expect(resultado).toEqual({
      id: 3,
      nombre: 'Accesorios',
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${baseUrl}/categorias`,
      jasmine.objectContaining({
        method: 'POST',
        body: JSON.stringify({ nombre: 'Accesorios' }),
      }),
    );
  });

  it('PATCH: actualiza el nombre de una categoría existente', async () => {
    const resultado = await actualizarCategoriaApi(
      1,
      '  Cartas Especiales  ',
    );

    expect(resultado).toEqual({
      id: 1,
      nombre: 'Cartas Especiales',
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${baseUrl}/categorias/1`,
      jasmine.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ nombre: 'Cartas Especiales' }),
      }),
    );
  });

  it('DELETE: elimina una categoría sin productos asociados', async () => {
    const resultado = await eliminarCategoriaApi(2);

    expect(resultado).toBeTrue();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${baseUrl}/categorias/2`,
      jasmine.objectContaining({
        method: 'DELETE',
      }),
    );
  });

  it('DELETE: impide eliminar una categoría con productos asociados', async () => {
    productosSimulados = [
      {
        id: 101,
        nombre: 'Pikachu',
        categoria: 'Cartas Pokémon',
      },
    ];

    await expectAsync(
      eliminarCategoriaApi(1),
    ).toBeRejectedWithError(
      'No se puede eliminar: la categoría todavía tiene cartas.',
    );

    const solicitudesDelete = globalThis.fetch.calls
      .allArgs()
      .filter(([, opciones]) => opciones?.method === 'DELETE');

    expect(solicitudesDelete.length).toBe(0);
  });

  it('POST: impide crear una categoría con nombre duplicado', async () => {
    await expectAsync(
      crearCategoriaApi('  CARTAS POKÉMON  '),
    ).toBeRejectedWithError(
      'Ya existe una categoría con ese nombre.',
    );

    const solicitudesPost = globalThis.fetch.calls
      .allArgs()
      .filter(([, opciones]) => opciones?.method === 'POST');

    expect(solicitudesPost.length).toBe(0);
  });

  it('PATCH: impide utilizar el nombre de otra categoría', async () => {
    // Intentamos cambiar "Cartas Pokémon" por "Coleccionables".
    await expectAsync(
      actualizarCategoriaApi(1, '  COLECCIONABLES  '),
    ).toBeRejectedWithError(
      'Ya existe una categoría con ese nombre.',
    );

    // No debe enviarse PATCH si el nombre pertenece a otra categoría.
    const solicitudesPatch = globalThis.fetch.calls
      .allArgs()
      .filter(([, opciones]) => opciones?.method === 'PATCH');

    expect(solicitudesPatch.length).toBe(0);
  });
});
