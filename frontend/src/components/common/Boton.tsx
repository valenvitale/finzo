import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type VarianteBoton = 'primary' | 'secondary' | 'danger' | 'ghost';
export type TamanioBoton = 'sm' | 'md' | 'lg' | 'icon';

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variante?: VarianteBoton;
  tamanio?: TamanioBoton;
  cargando?: boolean;
}

const variantes: Record<VarianteBoton, string> = {
  primary: 'bg-naranja text-white hover:bg-naranja-hover focus-visible:ring-naranja',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-naranja',
  danger: 'bg-gasto text-white hover:bg-red-700 focus-visible:ring-gasto',
  ghost:
    'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-naranja',
};

const tamanios: Record<TamanioBoton, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  icon: 'p-1.5',
};

export function Boton({
  children,
  variante = 'primary',
  tamanio = 'md',
  cargando = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}: BotonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantes[variante]} ${tamanios[tamanio]} ${className}`}
    >
      {cargando && (
        <>
          <svg
            aria-hidden="true"
            className="size-4 animate-spin"
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
          <span className="sr-only">Cargando</span>
        </>
      )}
      {children}
    </button>
  );
}
