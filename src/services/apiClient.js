
const API_URL = 'http://localhost:3001';

export async function solicitarApi(ruta, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...opciones.headers,
      },
    });
  } catch {
    throw new Error(
      'No se pudo conectar con la API. Verifica que JSON Server esté funcionando.',
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `La API respondió con un error HTTP ${respuesta.status}.`,
    );
  }

  if (respuesta.status === 204) {
    return null;
  }

  return respuesta.json();
}
