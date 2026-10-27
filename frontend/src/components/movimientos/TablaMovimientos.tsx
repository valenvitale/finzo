/** 
 * Tabla/listado visual de movimientos con:
 *  - montos en verde/rojo 
 *  - icono de categoría/tipo
 *  - fecha formateada
 *  - botones de acción rápida.
 */
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import type { MovimientoResponseDTO } from '../../types/movimiento.types';
import { Tarjeta, EstadoVacio } from '../common';
import { formatearMonto, formatearFecha } from '../../utils/formateadores';

interface TablaMovimientosProps {
  movimientos: MovimientoResponseDTO[];
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export function TablaMovimientos({ 
  movimientos, 
  onEditar, 
  onEliminar, 
}: TablaMovimientosProps) {
  if (movimientos.length === 0) {
    return (
      <EstadoVacio 
        titulo="No hay movimientos registrados" 
        descripcion="Agregá tus primeros movimientos y empezá a llevar el control de tus finanzas" 
      />
    );
  }

  return (
    <Tarjeta className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3">Concepto</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3 text-right">Monto</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movimientos.map((mov) => {
              const esIngreso = mov.tipo === 'INGRESO';

              return (
                <tr key={mov.id} className="transition-colors hover:bg-slate-50/75">
                  {/* Concepto con icono */}
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          esIngreso ? 'bg-ingreso-fondo text-ingreso' : 'bg-gasto-fondo text-gasto'
                        }`}
                      >
                        {esIngreso ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownLeft className="size-4" />
                        )}
                      </div>
                      <p className="font-semibold">{mov.descripcion || 'Sin descripción'}</p>
                    </div>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-slate-500">
                    {formatearFecha(mov.fecha)}
                  </td>

                  {/* Badge de Tipo */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        esIngreso
                          ? 'border border-emerald-200 bg-ingreso-fondo text-ingreso'
                          : 'border border-rose-200 bg-gasto-fondo text-gasto'
                      }`}
                    >
                      {esIngreso ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>

                  {/* Monto verde / rojo */}
                  <td
                    className={`px-6 py-4 text-right font-semibold tabular-nums ${
                      esIngreso ? 'text-ingreso' : 'text-gasto'
                    }`}
                  >
                    {esIngreso ? `+ ${formatearMonto(mov.monto)}` : `- ${formatearMonto(mov.monto)}`}
                  </td>

                  {/* Acciones rapidas */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditar(mov.id)}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-naranja-claro hover:text-naranja"
                        title="Editar movimiento"
                        aria-label="Editar movimiento"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEliminar(mov.id)}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-gasto-fondo hover:text-gasto"
                        title="Eliminar movimiento"
                        aria-label="Eliminar movimiento"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Tarjeta>
  );
}