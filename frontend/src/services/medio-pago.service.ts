import { supabase } from './supabase';
import type { MedioPago } from '../types/medio-pago.types';

type RespuestaCatalogo =
  | { exito: true; datos: MedioPago[] }
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
