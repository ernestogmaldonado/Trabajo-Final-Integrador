import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { HistoryService } from './history.service';

export interface BusquedaClientes {
  name?: string;
  status?: string;
  sort?: string;
  dir?: string;
  page?: string;
  limit?: string;
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientes: Repository<Client>,
    private historial: HistoryService,
  ) {}

  private armarWhere(query: BusquedaClientes) {
    const where: any = {};
    if (query.name) where.name = ILike('%' + query.name + '%');
    if (query.status) where.status = query.status;
    return where;
  }

  private armarOrden(query: BusquedaClientes) {
    const campos = ['id', 'name', 'status'];
    const sort = campos.includes(query.sort || '') ? query.sort! : 'name';
    const dir = query.dir === 'DESC' ? 'DESC' : 'ASC';
    return { [sort]: dir };
  }

  async buscar(query: BusquedaClientes) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const [data, total] = await this.clientes.findAndCount({
      where: this.armarWhere(query),
      order: this.armarOrden(query),
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  // para exportar: mismos filtros pero sin paginar
  exportar(query: BusquedaClientes) {
    return this.clientes.find({
      where: this.armarWhere(query),
      order: this.armarOrden(query),
    });
  }

  getActivos() {
    return this.clientes.find({ where: { status: 'ACTIVO' }, order: { name: 'ASC' } });
  }

  async crear(name: string, status = 'ACTIVO', username: string) {
    const c = await this.clientes.save({ name, status });
    await this.historial.registrar('CLIENTE', c.id, 'ALTA', `Alta de cliente "${c.name}"`, username);
    return c;
  }

  async actualizar(id: number, data: { name?: string; status?: string }, username: string) {
    const c = await this.clientes.findOne({ where: { id }, relations: { projects: true } });
    if (!c) throw new NotFoundException('Cliente no encontrado');

    if (data.status === 'BAJA' && c.projects && c.projects.length > 0) {
      throw new NotFoundException('No se puede dar de baja: tiene proyectos');
    }

    const cambios: string[] = [];
    if (data.name && data.name !== c.name) {
      cambios.push(`nombre "${c.name}" -> "${data.name}"`);
      c.name = data.name;
    }
    if (data.status && data.status !== c.status) {
      cambios.push(`estado ${c.status} -> ${data.status}`);
      c.status = data.status;
    }

    const guardado = await this.clientes.save(c);
    if (cambios.length > 0) {
      const accion = data.status === 'BAJA' ? 'BAJA' : 'MODIFICACION';
      await this.historial.registrar('CLIENTE', id, accion, cambios.join(', '), username);
    }
    return guardado;
  }
}
