import { useState, useEffect } from 'react';
import type { CategoriaResponseDTO, CrearCategoriaDTO, ActualizarCategoriaDTO } from '../types/categoria.types';
import * as categoriaService from '../services/categoria.service';

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaResponseDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setError(null);
        setCargando(true);
        const data = await categoriaService.listarCategorias();
        setCategorias(data);
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error al cargar las categorias';
        setError(mensaje);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const crear = async (datos: CrearCategoriaDTO) => {
    try {
      setError(null);
      const nuevaCategoria = await categoriaService.crearCategoria(datos);
      setCategorias((prev) => [...prev, nuevaCategoria]);
      return nuevaCategoria;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al crear la categoria';
      setError(mensaje);
      throw err;
    }
  };

  const actualizar = async (id: string, datos: ActualizarCategoriaDTO) => {
    try {
      setError(null);
      const categoriaActualizada = await categoriaService.actualizarCategoria(id, datos);
      setCategorias((prev) => prev.map((c) => (c.id === id ? categoriaActualizada : c)));
      return categoriaActualizada;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al actualizar la categoria';
      setError(mensaje);
      throw err;
    }
  };

  const eliminar = async (id: string) => {
    try {
      setError(null);
      await categoriaService.eliminarCategoria(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar la categoria';
      setError(mensaje);
      throw err;
    }
  };

  const categoriasIngreso = categorias.filter((c) => c.tipo === 'INGRESO');
  const categoriasGasto = categorias.filter((c) => c.tipo === 'GASTO');

  return {
    categorias,
    categoriasIngreso,
    categoriasGasto,
    cargando,
    error,
    crear,
    actualizar,
    eliminar,
  };
}
