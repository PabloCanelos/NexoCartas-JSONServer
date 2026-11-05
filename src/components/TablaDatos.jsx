// Tabla genérica para el panel de administración.
// columnas: [{ clave, titulo, render?(fila), clase? }]  filas: lista de objetos
// claveFila: nombre del campo único de cada fila (por ejemplo "id").
// Si no hay filas, muestra un mensaje (renderizado condicional).
export default function TablaDatos({ columnas, filas, claveFila, mensajeVacio = 'No hay registros.' }) {
  if (filas.length === 0) {
    return (
      <div className="alert alert-info" role="status">
        {mensajeVacio}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} scope="col" className={columna.clase}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila[claveFila]}>
              {columnas.map((columna) => (
                <td key={columna.clave} className={columna.clase}>
                  {columna.render ? columna.render(fila) : fila[columna.clave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
