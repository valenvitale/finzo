import { ICategoriaRepository } from '../repositories/categoria.repository.js';
import { CrearCategoriaDTO, ActualizarCategoriaDTO, CategoriaResponseDTO } from '../types/categoria.types.js';
import { ErrorDeConflicto, ErrorNoEncontrado, ErrorProhibido } from '../errors/errores.js';

export class CategoriaService {
  private readonly categoriaRepository: ICategoriaRepository;

  constructor(categoriaRepository: ICategoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  private async validarCategoriaEditable(id: string, perfilId: string): Promise<CategoriaResponseDTO> {
    const categoria = await this.categoriaRepository.obtenerPorId(id);

    if (!categoria) {
      throw new ErrorNoEncontrado('La categoría no existe');
    }

    if (categoria.perfilId === null) {
      throw new ErrorProhibido('No podés modificar ni eliminar categorías predeterminadas');
    }

    if (categoria.perfilId !== perfilId) {
      throw new ErrorProhibido('No podés modificar ni eliminar categorías de otro perfil');
    }

    return categoria;
  }

  async crear(perfilId: string, datosCategoria: CrearCategoriaDTO): Promise<CategoriaResponseDTO> {
    const cantidad = await this.categoriaRepository.contarPersonalizadasPorPerfil(perfilId);

    if (cantidad >= 8) {
      throw new ErrorDeConflicto('Podés tener hasta 8 categorías personalizadas');
    }

    return this.categoriaRepository.crear(perfilId, datosCategoria);
  }

  async obtenerPorId(id: string, perfilId: string): Promise<CategoriaResponseDTO> {
    const categoria = await this.categoriaRepository.obtenerPorId(id);

    if (!categoria) {
      throw new ErrorNoEncontrado('La categoría no existe');
    }

    if (categoria.perfilId !== null && categoria.perfilId !== perfilId) {
      throw new ErrorProhibido('No tienes permiso para acceder a esta categoría');
    }

    return categoria;
  }

  async actualizar(
    id: string,
    perfilId: string,
    datosActualizacion: ActualizarCategoriaDTO
  ): Promise<CategoriaResponseDTO> {
    const categoria = await this.validarCategoriaEditable(id, perfilId);

    if (datosActualizacion.tipo !== undefined && datosActualizacion.tipo !== categoria.tipo) {
      const cantidadMovimientos = await this.categoriaRepository.contarMovimientosAsociados(id);

      if (cantidadMovimientos > 0) {
        throw new ErrorDeConflicto('No podés cambiar el tipo de una categoría con movimientos asociados');
      }
    }

    return this.categoriaRepository.actualizar(id, datosActualizacion);
  }

  async eliminar(id: string, perfilId: string): Promise<void> {
    await this.validarCategoriaEditable(id, perfilId);

    const cantidadMovimientos = await this.categoriaRepository.contarMovimientosAsociados(id);

    if (cantidadMovimientos > 0) {
      throw new ErrorDeConflicto('No podés eliminar una categoría con movimientos asociados');
    }

    await this.categoriaRepository.eliminar(id);
  }

  async listarPorPerfil(perfilId: string): Promise<CategoriaResponseDTO[]> {
    return this.categoriaRepository.listarPorPerfil(perfilId);
  }
}
