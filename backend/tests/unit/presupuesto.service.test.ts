import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorDeConflicto, ErrorProhibido } from '../../src/errors/errores.js';
import type { IPresupuestoRepository } from '../../src/repositories/presupuesto.repository.js';
import type { PresupuestoDTO } from '../../src/types/presupuesto.types.js';
import { PresupuestoService } from '../../src/services/presupuesto.service.js';

const moneda = { id: 'moneda-1', codigo: 'ARS', simbolo: '$' };
const presupuesto: PresupuestoDTO = {
  id: 'presupuesto-1',
  monedaId: 'moneda-1',
  categoriaId: 'categoria-1',
  categoriaNombre: 'Comida',
  categoriaColor: '#A1B2C3',
  limiteMensual: 10000,
  gastoActual: 7500,
  disponible: 2500,
  porcentajeUsado: 75,
  mes: 5,
  anio: 2026,
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

function crearRepositorio(): IPresupuestoRepository {
  return {
    obtenerCategoria: vi.fn().mockResolvedValue({
      id: 'categoria-1',
      nombre: 'Comida',
      color: '#A1B2C3',
      tipo: 'GASTO',
      perfilId: null,
    }),
    obtenerMonedaPrincipal: vi.fn().mockResolvedValue(moneda),
    listarPorPeriodo: vi.fn().mockResolvedValue([presupuesto]),
    crear: vi.fn().mockResolvedValue(presupuesto),
    obtenerPorId: vi.fn().mockResolvedValue(presupuesto),
    actualizar: vi.fn().mockResolvedValue(presupuesto),
    eliminar: vi.fn().mockResolvedValue(undefined),
    obtenerMeta: vi.fn().mockResolvedValue(10000),
    guardarMeta: vi.fn().mockResolvedValue(undefined),
    obtenerAhorro: vi.fn().mockResolvedValue(4000),
  };
}

describe('PresupuestoService', () => {
  let repository: IPresupuestoRepository;
  let service: PresupuestoService;

  beforeEach(() => {
    repository = crearRepositorio();
    service = new PresupuestoService(repository);
  });

  it('resume presupuestos y conserva la moneda principal del perfil', async () => {
    const resumen = await service.listarPorPeriodo('perfil-1', 5, 2026);

    expect(repository.listarPorPeriodo).toHaveBeenCalledWith('perfil-1', 5, 2026, 'moneda-1');
    expect(resumen).toMatchObject({
      mes: 5,
      anio: 2026,
      moneda: { id: 'moneda-1', codigo: 'ARS', simbolo: '$' },
      totalLimiteMensual: 10000,
      totalGastado: 7500,
      totalDisponible: 2500,
      porcentajeUsado: 75,
      metaAhorro: { monto: 10000, ahorroActual: 4000, porcentajeCumplido: 40 },
    });
  });

  it('guarda la meta en la moneda principal y el período elegido', async () => {
    await service.guardarMeta('perfil-1', 'moneda-1', 5, 2026, 10000);
    expect(repository.guardarMeta).toHaveBeenCalledWith('perfil-1', 'moneda-1', 5, 2026, 10000);
  });

  it('rechaza una meta si cambió la moneda principal', async () => {
    await expect(service.guardarMeta('perfil-1', 'otra-moneda', 5, 2026, 10000)).rejects.toBeInstanceOf(
      ErrorDeConflicto
    );
    expect(repository.guardarMeta).not.toHaveBeenCalled();
  });

  it('rechaza crear un presupuesto si cambió la moneda principal', async () => {
    await expect(
      service.crear('perfil-1', {
        categoriaId: 'categoria-1',
        monedaId: 'otra-moneda',
        limiteMensual: 500,
        mes: 5,
        anio: 2026,
      })
    ).rejects.toBeInstanceOf(ErrorDeConflicto);
    expect(repository.crear).not.toHaveBeenCalled();
  });

  it('no muestra un porcentaje negativo si los gastos superan los ingresos', async () => {
    vi.mocked(repository.obtenerAhorro).mockResolvedValue(-500);
    const resumen = await service.listarPorPeriodo('perfil-1', 5, 2026);
    expect(resumen.metaAhorro).toEqual({ monto: 10000, ahorroActual: -500, porcentajeCumplido: 0 });
  });

  it('no modifica un presupuesto de otra moneda', async () => {
    vi.mocked(repository.obtenerPorId).mockResolvedValue({ ...presupuesto, monedaId: 'otra-moneda' });
    await expect(service.actualizar('presupuesto-1', 'perfil-1', { limiteMensual: 500 })).rejects.toBeInstanceOf(
      ErrorDeConflicto
    );
    expect(repository.actualizar).not.toHaveBeenCalled();
  });

  it('rechaza consultas que envían solo una parte del período', async () => {
    await expect(service.listarPorPeriodo('perfil-1', 5)).rejects.toBeInstanceOf(ErrorDeConflicto);
    expect(repository.obtenerMonedaPrincipal).not.toHaveBeenCalled();
  });

  it('rechaza presupuestos para categorías de ingreso', async () => {
    vi.mocked(repository.obtenerCategoria).mockResolvedValue({
      id: 'categoria-1',
      nombre: 'Sueldo',
      color: '#A1B2C3',
      tipo: 'INGRESO',
      perfilId: null,
    });

    await expect(
      service.crear('perfil-1', {
        categoriaId: 'categoria-1',
        monedaId: 'moneda-1',
        limiteMensual: 10000,
        mes: 5,
        anio: 2026,
      })
    ).rejects.toBeInstanceOf(ErrorDeConflicto);
    expect(repository.crear).not.toHaveBeenCalled();
  });

  it('impide usar categorías privadas de otro perfil', async () => {
    vi.mocked(repository.obtenerCategoria).mockResolvedValue({
      id: 'categoria-1',
      nombre: 'Privada',
      color: '#A1B2C3',
      tipo: 'GASTO',
      perfilId: 'otro-perfil',
    });

    await expect(
      service.crear('perfil-1', {
        categoriaId: 'categoria-1',
        monedaId: 'moneda-1',
        limiteMensual: 10000,
        mes: 5,
        anio: 2026,
      })
    ).rejects.toBeInstanceOf(ErrorProhibido);
    expect(repository.crear).not.toHaveBeenCalled();
  });
});
