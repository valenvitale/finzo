export function formatearNumero(
  valor: number,
  locale = 'es-AR',
  opciones: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, opciones).format(valor);
}

export function formatearPorcentaje(
  valor: number,
  locale = 'es-AR',
  opciones: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    ...opciones,
  }).format(valor);
}
