import {
  IMovimientoRepository
} from '../repositories/movimiento.repository.js';

import {
  IMonedaRepository,
} from '../repositories/moneda.repository.js';

import { ErrorDeConflicto } from '../errors/errores.js';

//nuevo bloque de codigo
// ahora tenemos un contrato que establece que debe hacer cualquier servicio de resumen.
// nos permite que el controller dependa de IResumenService en lugar de una implementación concreta, lo que facilita la prueba y el mantenimiento.
export interface IResumenService {
  obtenerResumen(
    perfilId: string,
    mes?: number,
    anio?: number
  ): Promise<{
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    moneda: string;
  }>;
}
// termina nuevo bloque de codigo

//antes solo exportabamos la clase ResumenService.
export class ResumenService implements IResumenService {
  constructor(
    private readonly movimientoRepository: IMovimientoRepository,
    private readonly monedaRepository: IMonedaRepository,
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