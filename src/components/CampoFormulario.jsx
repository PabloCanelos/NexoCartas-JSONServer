// Campo de formulario reutilizable: etiqueta + control + mensaje de error.
// as="input" (por defecto), "select" o "textarea". El resto de props (name,
// value, onChange, type...) pasan directo al control.
export default function CampoFormulario({
  id,
  label,
  error,
  as: Control = 'input',
  children,
  className = '',
  ...resto
}) {
  const clase = (Control === 'select' ? 'form-select' : 'form-control') + (error ? ' is-invalid' : '');
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <Control
        id={id}
        className={clase}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...resto}
      >
        {children}
      </Control>
      {error && (
        <div id={`${id}-error`} className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
}
