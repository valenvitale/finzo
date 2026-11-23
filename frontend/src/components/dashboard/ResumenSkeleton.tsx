import { Tarjeta } from '../common/Tarjeta';

export function ResumenSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Tarjeta key={index}>
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              {/* Simula el título */}
              <div className="h-4 w-24 rounded bg-slate-200" />

              {/* Simula el ícono */}
              <div className="h-6 w-6 rounded bg-slate-200" />
            </div>

            {/* Simula el importe */}
            <div className="mt-4 h-8 w-32 rounded bg-slate-200" />
          </div>
        </Tarjeta>
      ))}
    </div>
  );
}
