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

export function obtenerFechaActual(): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const { year, month, day } = Object.fromEntries(
    partes.map(({ type, value }) => [type, value])
  );

  return `${year}-${month}-${day}`;
}