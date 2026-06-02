import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Proyectos</h2>
    <a routerLink="/proyectos/nuevo">+ Nuevo proyecto</a>
    <br /><br />
    <table border="1" cellpadding="8" cellspacing="0" width="100%">
      <tr>
        <th>Nombre</th>
        <th>Estado</th>
        <th>Cliente</th>
        <th></th>
      </tr>
      @for (p of lista; track p.id) {
        <tr>
          <td>{{ p.name }}</td>
          <td>{{ p.status }}</td>
          <td>{{ p.client ? p.client.name : 'Interno' }}</td>
          <td>
            <a [routerLink]="['/proyectos', p.id]">Ver</a>
            <a [routerLink]="['/proyectos', p.id, 'editar']">Editar</a>
          </td>
        </tr>
      }
    </table>
  `,
})
export class ProyectosComponent implements OnInit {
  lista: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getProyectos().subscribe((data) => (this.lista = data));
  }
}
