import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientes: Repository<Client>,
  ) {}

  getAll() {
    return this.clientes.find({ order: { name: 'ASC' } });
  }

  getActivos() {
    return this.clientes.find({ where: { status: 'ACTIVO' }, order: { name: 'ASC' } });
  }

  crear(name: string, status = 'ACTIVO') {
    return this.clientes.save({ name, status });
  }

  async actualizar(id: number, data: { name?: string; status?: string }) {
    const c = await this.clientes.findOne({ where: { id }, relations: { projects: true } });
    if (!c) throw new NotFoundException('Cliente no encontrado');

    if (data.status === 'BAJA' && c.projects && c.projects.length > 0) {
      throw new NotFoundException('No se puede dar de baja: tiene proyectos');
    }

    if (data.name) c.name = data.name;
    if (data.status) c.status = data.status;
    return this.clientes.save(c);
  }
}
