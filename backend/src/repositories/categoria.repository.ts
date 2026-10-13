import { PrismaClient, Prisma } from '@prisma/client';
import { prisma as prismaSingleton } from '../config/prisma.js';
import { CrearCategoriaDTO, ActualizarCategoriaDTO, CategoriaResponseDTO } from '../types/categoria.types.js';

export interface ICategoriaRepository {
  crear(perfilId: string, datosCategoria: CrearCategoriaDTO): Promise<CategoriaResponseDTO>;
  actualizar(id: string, datosActualizacion: ActualizarCategoriaDTO): Promise<CategoriaResponseDTO>;
  eliminar(id: string): Promise<void>;
  obtenerPorId(id: string): Promise<CategoriaResponseDTO | null>;
  listarPorPerfil(perfilId: string): Promise<CategoriaResponseDTO[]>;
  contarPersonalizadasPorPerfil(perfilId: string): Promise<number>;
  contarMovimientosAsociados(categoriaId: string): Promise<number>;
}

type CategoriaPrisma = Prisma.CategoriaGetPayload<Record<string, never>>;

export class CategoriaRepository implements ICategoriaRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prismaSingleton) {
    this.prisma = prismaClient;
  }

  // Mapper reutilizable para todos los metodos CRUD de Categorías
  private mapearADto(categoria: CategoriaPrisma): CategoriaResponseDTO {
    return {
      id: categoria.id,
      nombre: categoria.nombre,
      color: categoria.color,
      tipo: categoria.tipo,
      perfilId: categoria.id_perfil,
      createdAt: categoria.created_at,
      updatedAt: categoria.updated_at,
    };
  }

  // Crea una categoria en BD y devuelve la creacion como DTO
  async crear(perfilId: string, datosCategoria: CrearCategoriaDTO): Promise<CategoriaResponseDTO> {
    const nuevaCategoria = await this.prisma.categoria.create({
      data: {
        id_perfil: perfilId,
        nombre: datosCategoria.nombre,
        color: datosCategoria.color,
        tipo: datosCategoria.tipo,
      },
    });

    return this.mapearADto(nuevaCategoria);
  }

  // Actualiza una categoria existente
  async actualizar(id: string, datosActualizacion: ActualizarCategoriaDTO): Promise<CategoriaResponseDTO> {
    const categoriaActualizada = await this.prisma.categoria.update({
      where: { id },
      data: {
        nombre: datosActualizacion.nombre,
        color: datosActualizacion.color,
        tipo: datosActualizacion.tipo,
      },
    });

    return this.mapearADto(categoriaActualizada);
  }

  // Elimina una categoria
  async eliminar(id: string): Promise<void> {
    await this.prisma.categoria.delete({
      where: { id },
    });
  }

  // Obtener toda la informacion de la categoria por id de categoria
  async obtenerPorId(id: string): Promise<CategoriaResponseDTO | null> {
    const categoriaSolicitada = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoriaSolicitada) {
      return null;
    }
    return this.mapearADto(categoriaSolicitada);
  }

  // Lista categorias globales y personalizadas del perfil
  async listarPorPerfil(perfilId: string): Promise<CategoriaResponseDTO[]> {
    const categorias = await this.prisma.categoria.findMany({
      where: {
        OR: [{ id_perfil: null }, { id_perfil: perfilId }],
      },
      orderBy: [{ nombre: 'asc' }, { id: 'asc' }],
    });
    return categorias.map((c) => this.mapearADto(c));
  }

  // Cuenta la cantidad de categorias personalizadas creadas por un perfil
  async contarPersonalizadasPorPerfil(perfilId: string): Promise<number> {
    return this.prisma.categoria.count({
      where: { id_perfil: perfilId },
    });
  }

  // Cuenta la cantidad de movimientos asociados a una categoria
  async contarMovimientosAsociados(categoriaId: string): Promise<number> {
    return this.prisma.movimiento.count({
      where: { id_categoria: categoriaId },
    });
  }
}
