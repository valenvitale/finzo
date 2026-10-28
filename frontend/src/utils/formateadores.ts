// Formato de moneda con código ISO (por defecto ARS)
export function formatearMonto(monto: number, codigoMoneda = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: codigoMoneda,
    minimumFractionDigits: 2,
  }).format(monto);
}

// Formato de fecha legible
export function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fecha);
}
