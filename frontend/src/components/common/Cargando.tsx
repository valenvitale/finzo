interface CargandoProps {
  etiqueta?: string;
  className?: string;
}

export function Cargando({ etiqueta = 'Cargando...', className = '' }: CargandoProps) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 py-8 text-slate-600 ${className}`}>
      <svg
        aria-hidden="true"
        className="size-5 animate-spin text-naranja"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{etiqueta}</span>
    </div>
  );
}
