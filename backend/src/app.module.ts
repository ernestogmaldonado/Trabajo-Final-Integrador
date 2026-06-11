import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { HistoryEntry } from './entities/history.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { JwtGuard } from './jwt.guard';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gestion_proyectos',
      entities: [User, Client, Project, Task, HistoryEntry],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Client, Project, Task, HistoryEntry]),
    JwtModule.register({
      secret: 'clave-secreta-tp-final',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController, ClientsController, ProjectsController, HistoryController],
  providers: [AuthService, ClientsService, ProjectsService, HistoryService, JwtGuard],
})
export class AppModule {}
