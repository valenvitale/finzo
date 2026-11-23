import axios from 'axios';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Check, Coins, Plus, Star, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Boton, Cargando, InputTexto, MensajeError, Selector, toast } from '../components/common';
import GestionMediosPago from '../components/medios-pago/GestionMediosPago';
import { useApi } from '../hooks/useApi';
import {
  asignarMonedaPerfil,
  eliminarMonedaPerfil,
  listarMonedasDisponibles,
  listarMonedasPerfil,
} from '../services/moneda.service';
import { actualizarPerfil } from '../services/perfil.service';
import type { ApiResponse } from '../types/api.types';
import type { MonedaPerfilResponseDTO, MonedaResponseDTO } from '../types/moneda.types';
import type { ActualizarPerfilDTO, ContextoPerfil, PerfilResponseDTO } from '../types/perfil.types';

interface MonedasData {
  disponibles: MonedaResponseDTO[];
  asignadas: MonedaPerfilResponseDTO[];
}

function mensajeDeError(error: unknown, alternativo: string): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    const mensaje = error.response?.data?.mensaje;
    if (typeof mensaje === 'string') return mensaje;
  }
  return error instanceof Error ? error.message : alternativo;
}

function FormularioPerfil({
  perfil,
  alActualizar,
}: {
  perfil: PerfilResponseDTO;
  alActualizar: (perfil: PerfilResponseDTO) => void;
}) {
  const [nombre, setNombre] = useState(perfil.nombre);
  const [apellido, setApellido] = useState(perfil.apellido);
  const [email, setEmail] = useState(perfil.email);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const hayCambiosPerfil =
    nombre.trim() !== perfil.nombre ||
    apellido.trim() !== perfil.apellido ||
    email.trim() !== perfil.email ||
    contrasenaNueva.length > 0;

  async function guardarPerfil(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (guardandoPerfil) return;

    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const emailLimpio = email.trim();

    if (!nombreLimpio || !apellidoLimpio) {
      toast.error('El nombre y el apellido son obligatorios.');
      return;
    }
    if (nombreLimpio.length > 30 || apellidoLimpio.length > 30) {
      toast.error('El nombre y el apellido no pueden superar los 30 caracteres.');
      return;
    }

    const emailCambio = emailLimpio !== perfil.email;
    const cambiaContrasena = contrasenaNueva.length > 0;
    if (cambiaContrasena && contrasenaNueva.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if ((emailCambio || cambiaContrasena) && !contrasenaActual) {
      toast.error('Ingresá tu contraseña actual para cambiar el correo o la contraseña.');
      return;
    }

    const datos: ActualizarPerfilDTO = {};
    if (nombreLimpio !== perfil.nombre) datos.nombre = nombreLimpio;
    if (apellidoLimpio !== perfil.apellido) datos.apellido = apellidoLimpio;
    if (emailCambio) datos.email = emailLimpio;
    if (emailCambio || cambiaContrasena) {
      datos.currentPassword = contrasenaActual;
      if (cambiaContrasena) datos.newPassword = contrasenaNueva;
    }
    if (Object.keys(datos).length === 0) return;

    setGuardandoPerfil(true);
    try {
      const actualizado = await actualizarPerfil(datos);
      alActualizar(actualizado);
      setNombre(actualizado.nombre);
      setApellido(actualizado.apellido);
      setEmail(actualizado.email);
      setContrasenaActual('');
      setContrasenaNueva('');
      toast.success('Tu perfil se actualizó correctamente.');
    } catch (error) {
      toast.error(mensajeDeError(error, 'No se pudo actualizar tu perfil.'));
    } finally {
      setGuardandoPerfil(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-oliva">Datos personales</h2>
        <p className="mt-1 text-sm text-slate-500">
          Actualizá tu información de acceso y perfil.
        </p>
      </div>
      <form onSubmit={guardarPerfil} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputTexto
            label="Nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            maxLength={30}
            required
            disabled={guardandoPerfil}
            autoComplete="given-name"
          />
          <InputTexto
            label="Apellido"
            value={apellido}
            onChange={(event) => setApellido(event.target.value)}
            maxLength={30}
            required
            disabled={guardandoPerfil}
            autoComplete="family-name"
          />
        </div>
        <InputTexto
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={guardandoPerfil}
          autoComplete="email"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputTexto
            label="Contraseña actual"
            type="password"
            value={contrasenaActual}
            onChange={(event) => setContrasenaActual(event.target.value)}
            disabled={guardandoPerfil}
            autoComplete="current-password"
            textoAyuda="Requerida para cambiar el correo o la contraseña."
          />
          <InputTexto
            label="Nueva contraseña"
            type="password"
            value={contrasenaNueva}
            onChange={(event) => setContrasenaNueva(event.target.value)}
            minLength={8}
            disabled={guardandoPerfil}
            autoComplete="new-password"
            textoAyuda="Dejala vacía si no querés cambiarla."
          />
        </div>
        <div className="flex justify-end">
          <Boton type="submit" cargando={guardandoPerfil} disabled={!hayCambiosPerfil}>
            Guardar cambios
          </Boton>
        </div>
      </form>
    </section>
  );
}

export default function Perfil() {
  const [monedaSeleccionada, setMonedaSeleccionada] = useState('');
  const [guardandoMoneda, setGuardandoMoneda] = useState(false);

  const { perfil, cargando, error, cargar, actualizarPerfilLocal } = useOutletContext<ContextoPerfil>();
  const cargarMonedas = useCallback(async (): Promise<MonedasData> => {
    const [disponibles, asignadas] = await Promise.all([
      listarMonedasDisponibles(),
      listarMonedasPerfil(),
    ]);
    return { disponibles, asignadas };
  }, []);
  const monedasApi = useApi(cargarMonedas);
  const { ejecutar: ejecutarMonedas } = monedasApi;

  useEffect(() => {
    void ejecutarMonedas().catch(() => undefined);
  }, [ejecutarMonedas]);

  const monedas = monedasApi.data;
  const monedasAsignadas = monedas?.asignadas ?? [];
  const monedasDisponibles = (monedas?.disponibles ?? []).filter(
    (moneda) => !monedasAsignadas.some((asignada) => asignada.id === moneda.id)
  );

  async function recargarPerfil() {
    try {
      await cargar();
    } catch {
      // El hook conserva el error para mostrarlo en la vista.
    }
  }

  async function recargarMonedas() {
    try {
      await monedasApi.refetch();
    } catch {
      // El hook conserva el error para mostrarlo en la vista.
    }
  }

  async function manejarAsignacion(monedaId: string, esPrincipal = false) {
    if (guardandoMoneda) return;
    setGuardandoMoneda(true);
    try {
      await asignarMonedaPerfil({
        monedaId,
        ...(esPrincipal ? { esPrincipal: true } : {}),
      });
      setMonedaSeleccionada('');
      toast.success(
        esPrincipal ? 'Se actualizó la moneda principal.' : 'Moneda agregada a tu perfil.'
      );
      await recargarMonedas();
    } catch (error) {
      toast.error(mensajeDeError(error, 'No se pudo actualizar la moneda.'));
    } finally {
      setGuardandoMoneda(false);
    }
  }

  async function manejarEliminacion(moneda: MonedaPerfilResponseDTO) {
    if (guardandoMoneda) return;
    if (!window.confirm(`¿Querés quitar ${moneda.nombre} de tu perfil?`)) return;

    setGuardandoMoneda(true);
    try {
      await eliminarMonedaPerfil(moneda.id);
      toast.success('Moneda quitada de tu perfil.');
      await recargarMonedas();
    } catch (error) {
      toast.error(mensajeDeError(error, 'No se pudo quitar la moneda.'));
    } finally {
      setGuardandoMoneda(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-oliva sm:text-3xl">Perfil</h1>
        <p className="text-sm text-slate-500">
          Gestioná tus datos personales, monedas y medios de pago.
        </p>
      </header>

      {error !== null && (
        <MensajeError
          titulo="No se pudo cargar el perfil"
          mensaje={mensajeDeError(error, 'Intentalo de nuevo.')}
        />
      )}

      {cargando && !perfil ? (
        <Cargando etiqueta="Cargando perfil..." />
      ) : perfil ? (
        <FormularioPerfil key={perfil.id} perfil={perfil} alActualizar={actualizarPerfilLocal} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Boton variante="secondary" onClick={() => void recargarPerfil()}>
            Reintentar carga del perfil
          </Boton>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-oliva">
            <Coins size={20} aria-hidden="true" /> Mis monedas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Elegí las monedas que usás y definí cuál querés como principal.
          </p>
        </div>

        {monedasApi.error !== null && (
          <div className="mb-4 space-y-3">
            <MensajeError
              titulo="No se pudieron cargar las monedas"
              mensaje={mensajeDeError(monedasApi.error, 'Intentalo de nuevo.')}
            />
            <Boton variante="secondary" onClick={() => void recargarMonedas()}>
              Reintentar carga de monedas
            </Boton>
          </div>
        )}

        {monedasApi.loading && !monedas ? (
          <Cargando etiqueta="Cargando monedas..." />
        ) : monedas ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <Selector
                  label="Agregar moneda"
                  value={monedaSeleccionada}
                  onChange={(event) => setMonedaSeleccionada(event.target.value)}
                  disabled={guardandoMoneda || monedasDisponibles.length === 0}
                >
                  <option value="">Seleccioná una moneda</option>
                  {monedasDisponibles.map((moneda) => (
                    <option key={moneda.id} value={moneda.id}>
                      {moneda.codigo} - {moneda.nombre} ({moneda.simbolo})
                    </option>
                  ))}
                </Selector>
              </div>
              <Boton
                disabled={!monedaSeleccionada || guardandoMoneda}
                cargando={guardandoMoneda}
                onClick={() => void manejarAsignacion(monedaSeleccionada)}
              >
                <Plus size={17} aria-hidden="true" /> Agregar moneda
              </Boton>
            </div>

            {monedasDisponibles.length === 0 && (
              <p className="text-sm text-slate-500">
                Ya agregaste todas las monedas disponibles.
              </p>
            )}

            {monedasAsignadas.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                Todavía no agregaste monedas a tu perfil.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {monedasAsignadas.map((moneda) => (
                  <li
                    key={moneda.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      moneda.esPrincipal
                        ? 'border-naranja/40 bg-naranja-claro/40'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-oliva">
                          {moneda.codigo} <span className="text-slate-500">({moneda.simbolo})</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{moneda.nombre}</p>
                      </div>
                      {moneda.esPrincipal && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-naranja px-2.5 py-1 text-xs font-medium text-white">
                          <Star size={12} fill="currentColor" aria-hidden="true" />
                          Principal
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      {!moneda.esPrincipal && (
                        <Boton
                          variante="secondary"
                          tamanio="sm"
                          disabled={guardandoMoneda}
                          onClick={() => void manejarAsignacion(moneda.id, true)}
                        >
                          <Check size={14} aria-hidden="true" /> Definir como principal
                        </Boton>
                      )}
                      <Boton
                        variante="ghost"
                        tamanio="sm"
                        className="hover:bg-gasto-fondo hover:text-gasto"
                        disabled={guardandoMoneda}
                        onClick={() => void manejarEliminacion(moneda)}
                      >
                        <Trash2 size={14} aria-hidden="true" /> Quitar
                      </Boton>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </section>

      <GestionMediosPago />
    </div>
  );
}
