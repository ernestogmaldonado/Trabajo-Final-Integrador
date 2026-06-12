import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { armarCsv } from './csv';
import { JwtGuard } from './jwt.guard';
import { ProjectsService } from './projects.service';
import type { BusquedaProyectos } from './projects.service';

@Controller()
@UseGuards(JwtGuard)
export class ProjectsController {
  constructor(private svc: ProjectsService) {}

  // solo un admin puede dar de baja proyectos o tareas
  private soloAdmin(req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Necesita rol de administrador para esta accion');
    }
  }

  @Get('projects')
  listarProyectos(@Query() query: BusquedaProyectos) {
    return this.svc.buscar(query);
  }

  @Get('tasks/board')
  obtenerTableroTareas() {
    return this.svc.obtenerTableroTareas();
  }

  @Get('projects/export')
  async exportar(@Query() query: BusquedaProyectos, @Res() res: any) {
    const lista = await this.svc.exportar(query);
    const csv = armarCsv(
      ['ID', 'Nombre', 'Estado', 'Cliente'],
      lista.map((p) => [p.id, p.name, p.status, p.client ? p.client.name : 'Interno']),
    );
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', 'attachment; filename=proyectos.csv');
    res.send(csv);
  }

  @Get('projects/:id')
  verProyecto(@Param('id') id: string) {
    return this.svc.getById(Number(id));
  }

  @Post('projects')
  crearProyecto(
    @Body() body: { name: string; status?: string; clientId?: number | null },
    @Req() req: any,
  ) {
    return this.svc.crear(body, req.user.username);
  }

  @Patch('projects/:id')
  editarProyecto(
    @Param('id') id: string,
    @Body() body: { name?: string; status?: string; clientId?: number | null },
    @Req() req: any,
  ) {
    if (body.status === 'BAJA') this.soloAdmin(req);
    return this.svc.actualizar(Number(id), body, req.user.username);
  }

  @Post('projects/:projectId/tasks')
  crearTarea(
    @Param('projectId') projectId: string,
    @Body() body: { description: string; status?: string },
    @Req() req: any,
  ) {
    return this.svc.crearTarea(Number(projectId), body.description, body.status, req.user.username);
  }

  @Patch('tasks/:id')
  editarTarea(
    @Param('id') id: string,
    @Body() body: { description?: string; status?: string },
    @Req() req: any,
  ) {
    if (body.status === 'BAJA') this.soloAdmin(req);
    return this.svc.editarTarea(Number(id), body, req.user.username);
  }

  @Delete('tasks/:id')
  borrarTarea(@Param('id') id: string, @Req() req: any) {
    this.soloAdmin(req);
    return this.svc.borrarTarea(Number(id), req.user.username);
  }
}
