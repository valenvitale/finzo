import { IMovimientoRepository } from '../repositories/movimiento.repository.js';
// import { ICategoriaRepository } from "../repositories/categoria.repository.js";
// import { IMedioPagoRepository } from "../repositories/medioPago.repository.js";
import { CrearMovimientoDTO, ActualizarMovimientoDTO, FiltrosMovimientoDTO } from '../types/movimiento.types.js';
import { ErrorDeValidacion, ErrorNoEncontrado, ErrorProhibido } from '../utils/errores.js';

export class MovimientoService {
  private readonly movimientoRepository: IMovimientoRepository;
  /**
   * El Service queda a la espera de la implementacion de laS interfaces:
   * ICategoriaRepository (KAN-94) y IMedioPagoRepository (KAN-124) para la implementación final
   * @param movimientoRepository - Repositorio de movimientos para interactuar con la base de datos.
   */
  constructor(movimientoRepository: IMovimientoRepository) {
    this.movimientoRepository = movimientoRepository;
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

  private validarRelaciones(datosMovimiento: CrearMovimientoDTO | ActualizarMovimientoDTO) {
    // Validar que la categoria exista
    // pendiente de la implementacion de la interfaz ICategoriaRepository (KAN-94) de alessio
    // validar que el medio de pago exista
    // pendiente de la implementacion de la interfaz IMedioPagoRepository (KAN-124) de alessio
  }

  private async validarPertenenciaUsuario(movimientoId: string, perfilId: string) {
    const movimiento = await this.movimientoRepository.obtenerPorId(movimientoId);

    if (!movimiento) {
      throw new ErrorNoEncontrado('El movimiento no existe');
    }

    if (movimiento.perfilId !== perfilId) {
      throw new ErrorProhibido('No tienes permiso para modificar este movimiento');
    }
  }

  crear(perfilId: string, datosMovimiento: CrearMovimientoDTO) {
    this.validarDatosBasicos(datosMovimiento);
    this.validarRelaciones(datosMovimiento);
    return this.movimientoRepository.crear(perfilId, datosMovimiento);
  }
  async obtenerPorId(id: string, perfilId: string) {
    await this.validarPertenenciaUsuario(id, perfilId);
    return this.movimientoRepository.obtenerPorId(id);
  }
  async actualizar(id: string, perfilId: string, datosActualizacion: ActualizarMovimientoDTO) {
    await this.validarPertenenciaUsuario(id, perfilId);
    this.validarDatosBasicos(datosActualizacion);
    this.validarRelaciones(datosActualizacion);
    return this.movimientoRepository.actualizar(id, datosActualizacion);
  }
  async eliminar(id: string, perfilId: string) {
    await this.validarPertenenciaUsuario(id, perfilId);
    return this.movimientoRepository.eliminar(id);
  }

  listarPorPerfil(perfilId: string, filtros?: FiltrosMovimientoDTO) {
    return this.movimientoRepository.listarPorPerfil(perfilId, filtros);
  }
}
