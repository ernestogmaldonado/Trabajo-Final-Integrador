import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usuarios: Repository<User>,
    private jwt: JwtService,
  ) {}

  // al arrancar crea los usuarios de prueba
  async onModuleInit() {
    await this.crearUsuario('admin', 'admin123', 'ADMIN');
    await this.crearUsuario('usuario', 'usuario123', 'USUARIO');
  }

  private async crearUsuario(username: string, clave: string, role: string) {
    const existe = await this.usuarios.findOne({ where: { username } });
    if (!existe) {
      const pass = await bcrypt.hash(clave, 10);
      await this.usuarios.save({ username, password: pass, status: 'ACTIVO', role });
    } else if (existe.role !== role) {
      existe.role = role;
      await this.usuarios.save(existe);
    }
  }

  async login(username: string, password: string) {
    const user = await this.usuarios.findOne({ where: { username } });
    if (!user || user.status !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario o clave incorrectos');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Usuario o clave incorrectos');
    }

    const token = this.jwt.sign({ sub: user.id, username: user.username, role: user.role });
    return {
      accessToken: token,
      user: { id: user.id, username: user.username, status: user.status, role: user.role },
    };
  }
}
