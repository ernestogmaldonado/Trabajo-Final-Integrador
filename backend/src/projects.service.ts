import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private proyectos: Repository<Project>,
    @InjectRepository(Client)
    private clientes: Repository<Client>,
    @InjectRepository(Task)
    private tareas: Repository<Task>,
  ) {}

  getAll() {
    return this.proyectos.find({ relations: { client: true }, order: { name: 'ASC' } });
  }

  async getById(id: number) {
    const p = await this.proyectos.findOne({
      where: { id },
      relations: { client: true, tasks: true },
    });
    if (!p) throw new NotFoundException('Proyecto no encontrado');
    return p;
  }

  async crear(body: { name: string; status?: string; clientId?: number | null }) {
    const clientId = await this.buscarCliente(body.clientId);
    return this.proyectos.save({
      name: body.name,
      status: body.status || 'ACTIVO',
      clientId,
    });
  }

  async actualizar(
    id: number,
    body: { name?: string; status?: string; clientId?: number | null },
  ) {
    const p = await this.getById(id);
    if (body.name) p.name = body.name;
    if (body.status) p.status = body.status;
    if (body.clientId !== undefined) {
      p.clientId = await this.buscarCliente(body.clientId);
    }
    return this.proyectos.save(p);
  }

  async crearTarea(projectId: number, description: string, status = 'PENDIENTE') {
    await this.getById(projectId);
    return this.tareas.save({ projectId, description, status });
  }

  async editarTarea(id: number, data: { description?: string; status?: string }) {
    const t = await this.tareas.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Tarea no encontrada');
    if (data.description) t.description = data.description;
    if (data.status) t.status = data.status;
    return this.tareas.save(t);
  }

  async borrarTarea(id: number) {
    const t = await this.tareas.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Tarea no encontrada');
    await this.tareas.remove(t);
    return { ok: true };
  }

  private async buscarCliente(clientId?: number | null) {
    if (!clientId) return null;
    const c = await this.clientes.findOne({ where: { id: clientId } });
    if (!c) throw new NotFoundException('Cliente no encontrado');
    if (c.status !== 'ACTIVO') throw new NotFoundException('El cliente no esta activo');
    return c.id;
  }
}
