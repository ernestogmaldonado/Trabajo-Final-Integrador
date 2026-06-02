import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtGuard } from './jwt.guard';

@Controller('clients')
@UseGuards(JwtGuard)
export class ClientsController {
  constructor(private svc: ClientsService) {}

  @Get()
  listar() {
    return this.svc.getAll();
  }

  @Get('active')
  activos() {
    return this.svc.getActivos();
  }

  @Post()
  crear(@Body() body: { name: string; status?: string }) {
    return this.svc.crear(body.name, body.status);
  }

  @Patch(':id')
  editar(@Param('id') id: string, @Body() body: { name?: string; status?: string }) {
    return this.svc.actualizar(Number(id), body);
  }
}
