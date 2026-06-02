import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { ProjectsService } from './projects.service';

@Controller()
@UseGuards(JwtGuard)
export class ProjectsController {
  constructor(private svc: ProjectsService) {}

  @Get('projects')
  listarProyectos() {
    return this.svc.getAll();
  }

  @Get('projects/:id')
  verProyecto(@Param('id') id: string) {
    return this.svc.getById(Number(id));
  }

  @Post('projects')
  crearProyecto(@Body() body: { name: string; status?: string; clientId?: number | null }) {
    return this.svc.crear(body);
  }

  @Patch('projects/:id')
  editarProyecto(
    @Param('id') id: string,
    @Body() body: { name?: string; status?: string; clientId?: number | null },
  ) {
    return this.svc.actualizar(Number(id), body);
  }

  @Post('projects/:projectId/tasks')
  crearTarea(
    @Param('projectId') projectId: string,
    @Body() body: { description: string; status?: string },
  ) {
    return this.svc.crearTarea(Number(projectId), body.description, body.status);
  }

  @Patch('tasks/:id')
  editarTarea(
    @Param('id') id: string,
    @Body() body: { description?: string; status?: string },
  ) {
    return this.svc.editarTarea(Number(id), body);
  }

  @Delete('tasks/:id')
  borrarTarea(@Param('id') id: string) {
    return this.svc.borrarTarea(Number(id));
  }
}
