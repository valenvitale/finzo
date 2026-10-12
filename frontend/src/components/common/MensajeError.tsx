interface MensajeErrorProps {
  mensaje: string;
  titulo?: string;
}

export function MensajeError({ mensaje, titulo = 'Ocurrió un error' }: MensajeErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
    >
      <p className="font-semibold">{titulo}</p>
      <p className="mt-1 text-sm">{mensaje}</p>
    </div>
  );
}
