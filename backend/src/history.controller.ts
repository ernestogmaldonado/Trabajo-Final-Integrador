import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtGuard } from './jwt.guard';

@Controller('history')
@UseGuards(JwtGuard)
export class HistoryController {
  constructor(private svc: HistoryService) {}

  @Get()
  listar(@Query() query: { entity?: string; page?: string; limit?: string }) {
    return this.svc.listar(query);
  }
}
