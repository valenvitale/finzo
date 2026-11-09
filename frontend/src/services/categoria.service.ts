import { apiClient } from './api';
import type { CategoriaResponseDTO, CrearCategoriaDTO, ActualizarCategoriaDTO } from '../types/categoria.types';

export async function listarCategorias(): Promise<CategoriaResponseDTO[]> {
  const respuesta = await apiClient.get('/categorias');
  return respuesta.data.datos;
}

export async function obtenerCategoriaPorId(id: string): Promise<CategoriaResponseDTO> {
  const respuesta = await apiClient.get(`/categorias/${id}`);
  return respuesta.data.datos;
}

export async function crearCategoria(datosCategoria: CrearCategoriaDTO): Promise<CategoriaResponseDTO> {
  const respuesta = await apiClient.post('/categorias', datosCategoria);
  return respuesta.data.datos;
}

export async function actualizarCategoria(
  id: string,
  datosCategoria: ActualizarCategoriaDTO
): Promise<CategoriaResponseDTO> {
  const respuesta = await apiClient.patch(`/categorias/${id}`, datosCategoria);
  return respuesta.data.datos;
}

export async function eliminarCategoria(id: string): Promise<void> {
  await apiClient.delete(`/categorias/${id}`);
}
