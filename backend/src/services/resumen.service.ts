import {
  IMovimientoRepository,
  MovimientoRepository,
} from '../repositories/movimiento.repository.js';

import {
  IMonedaRepository,
  MonedaRepository,
} from '../repositories/moneda.repository.js';

import { ErrorDeConflicto } from '../errors/errores.js';

export class ResumenService {
  constructor(
    private readonly movimientoRepository: IMovimientoRepository = new MovimientoRepository(),
    private readonly monedaRepository: IMonedaRepository = new MonedaRepository(),
  ) {}

  async obtenerResumen(perfilId: string, mes?: number, anio?: number) {
    // si no se especifica un período, usamos el mes y año actuales.
    const hoy = new Date();
    const mesConsulta = mes ?? hoy.getMonth() + 1;
    const anioConsulta = anio ?? hoy.getFullYear();

    // obtenemos la moneda principal del usuario.
    const monedas = await this.monedaRepository.listarPorPerfil(perfilId);
    const monedaPrincipal = monedas.find((moneda) => moneda.esPrincipal);

    if (!monedaPrincipal) {
      throw new ErrorDeConflicto(
        'Debes configurar una moneda principal para consultar el resumen financiero'
      );
    }

    // consultamos los movimientos del período y moneda seleccionados.
    const movimientos = await this.movimientoRepository.listarPorPerfil(perfilId, {
      mes: mesConsulta,
      anio: anioConsulta,
      monedaId: monedaPrincipal.id,
    });

    // acumulamos ingresos y gastos según el tipo de categoría.
    let totalIngresos = 0;
    let totalGastos = 0;

    for (const movimiento of movimientos) {
      if (movimiento.tipo === 'INGRESO') {
        totalIngresos += movimiento.monto;
      } else if (movimiento.tipo === 'GASTO') {
        totalGastos += movimiento.monto;
      }
    }

    return {
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
      moneda: monedaPrincipal.codigo,
    };
  }
}