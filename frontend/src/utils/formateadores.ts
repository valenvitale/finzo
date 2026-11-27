import { formatearMoneda } from './moneda';
import { formatearFecha as formatearFechaIntl } from './fecha';

export function formatearMonto(monto: number, codigoMoneda = 'ARS'): string {
  return formatearMoneda(monto, codigoMoneda, 'es-AR', {
    minimumFractionDigits: 2,
  });
}

export const formatearFecha = formatearFechaIntl;
