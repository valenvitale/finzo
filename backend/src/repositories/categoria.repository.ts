import type { PrismaClient } from '@prisma/client';
import type { Categoria, TipoMovimiento } from '../models/categoria.model.js';

export interface CrearCategoriaDatos {
    nombre: string;
    color: string;
    tipo: TipoMovimiento;
}

export interface ActualizarCategoriaDatos {
    nombre?: string;
    color?: string;
    tipo?: TipoMovimiento;
}

export interface ICategoriaRepository {
    listar(idPerfil: string): Promise<Categoria[]>;
    buscarPorId(id: string): Promise<Categoria | null>;
    contarPersonalizadasPorUsuario(idPerfil: string): Promise<number>;
    contarMovimientosAsociados(idCategoria: string): Promise<number>;
    crear(idPerfil: string, datos: CrearCategoriaDatos): Promise<Categoria>;
    actualizar(id: string, datos: ActualizarCategoriaDatos): Promise<Categoria>;
    eliminar(id: string): Promise<void>;
}

export class CategoriaRepository implements ICategoriaRepository {
    constructor(private prisma: PrismaClient) {}

    listar(idPerfil: string): Promise<Categoria[]> {
        return this.prisma.categoria.findMany({
            where: {
                OR: [{id_perfil: null}, {id_perfil: idPerfil}],
            },
            orderBy: [{nombre: 'asc'}, {id: 'asc'}],
        });
    }

    buscarPorId(id: string): Promise<Categoria | null> {
        return this.prisma.categoria.findUnique({where: {id}});
    }

    contarPersonalizadasPorUsuario(idPerfil: string): Promise<number> {
        return this.prisma.categoria.count({where: {id_perfil: idPerfil}});
    }

    contarMovimientosAsociados(idCategoria: string): Promise<number> {
        return this.prisma.movimiento.count({where: {id_categoria: idCategoria}});
    }

    crear(idPerfil: string, datos: CrearCategoriaDatos): Promise<Categoria> {
        return this.prisma.categoria.create({
            data: {nombre: datos.nombre, color: datos.color, tipo: datos.tipo, id_perfil: idPerfil}
        });
    }

    actualizar(id: string, datos: ActualizarCategoriaDatos): Promise<Categoria> {
        return this.prisma.categoria.update({
            where: {id},
            data: {nombre: datos.nombre, color: datos.color, tipo: datos.tipo},
        });
    }

    async eliminar(id: string): Promise<void> {
        await this.prisma.categoria.delete({where: {id}});
    }
}
