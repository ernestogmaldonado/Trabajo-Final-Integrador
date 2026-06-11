import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <h2>Historial de cambios</h2>
    <p>
      Entidad:
      <select [(ngModel)]="filtroEntidad" (change)="filtrar()">
        <option value="">Todas</option>
        <option>CLIENTE</option>
        <option>PROYECTO</option>
        <option>TAREA</option>
      </select>
    </p>
    <table border="1" cellpadding="6" width="100%">
      <tr>
        <th>Fecha</th>
        <th>Usuario</th>
        <th>Entidad</th>
        <th>Accion</th>
        <th>Detalle</th>
      </tr>
      @for (h of lista; track h.id) {
        <tr>
          <td>{{ h.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
          <td>{{ h.username }}</td>
          <td>{{ h.entity }} #{{ h.entityId }}</td>
          <td>{{ h.action }}</td>
          <td>{{ h.detail }}</td>
        </tr>
      }
      @if (lista.length === 0) {
        <tr><td colspan="5">Sin registros</td></tr>
      }
    </table>
    <p>
      <button (click)="irPagina(pagina - 1)" [disabled]="pagina <= 1">Anterior</button>
      Pagina {{ pagina }} de {{ totalPaginas() }} ({{ total }} registros)
      <button (click)="irPagina(pagina + 1)" [disabled]="pagina >= totalPaginas()">Siguiente</button>
    </p>
  `,
})
export class HistorialComponent implements OnInit {
  lista: any[] = [];
  total = 0;
  pagina = 1;
  porPagina = 10;
  filtroEntidad = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.api
      .getHistorial({ entity: this.filtroEntidad, page: this.pagina, limit: this.porPagina })
      .subscribe((r) => {
        this.lista = r.data;
        this.total = r.total;
      });
  }

  filtrar() {
    this.pagina = 1;
    this.cargar();
  }

  totalPaginas() {
    return Math.max(1, Math.ceil(this.total / this.porPagina));
  }

  irPagina(p: number) {
    this.pagina = p;
    this.cargar();
  }
}
