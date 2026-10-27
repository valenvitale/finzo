import { useId, type SelectHTMLAttributes } from 'react';

interface SelectorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  textoAyuda?: string;
  error?: string;
}

export function Selector({
  label,
  textoAyuda,
  error,
  id,
  className = '',
  children,
  ...props
}: SelectorProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const helperId = textoAyuda ? `${selectId}-ayuda` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        {...props}
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-naranja focus:ring-2 focus:ring-naranja/20 disabled:cursor-not-allowed disabled:bg-slate-100 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
      >
        {children}
      </select>
      {textoAyuda && (
        <p id={helperId} className="text-sm text-slate-500">
          {textoAyuda}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
