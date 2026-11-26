import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorDeConflicto, ErrorProhibido } from '../../src/errors/errores.js';
import type { IPresupuestoRepository } from '../../src/repositories/presupuesto.repository.js';
import type { PresupuestoDTO } from '../../src/types/presupuesto.types.js';
import { PresupuestoService } from '../../src/services/presupuesto.service.js';

const moneda = { id: 'moneda-1', codigo: 'ARS', simbolo: '$' };
const presupuesto: PresupuestoDTO = {
  id: 'presupuesto-1',
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
      moneda: { codigo: 'ARS', simbolo: '$' },
      totalLimiteMensual: 10000,
      totalGastado: 7500,
      totalDisponible: 2500,
      porcentajeUsado: 75,
    });
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
        limiteMensual: 10000,
        mes: 5,
        anio: 2026,
      })
    ).rejects.toBeInstanceOf(ErrorProhibido);
    expect(repository.crear).not.toHaveBeenCalled();
  });
});
