import { ErrorDeConflicto, ErrorNoEncontrado, ErrorProhibido } from '../errors/errores.js';
import type { IPresupuestoRepository } from '../repositories/presupuesto.repository.js';
import type {
  ActualizarPresupuestoDTO,
  CrearPresupuestoDTO,
  PresupuestoDTO,
  ResumenPresupuestosDTO,
} from '../types/presupuesto.types.js';

export interface IPresupuestoService {
  listarPorPeriodo(perfilId: string, mes?: number, anio?: number): Promise<ResumenPresupuestosDTO>;
  crear(perfilId: string, datos: CrearPresupuestoDTO): Promise<PresupuestoDTO>;
  actualizar(id: string, perfilId: string, datos: ActualizarPresupuestoDTO): Promise<PresupuestoDTO>;
  eliminar(id: string, perfilId: string): Promise<void>;
}

export class PresupuestoService implements IPresupuestoService {
  constructor(private readonly presupuestoRepository: IPresupuestoRepository) {}

  private obtenerPeriodo(mes?: number, anio?: number): { mes: number; anio: number } {
    if ((mes === undefined) !== (anio === undefined)) {
      throw new ErrorDeConflicto('Para consultar un período, enviá mes y año juntos');
    }

    const ahora = new Date();
    return { mes: mes ?? ahora.getMonth() + 1, anio: anio ?? ahora.getFullYear() };
  }

  private async exigirMonedaPrincipal(perfilId: string) {
    const moneda = await this.presupuestoRepository.obtenerMonedaPrincipal(perfilId);
    if (!moneda) {
      throw new ErrorDeConflicto('Configurá una moneda principal para consultar tus presupuestos');
    }
    return moneda;
  }

  private async validarCategoria(perfilId: string, categoriaId: string): Promise<void> {
    const categoria = await this.presupuestoRepository.obtenerCategoria(categoriaId);
    if (!categoria) {
      throw new ErrorNoEncontrado('No se encontró la categoría');
    }
    if (categoria.perfilId !== null && categoria.perfilId !== perfilId) {
      throw new ErrorProhibido('No podés crear presupuestos para categorías de otro perfil');
    }
    if (categoria.tipo !== 'GASTO') {
      throw new ErrorDeConflicto('Solo se pueden presupuestar categorías de gasto');
    }
  }

  async listarPorPeriodo(perfilId: string, mes?: number, anio?: number): Promise<ResumenPresupuestosDTO> {
    const periodo = this.obtenerPeriodo(mes, anio);
    const moneda = await this.exigirMonedaPrincipal(perfilId);
    const presupuestos = await this.presupuestoRepository.listarPorPeriodo(
      perfilId,
      periodo.mes,
      periodo.anio,
      moneda.id
    );
    const totalLimiteMensual = presupuestos.reduce((total, item) => total + item.limiteMensual, 0);
    const totalGastado = presupuestos.reduce((total, item) => total + item.gastoActual, 0);

    return {
      ...periodo,
      moneda: { codigo: moneda.codigo, simbolo: moneda.simbolo },
      totalLimiteMensual,
      totalGastado,
      totalDisponible: totalLimiteMensual - totalGastado,
      porcentajeUsado: totalLimiteMensual === 0 ? 0 : (totalGastado / totalLimiteMensual) * 100,
      presupuestos,
    };
  }

  async crear(perfilId: string, datos: CrearPresupuestoDTO): Promise<PresupuestoDTO> {
    await this.exigirMonedaPrincipal(perfilId);
    await this.validarCategoria(perfilId, datos.categoriaId);
    const presupuesto = await this.presupuestoRepository.crear(perfilId, datos);
    const resumen = await this.listarPorPeriodo(perfilId, datos.mes, datos.anio);
    return resumen.presupuestos.find((item) => item.id === presupuesto.id) ?? presupuesto;
  }

  async actualizar(id: string, perfilId: string, datos: ActualizarPresupuestoDTO): Promise<PresupuestoDTO> {
    const existente = await this.presupuestoRepository.obtenerPorId(id, perfilId);
    if (!existente) {
      throw new ErrorNoEncontrado('No se encontró el presupuesto');
    }
    await this.exigirMonedaPrincipal(perfilId);
    await this.presupuestoRepository.actualizar(id, perfilId, datos);
    const resumen = await this.listarPorPeriodo(perfilId, existente.mes, existente.anio);
    return resumen.presupuestos.find((item) => item.id === id) ?? existente;
  }

  eliminar(id: string, perfilId: string): Promise<void> {
    return this.presupuestoRepository.eliminar(id, perfilId);
  }
}
