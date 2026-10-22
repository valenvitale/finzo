import { type IMovimientoRepository } from '../repositories/movimiento.repository.js';
import { type ICategoriaRepository } from '../repositories/categoria.repository.js';
import { type IMedioPagoRepository } from '../repositories/medio-pago.repository.js';
import {
  type CrearMovimientoDTO,
  type ActualizarMovimientoDTO,
  type FiltrosMovimientoDTO,
  type MovimientoResponseDTO,
} from '../types/movimiento.types.js';
import { ErrorDeValidacion, ErrorNoEncontrado, ErrorProhibido } from '../errors/errores.js';

export interface IMovimientoService {
  crear(perfilId: string, datosMovimiento: CrearMovimientoDTO): Promise<MovimientoResponseDTO>;
  obtenerPorId(id: string, perfilId: string): Promise<MovimientoResponseDTO>;
  actualizar(id: string, perfilId: string, datosActualizacion: ActualizarMovimientoDTO): Promise<MovimientoResponseDTO>;
  eliminar(id: string, perfilId: string): Promise<void>;
  listarPorPerfil(perfilId: string, filtros?: FiltrosMovimientoDTO): Promise<MovimientoResponseDTO[]>;
}
export class MovimientoService implements IMovimientoService {
  private readonly movimientoRepository: IMovimientoRepository;
  private readonly categoriaRepository?: ICategoriaRepository;
  private readonly medioPagoRepository?: IMedioPagoRepository;

  /**
   * @param movimientoRepository - Repositorio de movimientos para interactuar con la base de datos.
   * @param categoriaRepository - Repositorio de categorías para validar existencia y pertenencia.
   * @param medioPagoRepository - Repositorio de medios de pago para validar existencia y pertenencia.
   */
  constructor(
    movimientoRepository: IMovimientoRepository,
    categoriaRepository?: ICategoriaRepository,
    medioPagoRepository?: IMedioPagoRepository
  ) {
    this.movimientoRepository = movimientoRepository;
    this.categoriaRepository = categoriaRepository;
    this.medioPagoRepository = medioPagoRepository;
  }

  /**
   * Funciones que validan los datos de entrada para crear o actualizar un movimiento.
   * @param datosMovimiento - Los datos del movimiento a validar.
   */

  private async validarRelaciones(datosMovimiento: CrearMovimientoDTO | ActualizarMovimientoDTO, perfilId?: string) {
    if (this.categoriaRepository && datosMovimiento.categoriaId) {
      const categoria = await this.categoriaRepository.obtenerPorId(datosMovimiento.categoriaId);
      if (!categoria) {
        throw new ErrorDeValidacion('La categoría especificada no existe');
      }
      if (categoria.perfilId !== null && perfilId && categoria.perfilId !== perfilId) {
        throw new ErrorProhibido('No tienes permiso para utilizar esta categoría');
      }
    }

    if (this.medioPagoRepository && datosMovimiento.medioPagoId) {
      const medioPago = await this.medioPagoRepository.obtenerPorId(datosMovimiento.medioPagoId);
      if (!medioPago) {
        throw new ErrorDeValidacion('El medio de pago especificado no existe');
      }
      if (medioPago.id_perfil !== null && perfilId && medioPago.id_perfil !== perfilId) {
        throw new ErrorProhibido('No tienes permiso para utilizar este medio de pago');
      }
    }
  }

  private async validarPertenenciaUsuario(movimientoId: string, perfilId: string) {
    const movimiento = await this.movimientoRepository.obtenerPorId(movimientoId);

    if (!movimiento) {
      throw new ErrorNoEncontrado('El movimiento no existe');
    }

    if (movimiento.perfilId !== perfilId) {
      throw new ErrorProhibido('No tienes permiso para acceder a este movimiento');
    }

    return movimiento;
  }

  async crear(perfilId: string, datosMovimiento: CrearMovimientoDTO): Promise<MovimientoResponseDTO> {
    await this.validarRelaciones(datosMovimiento, perfilId);
    return this.movimientoRepository.crear(perfilId, datosMovimiento);
  }

  async obtenerPorId(id: string, perfilId: string): Promise<MovimientoResponseDTO> {
    return this.validarPertenenciaUsuario(id, perfilId);
  }

  async actualizar(
    id: string,
    perfilId: string,
    datosActualizacion: ActualizarMovimientoDTO
  ): Promise<MovimientoResponseDTO> {
    await this.validarPertenenciaUsuario(id, perfilId);
    await this.validarRelaciones(datosActualizacion, perfilId);
    return this.movimientoRepository.actualizar(id, datosActualizacion);
  }

  async eliminar(id: string, perfilId: string): Promise<void> {
    await this.validarPertenenciaUsuario(id, perfilId);
    return this.movimientoRepository.eliminar(id);
  }

  async listarPorPerfil(perfilId: string, filtros?: FiltrosMovimientoDTO): Promise<MovimientoResponseDTO[]> {
    return this.movimientoRepository.listarPorPerfil(perfilId, filtros);
  }
}
