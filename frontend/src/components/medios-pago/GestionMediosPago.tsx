import { useState } from 'react';
import { Banknote, Landmark, CreditCard, LockKeyhole, Pencil, Plus, Trash2 } from 'lucide-react';
import { Boton } from '../common/Boton';
import type { SubmitEvent } from 'react';
import { useMediosPago } from '../../hooks/useMediosPago';
import type { MedioPago } from '../../types/medio-pago.types';

function IconoMedioPago({ nombre }: { nombre: string }) {
  switch (nombre) {
    case 'banknote':
      return <Banknote size={20} aria-hidden="true" />;
    case 'credit-card':
      return <CreditCard size={20} aria-hidden="true" />;
    case 'landmark':
      return <Landmark size={20} aria-hidden="true" />;
    default:
      return <span className="max-w-full truncate text-lg" aria-hidden="true">{nombre}</span>;
  }
}

export default function GestionMediosPago() {
  const {
    mediosPago,
    cargando,
    error,
    guardando,
    crear,
    actualizar,
    eliminar,
  } = useMediosPago();

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState('');
  const [idEditando, setIdEditando] = useState<string | null>(null);

  const mediosPropios = mediosPago.filter(
    (medio) => medio.id_perfil !== null
  );

  function cancelarEdicion() {
    setFormularioAbierto(false);
    setIdEditando(null);
    setNombre('');
    setIcono('');
  }

  function iniciarEdicion(medio: MedioPago) {
    setFormularioAbierto(true);
    setIdEditando(medio.id);
    setNombre(medio.nombre);
    setIcono(medio.icono);
  }

  async function manejarEnvio(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (guardando) return;

    try {
      const datos = {
        nombre: nombre.trim(),
        icono: icono.trim(),
      };

      if (idEditando !== null) {
        await actualizar(idEditando, datos);
      } else {
        await crear(datos);
      }

      cancelarEdicion();
    } catch {
      // El hook guarda el error y la vista lo muestra.
    }
  }

  async function manejarEliminar(medio: MedioPago) {
    if (guardando) return;

    const confirmado = window.confirm(
      `¿Querés eliminar el medio de pago "${medio.nombre}"?`
    );

    if (!confirmado) return;

    try {
      await eliminar(medio.id);

      if (idEditando === medio.id) {
        cancelarEdicion();
      }
    } catch {
      // El hook guarda el error y la vista lo muestra.
    }
  }

  if (cargando) {
    return <p>Cargando medios de pago...</p>;
  }

  const mediosSistema = mediosPago.filter((medio) => medio.id_perfil === null);
  const campoClase = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-naranja focus:ring-2 focus:ring-naranja/20 disabled:opacity-60';

  return (
    <div className="space-y-7">
      {error && (
        <p role="alert" className="rounded-xl border border-gasto-borde bg-gasto-fondo px-4 py-3 text-sm text-gasto">{error}</p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-oliva">Medios de pago del sistema</h2>
            <p className="mt-1 text-sm text-slate-500">Listos para usar en tus movimientos.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-oliva-claro px-3 py-1 text-xs font-medium text-oliva">
            <LockKeyhole size={13} aria-hidden="true" /> Solo lectura
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mediosSistema.map((medio) => (
            <li key={medio.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-oliva-claro text-oliva"><IconoMedioPago nombre={medio.icono} /></span>
              <span className="break-words text-sm font-medium text-oliva">{medio.nombre}</span>
            </li>
          ))}
        </ul>
        {mediosSistema.length === 0 && <p className="text-sm text-slate-500">No hay medios de pago del sistema disponibles.</p>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-oliva">
              <CreditCard size={20} aria-hidden="true" /> Mis medios de pago
            </h2>
            <p className="mt-1 text-sm text-slate-500">Creá y administrá tus medios de pago personalizados.</p>
          </div>
          <Boton disabled={guardando} onClick={() => { cancelarEdicion(); setFormularioAbierto(true); }}>
            <Plus size={17} aria-hidden="true" /> Nuevo medio de pago
          </Boton>
        </div>

        {formularioAbierto && (
          <form onSubmit={manejarEnvio} className="mb-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <h3 className="font-semibold text-oliva">{idEditando !== null ? 'Editar medio de pago' : 'Nuevo medio de pago'}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="medio-nombre" className="text-sm font-medium text-slate-700">Nombre</label>
                <input id="medio-nombre" className={campoClase} value={nombre} onChange={(event) => setNombre(event.target.value)} maxLength={40} required disabled={guardando} placeholder="Por ejemplo: Mi tarjeta" />
              </div>
              <div>
                <label htmlFor="medio-icono" className="text-sm font-medium text-slate-700">Ícono</label>
                <input id="medio-icono" className={campoClase} value={icono} onChange={(event) => setIcono(event.target.value)} maxLength={20} required disabled={guardando} placeholder="Por ejemplo: credit-card" />
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Boton variante="secondary" disabled={guardando} onClick={cancelarEdicion}>Cancelar</Boton>
              <Boton type="submit" disabled={guardando || !nombre.trim() || !icono.trim()}>
                {guardando ? 'Guardando...' : idEditando !== null ? 'Guardar cambios' : 'Crear medio de pago'}
              </Boton>
            </div>
          </form>
        )}

        {mediosPropios.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-oliva/20 bg-oliva-claro/50 px-5 py-9 text-center">
            <span className="mb-1 rounded-full bg-white p-3 text-oliva"><CreditCard size={24} aria-hidden="true" /></span>
            <p className="text-sm font-medium text-oliva">Todavía no tenés medios de pago propios</p>
            <p className="max-w-sm text-sm text-slate-500">Los medios de pago que agregues aparecerén acá.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {mediosPropios.map((medio) => (
              <li key={medio.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-oliva/30 hover:bg-oliva-claro/60">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-naranja-claro"><IconoMedioPago nombre={medio.icono} /></span>
                  <span className="break-words text-sm font-medium text-oliva">{medio.nombre}</span>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <Boton variante="ghost" tamanio="sm" disabled={guardando} onClick={() => iniciarEdicion(medio)}>
                    <Pencil size={14} aria-hidden="true" /> Editar
                  </Boton>
                  <Boton variante="ghost" tamanio="sm" className="hover:bg-gasto-fondo hover:text-gasto" disabled={guardando} onClick={() => void manejarEliminar(medio)}>
                    <Trash2 size={14} aria-hidden="true" /> Eliminar
                  </Boton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
