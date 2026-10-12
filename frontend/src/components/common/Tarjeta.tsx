import type { HTMLAttributes, ReactNode } from 'react';

interface TarjetaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Tarjeta({ children, className = '', ...props }: TarjetaProps) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
