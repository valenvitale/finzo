export type EstadoPresupuesto = 'verde' | 'amarillo' | 'rojo';

export function obtenerEstadoPresupuesto(porcentajeUsado: number): EstadoPresupuesto {
  if (porcentajeUsado > 90) return 'rojo';
  if (porcentajeUsado >= 75) return 'amarillo';
  return 'verde';
}

export function formatearMonto(monto: number, codigoMoneda: string): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: codigoMoneda,
    maximumFractionDigits: 2,
  }).format(monto);
}
