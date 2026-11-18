import { useCallback, useEffect, useRef, useState } from 'react';

function normalizarError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === 'string' && error.length > 0) return new Error(error);
  return new Error('Ocurrió un error inesperado.');
}

export function useApi<T, TArgs extends unknown[] = []>(
  apiFn: (...args: TArgs) => Promise<T>
) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const apiFnRef = useRef(apiFn);
  const argumentosRef = useRef<TArgs | null>(null);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  apiFnRef.current = apiFn;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, []);

  const ejecutar = useCallback(async (...args: TArgs): Promise<T> => {
    argumentosRef.current = args;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const resultado = await apiFnRef.current(...args);
      if (mountedRef.current && requestId === requestIdRef.current) {
        setData(resultado);
      }
      return resultado;
    } catch (errorCapturado) {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setError(normalizarError(errorCapturado));
      }
      throw errorCapturado;
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const refetch = useCallback((): Promise<T> => {
    if (argumentosRef.current === null) {
      const errorInicial = new Error(
        'No hay una ejecución previa para repetir.'
      );
      setError(errorInicial);
      return Promise.reject(errorInicial);
    }
    return ejecutar(...argumentosRef.current);
  }, [ejecutar]);

  return { data, loading, error, ejecutar, refetch };
}
