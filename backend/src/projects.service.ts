import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { HistoryService } from './history.service';

export interface BusquedaProyectos {
  name?: string;
  status?: string;
  sort?: string;
  dir?: string;
  page?: string;
  limit?: string;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private proyectos: Repository<Project>,
    @InjectRepository(Client)
    private clientes: Repository<Client>,
    @InjectRepository(Task)
    private tareas: Repository<Task>,
    private historial: HistoryService,
  ) {}

  private armarWhere(query: BusquedaProyectos) {
    const where: any = {};
    if (query.name) where.name = ILike('%' + query.name + '%');
    if (query.status) where.status = query.status;
    return where;
  }

  private armarOrden(query: BusquedaProyectos) {
    const campos = ['id', 'name', 'status'];
    const sort = campos.includes(query.sort || '') ? query.sort! : 'name';
    const dir = query.dir === 'DESC' ? 'DESC' : 'ASC';
    return { [sort]: dir };
  }

  async buscar(query: BusquedaProyectos) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const [data, total] = await this.proyectos.findAndCount({
      where: this.armarWhere(query),
      relations: { client: true },
      order: this.armarOrden(query),
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  exportar(query: BusquedaProyectos) {
    return this.proyectos.find({
      where: this.armarWhere(query),
      relations: { client: true },
      order: this.armarOrden(query),
    });
  }

  async getById(id: number) {
    const p = await this.proyectos.findOne({
      where: { id },
      relations: { client: true, tasks: true },
    });
    if (!p) throw new NotFoundException('Proyecto no encontrado');
    return p;
  }

  async crear(body: { name: string; status?: string; clientId?: number | null }, username: string) {
    const clientId = await this.buscarCliente(body.clientId);
    const p = await this.proyectos.save({
      name: body.name,
      status: body.status || 'ACTIVO',
      clientId,
    });
    await this.historial.registrar('PROYECTO', p.id, 'ALTA', `Alta de proyecto "${p.name}"`, username);
    return p;
  }

  async actualizar(
    id: number,
    body: { name?: string; status?: string; clientId?: number | null },
    username: string,
  ) {
    const p = await this.getById(id);

    const cambios: string[] = [];
    if (body.name && body.name !== p.name) {
      cambios.push(`nombre "${p.name}" -> "${body.name}"`);
      p.name = body.name;
    }
    if (body.status && body.status !== p.status) {
      cambios.push(`estado ${p.status} -> ${body.status}`);
      p.status = body.status;
    }
    if (body.clientId !== undefined) {
      const nuevo = await this.buscarCliente(body.clientId);
      if (nuevo !== p.clientId) {
        cambios.push(`cliente ${p.clientId || 'interno'} -> ${nuevo || 'interno'}`);
        p.clientId = nuevo;
      }
    }

    const guardado = await this.proyectos.save(p);
    if (cambios.length > 0) {
      const accion = body.status === 'BAJA' ? 'BAJA' : 'MODIFICACION';
      await this.historial.registrar('PROYECTO', id, accion, cambios.join(', '), username);
    }
    return guardado;
  }

  async crearTarea(projectId: number, description: string, status = 'PENDIENTE', username: string) {
    await this.getById(projectId);
    const t = await this.tareas.save({ projectId, description, status });
    await this.historial.registrar('TAREA', t.id, 'ALTA', `Alta de tarea "${t.description}"`, username);
    return t;
  }

  async editarTarea(id: number, data: { description?: string; status?: string }, username: string) {
    const t = await this.tareas.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Tarea no encontrada');

    const cambios: string[] = [];
    if (data.description && data.description !== t.description) {
      cambios.push(`descripcion "${t.description}" -> "${data.description}"`);
      t.description = data.description;
    }
    if (data.status && data.status !== t.status) {
      cambios.push(`estado ${t.status} -> ${data.status}`);
      t.status = data.status;
    }

    const guardado = await this.tareas.save(t);
    if (cambios.length > 0) {
      const accion = data.status === 'BAJA' ? 'BAJA' : 'MODIFICACION';
      await this.historial.registrar('TAREA', id, accion, cambios.join(', '), username);
    }
    return guardado;
  }

  async borrarTarea(id: number, username: string) {
    const t = await this.tareas.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Tarea no encontrada');
    await this.tareas.remove(t);
    await this.historial.registrar('TAREA', id, 'ELIMINACION', `Se borro la tarea "${t.description}"`, username);
    return { ok: true };
  }

  async obtenerTableroTareas() {
    const tareas = await this.tareas.find({
      relations: { project: true },
    });

    const tablero = {
      PENDIENTE: tareas.filter((t) => t.status === 'PENDIENTE'),
      FINALIZADO: tareas.filter((t) => t.status === 'FINALIZADO'),
      BAJA: tareas.filter((t) => t.status === 'BAJA'),
    };

    return tablero;
  }

  private async buscarCliente(clientId?: number | null) {
    if (!clientId) return null;
    const c = await this.clientes.findOne({ where: { id: clientId } });
    if (!c) throw new NotFoundException('Cliente no encontrado');
    if (c.status !== 'ACTIVO') throw new NotFoundException('El cliente no esta activo');
    return c.id;
  }
}
