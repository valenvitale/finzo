import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../common';
import Sidebar from './Sidebar';

export default function Header({ nombrePerfil }: { nombrePerfil?: string }) {
  const { user, logout } = useAuth();
  const navegacionRef = useRef<HTMLDialogElement>(null);
  const cuentaRef = useRef<HTMLDivElement>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const nombreUsuario: unknown = user?.user_metadata?.nombre;
  const nombre = nombrePerfil?.trim()
    || (typeof nombreUsuario === 'string' && nombreUsuario.trim())
    || 'Usuario';
  const iniciales = nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => Array.from(palabra)[0])
    .join('')
    .toLocaleUpperCase('es');

  async function cerrarSesion() {
    setCerrandoSesion(true);
    try {
      await logout();
    } catch {
      toast.error('No se pudo cerrar sesión. Intentá de nuevo.');
    } finally {
      setCerrandoSesion(false);
    }
  }

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Abrir menú de navegación"
          aria-haspopup="dialog"
          aria-controls="menu-navegacion"
          aria-expanded={menuAbierto}
          onClick={() => {
            navegacionRef.current?.showModal();
            setMenuAbierto(true);
          }}
          className="grid size-11 cursor-pointer place-items-center rounded-lg text-oliva transition-colors hover:bg-oliva-claro focus-visible:outline-2 focus-visible:outline-oliva"
        >
          <Menu size={22} aria-hidden="true" />
        </button>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md pr-2 text-xl font-bold tracking-tight text-oliva focus-visible:outline-2 focus-visible:outline-oliva"
        >
          <span className="relative size-8 overflow-hidden">
            <img
              src="/images/finzo-logo.png"
              alt=""
              className="absolute top-1/2 left-1/2 size-12 max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </span>
          Finzo
        </Link>
      </div>

      <button
        type="button"
        aria-label={`Cuenta de ${nombre}`}
        popoverTarget="menu-cuenta"
        className="grid size-11 cursor-pointer place-items-center rounded-full bg-oliva-claro text-sm font-semibold text-oliva ring-1 ring-oliva/10 transition-colors hover:bg-oliva/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oliva"
      >
        <span aria-hidden="true">{iniciales}</span>
      </button>

      <div
        ref={cuentaRef}
        id="menu-cuenta"
        popover="auto"
        className="fixed inset-[3.5rem_1rem_auto_auto] m-0 w-56 max-w-[calc(100%-2rem)] rounded-xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-lg sm:right-6 lg:right-8"
      >
        <p className="break-words border-b border-slate-100 px-3 py-2 text-sm font-semibold">
          {nombre}
        </p>
        <Link
          to="/perfil"
          onClick={() => cuentaRef.current?.hidePopover()}
          className="mt-1 flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-oliva-claro hover:text-oliva focus-visible:outline-2 focus-visible:outline-oliva"
        >
          <UserRound size={17} aria-hidden="true" />
          Perfil
        </Link>
        <button
          type="button"
          onClick={() => void cerrarSesion()}
          disabled={cerrandoSesion}
          className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-gasto transition-colors hover:bg-gasto-fondo focus-visible:outline-2 focus-visible:outline-gasto disabled:cursor-wait disabled:opacity-60"
        >
          <LogOut size={17} aria-hidden="true" />
          {cerrandoSesion ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
      </div>

      <Sidebar ref={navegacionRef} onClose={() => setMenuAbierto(false)} />
    </header>
  );
}
