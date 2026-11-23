import { supabase } from './supabase';
import type { MedioPago, CrearMedioPagoDTO, ActualizarMedioPagoDTO } from '../types/medio-pago.types';

type RespuestaCatalogo =
  | { exito: true; datos: MedioPago[] }
  | { exito: false; mensaje: string };

type RespuestaMedioPago =
  | { exito: true; datos: MedioPago }
  | { exito: false; mensaje: string };

export async function listarMediosPago(): Promise<MedioPago[]> {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('Falta configurar VITE_API_URL en el frontend.');
  }

  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  if (!session?.access_token) {
    throw new Error('Debes iniciar sesión para consultar los medios de pago.');
  }

  const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/medios-pago`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      Accept: 'application/json',
    },
  });

  const resultado: RespuestaCatalogo | null = await response.json().catch(() => null);
  if (!response.ok || !resultado?.exito) {
    const mensaje = resultado?.exito === false ? resultado.mensaje : undefined;
    throw new Error(mensaje || `No se pudieron obtener los medios de pago (HTTP ${response.status}).`);
  }

  return resultado.datos;
}

export async function crearMedioPago(datos: CrearMedioPagoDTO): Promise<MedioPago>{
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('Falta configurar VITE_API_URL en el frontend.');
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error('Debes iniciar sesión para crear un medio de pago.');
  }

  const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/medios-pago`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  const resultado: RespuestaMedioPago | null =
  await response.json().catch(() => null);
  if (!response.ok || !resultado?.exito) {
    const mensaje = resultado?.exito === false ? resultado.mensaje : undefined;
    throw new Error(mensaje || `No se pudo crear el medio de pago (HTTP ${response.status}).`);
  }

  return resultado.datos;
}

export async function actualizarMedioPago(id: string, datos: ActualizarMedioPagoDTO): Promise<MedioPago> {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('Falta configurar VITE_API_URL en el frontend.');
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error('Debes iniciar sesión para actualizar un medio de pago.');
  }

  const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/medios-pago/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  const resultado: RespuestaMedioPago | null =
  await response.json().catch(() => null);
  if (!response.ok || !resultado?.exito) {
    const mensaje = resultado?.exito === false ? resultado.mensaje : undefined;
    throw new Error(mensaje || `No se pudo actualizar el medio de pago (HTTP ${response.status}).`);
  }

  return resultado.datos;
}

export async function eliminarMedioPago(id: string): Promise<void> {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('Falta configurar VITE_API_URL en el frontend.');
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error('Debes iniciar sesión para eliminar un medio de pago.');
  }

  const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/medios-pago/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const resultado: { exito: false; mensaje: string } | null =
    await response.json().catch(() => null);
    throw new Error(resultado?.mensaje || 'No se pudo eliminar el medio de pago.')
  }
}