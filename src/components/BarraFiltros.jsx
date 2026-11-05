// Formulario de búsqueda y filtro. Es un componente "controlado":
// los valores viven en el padre (Catalogo) y llegan por props.
export default function BarraFiltros({ busqueda, onBusqueda, categoria, onCategoria, categorias }) {
  return (
    <div className="row g-2 mb-4">
      <div className="col-12 col-md-8">
        <label htmlFor="buscador" className="form-label visually-hidden">
          Buscar carta
        </label>
        <input
          id="buscador"
          type="search"
          className="form-control"
          placeholder="Buscar por nombre o código"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-4">
        <label htmlFor="categoria" className="form-label visually-hidden">
          Categoría
        </label>
        <select
          id="categoria"
          className="form-select"
          value={categoria}
          onChange={(e) => onCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
