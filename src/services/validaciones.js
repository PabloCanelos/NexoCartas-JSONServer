// Funciones puras de validación. Cada una devuelve un objeto { campo: 'mensaje' }.
// Si el objeto viene vacío, el formulario es válido.
const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_TELEFONO = /^\+?[0-9 ]{8,15}$/;

export function esCorreoValido(valor) {
  return RE_CORREO.test(String(valor || '').trim());
}

function vacio(valor) {
  return !String(valor ?? '').trim();
}

export function validarLogin({ correo, clave }) {
  const errores = {};
  if (vacio(correo)) errores.correo = 'Ingresa tu correo.';
  else if (!esCorreoValido(correo)) errores.correo = 'El correo no tiene un formato válido.';
  if (vacio(clave)) errores.clave = 'Ingresa tu contraseña.';
  return errores;
}

export function validarRegistro({ nombre, correo, clave, confirmar }) {
  const errores = {};
  if (vacio(nombre) || String(nombre).trim().length < 2) {
    errores.nombre = 'Ingresa tu nombre (mínimo 2 caracteres).';
  }
  if (vacio(correo)) errores.correo = 'Ingresa tu correo.';
  else if (!esCorreoValido(correo)) errores.correo = 'El correo no tiene un formato válido.';
  if (vacio(clave) || String(clave).length < 6) {
    errores.clave = 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (confirmar !== clave) errores.confirmar = 'Las contraseñas no coinciden.';
  return errores;
}

export function validarContacto({ nombre, correo, asunto, mensaje }) {
  const errores = {};
  if (vacio(nombre)) errores.nombre = 'Ingresa tu nombre.';
  if (vacio(correo)) errores.correo = 'Ingresa tu correo.';
  else if (!esCorreoValido(correo)) errores.correo = 'El correo no tiene un formato válido.';
  if (vacio(asunto)) errores.asunto = 'Ingresa un asunto.';
  if (vacio(mensaje) || String(mensaje).trim().length < 10) {
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  }
  return errores;
}

export function validarCheckout(valores) {
  const errores = {};
  if (vacio(valores.nombre)) errores.nombre = 'Ingresa tu nombre.';
  if (vacio(valores.apellido)) errores.apellido = 'Ingresa tu apellido.';
  if (vacio(valores.correo)) errores.correo = 'Ingresa tu correo.';
  else if (!esCorreoValido(valores.correo)) errores.correo = 'El correo no tiene un formato válido.';
  if (vacio(valores.telefono)) errores.telefono = 'Ingresa un teléfono de contacto.';
  else if (!RE_TELEFONO.test(String(valores.telefono).trim())) {
    errores.telefono = 'El teléfono debe tener entre 8 y 15 dígitos.';
  }
  if (vacio(valores.calle)) errores.calle = 'Ingresa la calle.';
  if (vacio(valores.numero)) errores.numero = 'Ingresa el número.';
  if (vacio(valores.region)) errores.region = 'Selecciona una región.';
  if (vacio(valores.comuna)) errores.comuna = 'Selecciona una comuna.';
  if (vacio(valores.entrega)) errores.entrega = 'Selecciona la forma de entrega.';
  return errores;
}

// Validación de un producto del administrador (se usará en el panel).
export function validarProducto({ codigo, nombre, categoria, precio, stock, oferta, precioOferta }) {
  const errores = {};
  if (vacio(codigo)) errores.codigo = 'El código es obligatorio.';
  if (vacio(nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (vacio(categoria)) errores.categoria = 'Selecciona o escribe una categoría.';
  if (vacio(precio) || !Number.isFinite(Number(precio)) || Number(precio) < 0) {
    errores.precio = 'El precio debe ser un número mayor o igual a 0.';
  }
  if (vacio(stock) || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    errores.stock = 'El stock debe ser un entero mayor o igual a 0.';
  }
  if (oferta) {
    const valor = Number(precioOferta);
    if (vacio(precioOferta) || !Number.isFinite(valor) || valor <= 0) {
      errores.precioOferta = 'Ingresa el precio de oferta.';
    } else if (Number.isFinite(Number(precio)) && valor >= Number(precio)) {
      errores.precioOferta = 'El precio de oferta debe ser menor al precio normal.';
    }
  }
  return errores;
}

// Perfil: cambio de contraseña.
export function validarCambioClave({ actual, nueva, confirmar }) {
  const errores = {};
  if (vacio(actual)) errores.actual = 'Ingresa tu contraseña actual.';
  if (vacio(nueva) || String(nueva).length < 6) {
    errores.nueva = 'La nueva contraseña debe tener al menos 6 caracteres.';
  }
  if (confirmar !== nueva) errores.confirmar = 'Las contraseñas no coinciden.';
  return errores;
}

// Admin: crear o editar una categoría.
export function validarCategoria(nombre, existentes = []) {
  const limpio = String(nombre || '').trim();
  if (limpio.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
  if (existentes.some((c) => c.toLowerCase() === limpio.toLowerCase())) {
    return 'Ya existe una categoría con ese nombre.';
  }
  return '';
}
