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

  // al arrancar crea el usuario admin
  async onModuleInit() {
    const existe = await this.usuarios.findOne({ where: { username: 'admin' } });
    if (!existe) {
      const pass = await bcrypt.hash('admin123', 10);
      await this.usuarios.save({ username: 'admin', password: pass, status: 'ACTIVO' });
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

    const token = this.jwt.sign({ sub: user.id, username: user.username });
    return {
      accessToken: token,
      user: { id: user.id, username: user.username, status: user.status },
    };
  }
}
