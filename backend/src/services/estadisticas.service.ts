import type {
  IEstadisticasRepository,
  MovimientoEstadistica,
  TotalPorCategoria,
  TotalMensual,
} from '../repositories/estadisticas.repository.js';

import type {
  FiltrosEstadisticasDTO,
  GastoPorCategoriaDTO,
  EvolucionMensualDTO,
  EstadisticasMonedaDTO,
  EstadisticasResponseDTO,
} from '../types/estadisticas.types.js';

export interface IEstadisticasService {
  obtenerEstadisticas(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<EstadisticasResponseDTO>;
}

export class EstadisticasService implements IEstadisticasService {
  constructor(
    private readonly repository: IEstadisticasRepository
  ) {}
  // Obtiene las estadísticas financieras de un perfil.
  async obtenerEstadisticas(
    perfilId: string,
    filtros?: FiltrosEstadisticasDTO
  ): Promise<EstadisticasResponseDTO> {
    const movimientos = await this.repository.obtenerMovimientos(
      perfilId,
      filtros
    );

    const totalesPorCategoria =
      await this.repository.obtenerTotalesPorCategoria(
        perfilId,
        filtros
      );

    const totalesMensuales =
      await this.repository.obtenerTotalesMensuales(
        perfilId,
        filtros
      );

    // Agrupar los movimientos por moneda.
    const movimientosPorMoneda = new Map<
      string,
      MovimientoEstadistica[]
    >();

    for (const movimiento of movimientos) {
      const grupo =
        movimientosPorMoneda.get(movimiento.monedaId) ?? [];

      grupo.push(movimiento);

      movimientosPorMoneda.set(movimiento.monedaId, grupo);
    }

    const estadisticasPorMoneda: EstadisticasMonedaDTO[] = [];

    // Calcular las estadísticas de cada moneda.
    for (const [monedaId, movimientosMoneda] of movimientosPorMoneda) {
      const ingresos = movimientosMoneda
        .filter((movimiento) => movimiento.tipo === 'INGRESO')
        .reduce(
          (total, movimiento) => total + movimiento.monto,
          0
        );

      const gastos = movimientosMoneda
        .filter((movimiento) => movimiento.tipo === 'GASTO')
        .reduce(
          (total, movimiento) => total + movimiento.monto,
          0
        );

      const totalesMoneda = totalesPorCategoria.filter(
        (total) => total.monedaId === monedaId
      );

      const totalesMensualesMoneda = totalesMensuales.filter(
        (total) => total.monedaId === monedaId
      );

      estadisticasPorMoneda.push({
        monedaId,
        codigoMoneda: movimientosMoneda[0].codigoMoneda,

        gastosPorCategoria: this.calcularGastosPorCategoria(
          movimientosMoneda,
          totalesMoneda
        ),

        evolucionMensual: this.calcularEvolucionMensual(
          totalesMensualesMoneda
        ),

        promedioGastoDiario: this.calcularPromedioDiario(
          movimientosMoneda,
          filtros
        ),

        tasaAhorro:
          ingresos > 0
            ? ((ingresos - gastos) / ingresos) * 100
            : 0,
      });
    }

    return { estadisticasPorMoneda };
  }

  // Calcula la distribución porcentual de gastos por categoría.
  private calcularGastosPorCategoria(
    movimientos: MovimientoEstadistica[],
    totales: TotalPorCategoria[]
  ): GastoPorCategoriaDTO[] {
    const nombresCategorias = new Map<string, string>();

    for (const movimiento of movimientos) {
      nombresCategorias.set(
        movimiento.categoriaId,
        movimiento.categoriaNombre
      );
    }

    const totalGastos = totales.reduce(
      (acumulado, categoria) => acumulado + categoria.total,
      0
    );

    return totales.map((categoria) => ({
      categoriaId: categoria.categoriaId,

      categoriaNombre:
        nombresCategorias.get(categoria.categoriaId) ??
        'Sin categoría',

      total: categoria.total,

      porcentaje:
        totalGastos > 0
          ? (categoria.total / totalGastos) * 100
          : 0,
    }));
  }

  // Calcula los ingresos, gastos y tasa de ahorro por mes.
  private calcularEvolucionMensual(
    totales: TotalMensual[]
  ): EvolucionMensualDTO[] {
    const meses = new Map<string, EvolucionMensualDTO>();

    for (const total of totales) {
      const registro = meses.get(total.mes) ?? {
        mes: total.mes,
        ingresos: 0,
        gastos: 0,
        tasaAhorro: 0,
      };

      if (total.tipo === 'INGRESO') {
        registro.ingresos += total.total;
      } else {
        registro.gastos += total.total;
      }

      meses.set(total.mes, registro);
    }

    return Array.from(meses.values())
      .map((registro) => ({
        ...registro,

        tasaAhorro:
          registro.ingresos > 0
            ? (
                (registro.ingresos - registro.gastos) /
                registro.ingresos
              ) * 100
            : 0,
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  }

  // Calcula el promedio de gastos por día del período.
  private calcularPromedioDiario(
    movimientos: MovimientoEstadistica[],
    filtros?: FiltrosEstadisticasDTO
  ): number {
    const gastos = movimientos.filter(
      (movimiento) => movimiento.tipo === 'GASTO'
    );

    const totalGastos = gastos.reduce(
      (total, movimiento) => total + movimiento.monto,
      0
    );

    if (movimientos.length === 0) {
      return 0;
    }

    const fechas = movimientos.map(
      (movimiento) => movimiento.fecha.getTime()
    );

    const inicio =
      filtros?.fechaDesde?.getTime() ?? Math.min(...fechas);

    const fin =
      filtros?.fechaHasta?.getTime() ?? Math.max(...fechas);

    // Contar días calendario UTC.
    const milisegundosPorDia = 1000 * 60 * 60 * 24;

    const diaInicio = Math.floor(
      inicio / milisegundosPorDia
    );

    const diaFin = Math.floor(
      fin / milisegundosPorDia
    );

    const dias = Math.max(
      1,
      diaFin - diaInicio + 1
    );

    return totalGastos / dias;
  }
}
