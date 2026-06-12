import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
@UseGuards(JwtGuard)
export class EstadisticasController {
  constructor(private estadisticasService: EstadisticasService) {}

  @Get()
  async obtenerEstadisticas() {
    return await this.estadisticasService.obtenerEstadisticas();
  }
}
