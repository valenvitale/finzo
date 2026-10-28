import type { HTMLAttributes, ReactNode } from 'react';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  titulo?: string;
  descripcion?: string;
  acciones?: ReactNode;
}

export function PageContainer({
  children,
  titulo,
  descripcion,
  acciones,
  className = '',
  ...props
}: PageContainerProps) {
  return (
    <main {...props} className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
      {(titulo || acciones) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {titulo && <h1 className="text-2xl font-bold tracking-tight text-slate-900">{titulo}</h1>}
            {descripcion && <p className="mt-1 text-sm text-slate-500">{descripcion}</p>}
          </div>
          {acciones && <div className="flex items-center gap-3">{acciones}</div>}
        </div>
      )}
      {children}
    </main>
  );
}

