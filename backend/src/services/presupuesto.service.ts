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
  guardarMeta(perfilId: string, monedaId: string, mes: number, anio: number, monto: number): Promise<void>;
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
    const [presupuestos, montoMeta, ahorroActual] = await Promise.all([
      this.presupuestoRepository.listarPorPeriodo(perfilId, periodo.mes, periodo.anio, moneda.id),
      this.presupuestoRepository.obtenerMeta(perfilId, moneda.id, periodo.mes, periodo.anio),
      this.presupuestoRepository.obtenerAhorro(perfilId, moneda.id, periodo.mes, periodo.anio),
    ]);
    const totalLimiteMensual = presupuestos.reduce((total, item) => total + item.limiteMensual, 0);
    const totalGastado = presupuestos.reduce((total, item) => total + item.gastoActual, 0);

    return {
      ...periodo,
      moneda: { id: moneda.id, codigo: moneda.codigo, simbolo: moneda.simbolo },
      totalLimiteMensual,
      totalGastado,
      totalDisponible: totalLimiteMensual - totalGastado,
      porcentajeUsado: totalLimiteMensual === 0 ? 0 : (totalGastado / totalLimiteMensual) * 100,
      presupuestos,
      metaAhorro:
        montoMeta === null
          ? null
          : {
              monto: montoMeta,
              ahorroActual,
              porcentajeCumplido: Math.max(0, (ahorroActual / montoMeta) * 100),
            },
    };
  }

  async crear(perfilId: string, datos: CrearPresupuestoDTO): Promise<PresupuestoDTO> {
    const moneda = await this.exigirMonedaPrincipal(perfilId);
    if (datos.monedaId !== moneda.id) {
      throw new ErrorDeConflicto('La moneda principal cambió; recargá los presupuestos');
    }
    await this.validarCategoria(perfilId, datos.categoriaId);
    const presupuesto = await this.presupuestoRepository.crear(perfilId, moneda.id, datos);
    const presupuestos = await this.presupuestoRepository.listarPorPeriodo(perfilId, datos.mes, datos.anio, moneda.id);
    const creado = presupuestos.find((item) => item.id === presupuesto.id);
    if (!creado) throw new ErrorNoEncontrado('El presupuesto ya no existe');
    return creado;
  }

  async actualizar(id: string, perfilId: string, datos: ActualizarPresupuestoDTO): Promise<PresupuestoDTO> {
    const existente = await this.presupuestoRepository.obtenerPorId(id, perfilId);
    if (!existente) {
      throw new ErrorNoEncontrado('No se encontró el presupuesto');
    }
    const moneda = await this.exigirMonedaPrincipal(perfilId);
    if (existente.monedaId !== moneda.id) {
      throw new ErrorDeConflicto('El presupuesto pertenece a otra moneda; recargá los presupuestos');
    }
    await this.presupuestoRepository.actualizar(id, perfilId, datos);
    const presupuestos = await this.presupuestoRepository.listarPorPeriodo(
      perfilId,
      existente.mes,
      existente.anio,
      moneda.id
    );
    const actualizado = presupuestos.find((item) => item.id === id);
    if (!actualizado) throw new ErrorNoEncontrado('El presupuesto ya no existe');
    return actualizado;
  }

  eliminar(id: string, perfilId: string): Promise<void> {
    return this.presupuestoRepository.eliminar(id, perfilId);
  }

  async guardarMeta(perfilId: string, monedaId: string, mes: number, anio: number, monto: number): Promise<void> {
    const moneda = await this.exigirMonedaPrincipal(perfilId);
    if (monedaId !== moneda.id) {
      throw new ErrorDeConflicto('La moneda principal cambió; recargá los presupuestos');
    }
    await this.presupuestoRepository.guardarMeta(perfilId, moneda.id, mes, anio, monto);
  }
}
