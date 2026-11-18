import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useApi } from './useApi';

describe('useApi', () => {
  it('ejecuta operaciones y permite repetir la última consulta', async () => {
    const consultar = vi.fn(async (id: string) => `registro-${id}`);
    const { result } = renderHook(() => useApi(consultar));

    await act(async () => {
      await result.current.ejecutar('42');
    });
    await act(async () => {
      await result.current.refetch();
    });

    expect(consultar).toHaveBeenCalledTimes(2);
    expect(consultar).toHaveBeenNthCalledWith(1, '42');
    expect(consultar).toHaveBeenNthCalledWith(2, '42');
    expect(result.current.data).toBe('registro-42');
  });

  it('guarda y vuelve a propagar los errores de ejecución manual', async () => {
    const fallo = new Error('No se pudo consultar');
    const consultar = vi.fn(async () => {
      throw fallo;
    });
    const { result } = renderHook(() => useApi(consultar));
    let errorCapturado: unknown;

    await act(async () => {
      try {
        await result.current.ejecutar();
      } catch (error) {
        errorCapturado = error;
      }
    });

    expect(errorCapturado).toBe(fallo);
    expect(result.current.error).toBe(fallo);
    expect(result.current.loading).toBe(false);
  });
});
