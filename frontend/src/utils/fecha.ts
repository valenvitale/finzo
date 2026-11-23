export function formatearFecha(
  fecha: string | Date,
  locale = 'es-AR',
  opciones: Intl.DateTimeFormatOptions = {}
): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opciones,
  }).format(new Date(fecha));
}
