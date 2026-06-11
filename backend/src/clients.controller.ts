import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import type { BusquedaClientes } from './clients.service';
import { armarCsv } from './csv';
import { JwtGuard } from './jwt.guard';

@Controller('clients')
@UseGuards(JwtGuard)
export class ClientsController {
  constructor(private svc: ClientsService) {}

  @Get()
  listar(@Query() query: BusquedaClientes) {
    return this.svc.buscar(query);
  }

  @Get('active')
  activos() {
    return this.svc.getActivos();
  }

  @Get('export')
  async exportar(@Query() query: BusquedaClientes, @Res() res: any) {
    const lista = await this.svc.exportar(query);
    const csv = armarCsv(
      ['ID', 'Nombre', 'Estado'],
      lista.map((c) => [c.id, c.name, c.status]),
    );
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', 'attachment; filename=clientes.csv');
    res.send(csv);
  }

  @Post()
  crear(@Body() body: { name: string; status?: string }, @Req() req: any) {
    return this.svc.crear(body.name, body.status, req.user.username);
  }

  @Patch(':id')
  editar(
    @Param('id') id: string,
    @Body() body: { name?: string; status?: string },
    @Req() req: any,
  ) {
    return this.svc.actualizar(Number(id), body, req.user.username);
  }
}
