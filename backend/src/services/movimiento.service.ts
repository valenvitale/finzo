import { IMovimientoRepository } from '../repositories/movimiento.repository.js';
import { ICategoriaRepository } from '../repositories/categoria.repository.js';
// import { IMedioPagoRepository } from "../repositories/medioPago.repository.js";
import {
  CrearMovimientoDTO,
  ActualizarMovimientoDTO,
  FiltrosMovimientoDTO,
  MovimientoResponseDTO,
} from '../types/movimiento.types.js';
import { ErrorDeValidacion, ErrorNoEncontrado, ErrorProhibido } from '../errors/errores.js';

export class MovimientoService {
  private readonly movimientoRepository: IMovimientoRepository;
  private readonly categoriaRepository?: ICategoriaRepository;

  /**
   * @param movimientoRepository - Repositorio de movimientos para interactuar con la base de datos.
   * @param categoriaRepository - Repositorio de categorías para validar existencia y pertenencia.
   */
  constructor(movimientoRepository: IMovimientoRepository, categoriaRepository?: ICategoriaRepository) {
    this.movimientoRepository = movimientoRepository;
    this.categoriaRepository = categoriaRepository;
  }

  /**
   * Funciones que validan los datos de entrada para crear o actualizar un movimiento.
   * @param datosMovimiento - Los datos del movimiento a validar.
   */

  private validarDatosBasicos(datosMovimiento: CrearMovimientoDTO | ActualizarMovimientoDTO) {
    if (
      datosMovimiento.monto !== undefined &&
      (!Number.isFinite(datosMovimiento.monto) || datosMovimiento.monto <= 0)
    ) {
      throw new ErrorDeValidacion('El monto debe ser un número mayor a 0');
    }
    if (datosMovimiento.fecha !== undefined) {
      if (!(datosMovimiento.fecha instanceof Date) || Number.isNaN(datosMovimiento.fecha.getTime())) {
        throw new ErrorDeValidacion('La fecha no es válida');
      }
    }
  }

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
    this.validarDatosBasicos(datosMovimiento);
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
    this.validarDatosBasicos(datosActualizacion);
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
