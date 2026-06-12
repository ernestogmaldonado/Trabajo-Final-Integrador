import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <b>Gestion de Proyectos</b> - {{ user }}
      <a routerLink="/proyectos">Proyectos</a>
      <a routerLink="/clientes">Clientes</a>
      <a routerLink="/historial">Historial</a>
      <a routerLink="/estadisticas">Estadísticas</a>
      <a routerLink="/tablero-tareas">Tablero de Tareas</a>
      <button (click)="salir()">Salir</button>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      header {
        background: #333;
        color: #fff;
        padding: 12px;
      }
      header a {
        color: #fff;
        margin-left: 15px;
      }
      button {
        float: right;
      }
      main {
        padding: 20px;
      }
    `,
  ],
})
export class LayoutComponent {
  user = localStorage.getItem('user') || '';

  salir() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    location.href = '/login';
  }
}
