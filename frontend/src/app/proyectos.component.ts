import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <h2>Proyectos</h2>
    <a routerLink="/proyectos/nuevo">+ Nuevo proyecto</a>
    <br /><br />
    <p>
      Buscar: <input [(ngModel)]="filtroNombre" (input)="filtrar()" placeholder="nombre..." />
      Estado:
      <select [(ngModel)]="filtroEstado" (change)="filtrar()">
        <option value="">Todos</option>
        <option>ACTIVO</option>
        <option>FINALIZADO</option>
        <option>BAJA</option>
      </select>
      <button (click)="descargarCsv()">Descargar CSV</button>
    </p>
    <table border="1" cellpadding="8" cellspacing="0" width="100%">
      <tr>
        <th (click)="ordenarPor('name')" style="cursor:pointer">Nombre {{ flecha('name') }}</th>
        <th (click)="ordenarPor('status')" style="cursor:pointer">Estado {{ flecha('status') }}</th>
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
      @if (lista.length === 0) {
        <tr><td colspan="4">Sin resultados</td></tr>
      }
    </table>
    <p>
      <button (click)="irPagina(pagina - 1)" [disabled]="pagina <= 1">Anterior</button>
      Pagina {{ pagina }} de {{ totalPaginas() }} ({{ total }} proyectos)
      <button (click)="irPagina(pagina + 1)" [disabled]="pagina >= totalPaginas()">Siguiente</button>
    </p>
  `,
})
export class ProyectosComponent implements OnInit {
  lista: any[] = [];
  total = 0;
  pagina = 1;
  porPagina = 10;
  filtroNombre = '';
  filtroEstado = '';
  orden = 'name';
  dir = 'ASC';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargar();
  }

  private filtros() {
    return {
      name: this.filtroNombre,
      status: this.filtroEstado,
      sort: this.orden,
      dir: this.dir,
      page: this.pagina,
      limit: this.porPagina,
    };
  }

  cargar() {
    this.api.getProyectos(this.filtros()).subscribe((r) => {
      this.lista = r.data;
      this.total = r.total;
    });
  }

  filtrar() {
    this.pagina = 1;
    this.cargar();
  }

  ordenarPor(campo: string) {
    if (this.orden === campo) {
      this.dir = this.dir === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.orden = campo;
      this.dir = 'ASC';
    }
    this.cargar();
  }

  flecha(campo: string) {
    if (this.orden !== campo) return '';
    return this.dir === 'ASC' ? '▲' : '▼';
  }

  totalPaginas() {
    return Math.max(1, Math.ceil(this.total / this.porPagina));
  }

  irPagina(p: number) {
    this.pagina = p;
    this.cargar();
  }

  descargarCsv() {
    const filtros: any = this.filtros();
    delete filtros.page;
    delete filtros.limit;
    this.api.exportarProyectos(filtros).subscribe((blob) => {
      this.api.descargarArchivo(blob, 'proyectos.csv');
    });
  }
}
