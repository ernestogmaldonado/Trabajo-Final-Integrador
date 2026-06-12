import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Project)
    private proyectos: Repository<Project>,
    @InjectRepository(Client)
    private clientes: Repository<Client>,
    @InjectRepository(Task)
    private tareas: Repository<Task>,
  ) {}

  async obtenerEstadisticas() {
    const [
      totalProyectos,
      proyectosActivos,
      totalClientes,
      totalTareas,
      tareasCompletadas,
      tareasPendientes,
      proyectosPorCliente,
    ] = await Promise.all([
      this.proyectos.count(),
      this.proyectos.count({ where: { status: 'ACTIVO' } }),
      this.clientes.count(),
      this.tareas.count(),
      this.tareas.count({ where: { status: 'completada' } }),
      this.tareas.count({ where: { status: 'pendiente' } }),
      this.obtenerProyectosPorCliente(),
    ]);

    return {
      totalProyectos,
      proyectosActivos,
      proyectosInactivos: totalProyectos - proyectosActivos,
      totalClientes,
      totalTareas,
      tareasCompletadas,
      tareasPendientes,
      porcentajeTareasCompletadas:
        totalTareas > 0
          ? Math.round((tareasCompletadas / totalTareas) * 100)
          : 0,
      proyectosPorCliente,
    };
  }

  private async obtenerProyectosPorCliente() {
    const resultado = await this.proyectos
      .createQueryBuilder('p')
      .leftJoin('p.client', 'c')
      .select('c.name', 'cliente')
      .addSelect('COUNT(p.id)', 'cantidad')
      .groupBy('c.id')
      .addGroupBy('c.name')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    return resultado.map((r) => ({
      cliente: r.cliente || 'Proyectos Internos',
      cantidad: parseInt(r.cantidad),
    }));
  }
}
