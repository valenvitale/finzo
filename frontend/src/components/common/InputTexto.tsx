import { useId, type InputHTMLAttributes } from 'react';

interface InputTextoProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  textoAyuda?: string;
  error?: string;
}

export function InputTexto({
  label,
  textoAyuda,
  error,
  id,
  className = '',
  ...props
}: InputTextoProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = textoAyuda ? `${inputId}-ayuda` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...props}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
      />
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
