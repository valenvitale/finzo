import { describe, expect, it, vi } from 'vitest';
import { ResumenService } from '../../src/services/resumen.service.js';
import type { IMovimientoRepository } from '../../src/repositories/movimiento.repository.js';
import type { IMonedaRepository } from '../../src/repositories/moneda.repository.js';
import type { MovimientoResponseDTO } from '../../src/types/movimiento.types.js';
import { ErrorDeConflicto } from '../../src/errors/errores.js';

describe('ResumenService', () => {
  const crearMovimiento = (
    monto: number,
    tipo: 'INGRESO' | 'GASTO'
  ): MovimientoResponseDTO => ({
    id: crypto.randomUUID(),
    fecha: new Date('2026-10-14T12:00:00Z'),
    monto,
    descripcion: 'Movimiento de prueba',
    perfilId: 'perfil-1',
    monedaId: 'moneda-ars',
    categoriaId: 'categoria-1',
    medioPagoId: 'medio-1',
    tipo,
    createdAt: new Date('2026-10-14T12:00:00Z'),
    updatedAt: new Date('2026-10-14T12:00:00Z'),
  });

  function preparar(
    movimientos: MovimientoResponseDTO[] = [],
    tieneMonedaPrincipal = true
  ) {
    const listarMovimientos = vi.fn().mockResolvedValue(movimientos);

    const movimientoRepository = {
      listarPorPerfil: listarMovimientos,
    } as unknown as IMovimientoRepository;

    const listarMonedas = vi.fn().mockResolvedValue(
      tieneMonedaPrincipal
        ? [{
            id: 'moneda-ars',
            nombre: 'Peso Argentino',
            codigo: 'ARS',
            simbolo: '$',
            esPrincipal: true,
          }]
        : []
    );

    const monedaRepository = {
      listarPorPerfil: listarMonedas,
    } as unknown as IMonedaRepository;

    const service = new ResumenService(
      movimientoRepository,
      monedaRepository
    );

    return { service, listarMovimientos, listarMonedas };
  }

  it('calcula correctamente ingresos, gastos y balance', async () => {
    const movimientos = [
      crearMovimiento(100000, 'INGRESO'),
      crearMovimiento(35000, 'GASTO'),
      crearMovimiento(20000, 'INGRESO'),
    ];

    const { service } = preparar(movimientos);

    const resultado = await service.obtenerResumen('perfil-1', 10, 2026);

    expect(resultado).toEqual({
      totalIngresos: 120000,
      totalGastos: 35000,
      balance: 85000,
      moneda: 'ARS',
    });
  });

  it('devuelve valores en cero cuando no hay movimientos', async () => {
    const { service } = preparar([]);

    const resultado = await service.obtenerResumen('perfil-1', 10, 2026);

    expect(resultado).toEqual({
      totalIngresos: 0,
      totalGastos: 0,
      balance: 0,
      moneda: 'ARS',
    });
  });

  it('consulta los movimientos del perfil, mes, año y moneda principal', async () => {
    const { service, listarMovimientos } = preparar([]);

    await service.obtenerResumen('perfil-1', 10, 2026);

    expect(listarMovimientos).toHaveBeenCalledWith('perfil-1', {
      mes: 10,
      anio: 2026,
      monedaId: 'moneda-ars',
    });
  });

  it('utiliza el mes y año actuales cuando no se especifican', async () => {
    const { service, listarMovimientos } = preparar([]);
    const hoy = new Date();

    await service.obtenerResumen('perfil-1');

    expect(listarMovimientos).toHaveBeenCalledWith('perfil-1', {
      mes: hoy.getMonth() + 1,
      anio: hoy.getFullYear(),
      monedaId: 'moneda-ars',
    });
  });

  it('lanza ErrorDeConflicto cuando no hay moneda principal', async () => {
    const { service, listarMovimientos } = preparar([], false);

    await expect(
      service.obtenerResumen('perfil-1', 10, 2026)
    ).rejects.toThrow(ErrorDeConflicto);

    expect(listarMovimientos).not.toHaveBeenCalled();
  });
});
