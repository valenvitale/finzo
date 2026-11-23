export function formatearMoneda(
  monto: number,
  codigoMoneda = 'ARS',
  locale = 'es-AR',
  opciones: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: codigoMoneda,
    ...opciones,
  }).format(monto);
}
