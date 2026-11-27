import { describe, expect, it, vi } from 'vitest';
import { EstadisticasService } from '../../src/services/estadisticas.service.js';

import type {
  IEstadisticasRepository,
  MovimientoEstadistica,
  TotalPorCategoria,
  TotalMensual,
} from '../../src/repositories/estadisticas.repository.js';

describe('EstadisticasService', () => {
  const crearMovimiento = (
    monto: number,
    tipo: 'INGRESO' | 'GASTO',
    categoriaId: string,
    categoriaNombre: string,
    fecha = '2026-11-05T12:00:00Z',
    monedaId = 'moneda-ars',
    codigoMoneda = 'ARS'
  ): MovimientoEstadistica => ({
    monto,
    tipo,
    fecha: new Date(fecha),
    categoriaId,
    categoriaNombre,
    monedaId,
    codigoMoneda,
  });

  function preparar(
    movimientos: MovimientoEstadistica[] = [],
    totalesPorCategoria: TotalPorCategoria[] = [],
    totalesMensuales: TotalMensual[] = []
  ) {
    const obtenerMovimientos = vi.fn().mockResolvedValue(movimientos);

    const obtenerTotalesPorCategoria = vi
      .fn()
      .mockResolvedValue(totalesPorCategoria);

    const obtenerTotalesMensuales = vi
      .fn()
      .mockResolvedValue(totalesMensuales);

    const repository: IEstadisticasRepository = {
      obtenerMovimientos,
      obtenerTotalesPorCategoria,
      obtenerTotalesMensuales,
    };

    const service = new EstadisticasService(repository);

    return {
      service,
      obtenerMovimientos,
      obtenerTotalesPorCategoria,
      obtenerTotalesMensuales,
    };
  }

  it('devuelve un arreglo vacío cuando no hay movimientos', async () => {
    const { service } = preparar();

    const resultado = await service.obtenerEstadisticas('perfil-1');

    expect(resultado).toEqual({
      estadisticasPorMoneda: [],
    });
  });

  it('calcula los gastos y porcentajes por categoría', async () => {
    const movimientos = [
      crearMovimiento(100000, 'INGRESO', 'sueldo', 'Sueldo'),
      crearMovimiento(20000, 'GASTO', 'comida', 'Comida'),
      crearMovimiento(10000, 'GASTO', 'transporte', 'Transporte'),
    ];

    const totalesPorCategoria: TotalPorCategoria[] = [
      {
        categoriaId: 'comida',
        monedaId: 'moneda-ars',
        total: 20000,
      },
      {
        categoriaId: 'transporte',
        monedaId: 'moneda-ars',
        total: 10000,
      },
    ];

    const { service } = preparar(
      movimientos,
      totalesPorCategoria
    );

    const resultado = await service.obtenerEstadisticas('perfil-1');

    const categorias =
      resultado.estadisticasPorMoneda[0].gastosPorCategoria;

    expect(categorias).toHaveLength(2);

    expect(categorias[0]).toEqual({
      categoriaId: 'comida',
      categoriaNombre: 'Comida',
      total: 20000,
      porcentaje: expect.closeTo(66.6667, 3),
    });

    expect(categorias[1]).toEqual({
      categoriaId: 'transporte',
      categoriaNombre: 'Transporte',
      total: 10000,
      porcentaje: expect.closeTo(33.3333, 3),
    });
  });

  it('calcula la evolución mensual y la tasa de ahorro de cada mes', async () => {
    const movimientos = [
      crearMovimiento(100000, 'INGRESO', 'sueldo', 'Sueldo'),
      crearMovimiento(30000, 'GASTO', 'comida', 'Comida'),
    ];

    const totalesMensuales: TotalMensual[] = [
      {
        monedaId: 'moneda-ars',
        mes: '2026-11',
        tipo: 'INGRESO',
        total: 100000,
      },
      {
        monedaId: 'moneda-ars',
        mes: '2026-11',
        tipo: 'GASTO',
        total: 30000,
      },
      {
        monedaId: 'moneda-ars',
        mes: '2026-10',
        tipo: 'INGRESO',
        total: 50000,
      },
      {
        monedaId: 'moneda-ars',
        mes: '2026-10',
        tipo: 'GASTO',
        total: 10000,
      },
    ];

    const { service } = preparar(
      movimientos,
      [],
      totalesMensuales
    );

    const resultado = await service.obtenerEstadisticas('perfil-1');

    expect(resultado.estadisticasPorMoneda[0].evolucionMensual).toEqual([
      {
        mes: '2026-10',
        ingresos: 50000,
        gastos: 10000,
        tasaAhorro: 80,
      },
      {
        mes: '2026-11',
        ingresos: 100000,
        gastos: 30000,
        tasaAhorro: 70,
      },
    ]);
  });

  it('calcula correctamente el promedio de gasto diario', async () => {
    const movimientos = [
      crearMovimiento(
        20000,
        'GASTO',
        'comida',
        'Comida',
        '2026-11-05T12:00:00Z'
      ),
      crearMovimiento(
        10000,
        'GASTO',
        'transporte',
        'Transporte',
        '2026-11-07T12:00:00Z'
      ),
    ];

    const { service } = preparar(movimientos);

    const resultado = await service.obtenerEstadisticas('perfil-1');

    expect(
      resultado.estadisticasPorMoneda[0].promedioGastoDiario
    ).toBe(10000);
  });

  it('calcula la tasa de ahorro general', async () => {
    const movimientos = [
      crearMovimiento(100000, 'INGRESO', 'sueldo', 'Sueldo'),
      crearMovimiento(30000, 'GASTO', 'comida', 'Comida'),
    ];

    const { service } = preparar(movimientos);

    const resultado = await service.obtenerEstadisticas('perfil-1');

    expect(
      resultado.estadisticasPorMoneda[0].tasaAhorro
    ).toBe(70);
  });

  it('envía el perfil y los filtros al Repository', async () => {
    const { service, obtenerMovimientos, obtenerTotalesPorCategoria,
      obtenerTotalesMensuales } = preparar();

    const filtros = {
      fechaDesde: new Date('2026-11-01T00:00:00Z'),
      fechaHasta: new Date('2026-11-30T23:59:59.999Z'),
    };

    await service.obtenerEstadisticas('perfil-1', filtros);

    expect(obtenerMovimientos).toHaveBeenCalledWith(
      'perfil-1',
      filtros
    );

    expect(obtenerTotalesPorCategoria).toHaveBeenCalledWith(
      'perfil-1',
      filtros
    );

    expect(obtenerTotalesMensuales).toHaveBeenCalledWith(
      'perfil-1',
      filtros
    );
  });

  it('mantiene separadas las estadísticas de distintas monedas', async () => {
    const movimientos = [
      crearMovimiento(
        100000,
        'INGRESO',
        'sueldo',
        'Sueldo'
      ),
      crearMovimiento(
        500,
        'INGRESO',
        'sueldo',
        'Sueldo',
        '2026-11-05T12:00:00Z',
        'moneda-usd',
        'USD'
      ),
    ];

    const { service } = preparar(movimientos);

    const resultado = await service.obtenerEstadisticas('perfil-1');

    expect(resultado.estadisticasPorMoneda).toHaveLength(2);

    expect(
      resultado.estadisticasPorMoneda.map((moneda) => moneda.codigoMoneda)
    ).toEqual(['ARS', 'USD']);
  });
});
