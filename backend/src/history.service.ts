import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntry } from './entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntry)
    private historial: Repository<HistoryEntry>,
  ) {}

  registrar(entity: string, entityId: number, action: string, detail: string, username: string) {
    return this.historial.save({ entity, entityId, action, detail, username });
  }

  async listar(query: { entity?: string; page?: string; limit?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const where: any = {};
    if (query.entity) where.entity = query.entity;

    const [data, total] = await this.historial.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }
}
