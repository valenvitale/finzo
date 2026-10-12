import { useEffect, useId, useRef, type ReactNode } from 'react';

interface ModalProps {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
  etiquetaCerrar?: string;
}

export function Modal({
  abierto,
  titulo,
  onCerrar,
  children,
  etiquetaCerrar = 'Cerrar',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (abierto && !dialog.open) {
      dialog.showModal();
    } else if (!abierto && dialog.open) {
      dialog.close();
    }
  }, [abierto]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onCerrar();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCerrar();
      }}
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <h2 id={titleId} className="text-lg font-semibold">
          {titulo}
        </h2>
        <button
          type="button"
          aria-label={etiquetaCerrar}
          onClick={onCerrar}
          className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}
