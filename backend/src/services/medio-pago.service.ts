import type { IMedioPagoRepository } from '../repositories/medio-pago.repository.js';
import type { MedioPagoResponseDTO } from '../types/medio-pago.types.js';

export class MedioPagoService {
  constructor(private readonly medioPagoRepository: IMedioPagoRepository) {}

  async listarPorPerfil(idPerfil: string): Promise<MedioPagoResponseDTO[]> {
    const medios = await this.medioPagoRepository.listarPorPerfil(idPerfil);
    return medios.map((medio) => ({
      id: medio.id,
      nombre: medio.nombre,
      icono: medio.icono,
      id_perfil: medio.id_perfil,
      created_at: medio.created_at.toISOString(),
      updated_at: medio.updated_at.toISOString(),
    }));
  }
}
