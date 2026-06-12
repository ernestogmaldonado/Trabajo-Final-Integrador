import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Estadísticas</h2>
    @if (cargando) {
      <p>Cargando estadísticas...</p>
    }
    @if (error) {
      <p style="color:red">{{ error }}</p>
    }
    @if (estadisticas && !cargando) {
      <button (click)="cargarEstadisticas()">Refrescar</button>
      <hr />
      
      <h3>Resumen General</h3>
      <table border="1" cellpadding="6" width="100%">
        <tr>
          <td><b>Total de Proyectos:</b></td>
          <td>{{ estadisticas.totalProyectos }}</td>
        </tr>
        <tr>
          <td><b>Proyectos Activos:</b></td>
          <td>{{ estadisticas.proyectosActivos }}</td>
        </tr>
        <tr>
          <td><b>Proyectos Inactivos:</b></td>
          <td>{{ estadisticas.proyectosInactivos }}</td>
        </tr>
        <tr>
          <td><b>Total de Clientes:</b></td>
          <td>{{ estadisticas.totalClientes }}</td>
        </tr>
        <tr>
          <td><b>Total de Tareas:</b></td>
          <td>{{ estadisticas.totalTareas }}</td>
        </tr>
        <tr>
          <td><b>Tareas Completadas:</b></td>
          <td>{{ estadisticas.tareasCompletadas }}</td>
        </tr>
        <tr>
          <td><b>Tareas Pendientes:</b></td>
          <td>{{ estadisticas.tareasPendientes }}</td>
        </tr>
        <tr>
          <td><b>Porcentaje Completado:</b></td>
          <td>{{ estadisticas.porcentajeTareasCompletadas }}%</td>
        </tr>
      </table>

      <hr />
      <h3>Proyectos por Cliente</h3>
      <table border="1" cellpadding="6" width="100%">
        <tr>
          <th>Cliente</th>
          <th>Cantidad de Proyectos</th>
        </tr>
        @for (item of estadisticas.proyectosPorCliente; track item.cliente) {
          <tr>
            <td>{{ item.cliente }}</td>
            <td>{{ item.cantidad }}</td>
          </tr>
        }
        @if (estadisticas.proyectosPorCliente.length === 0) {
          <tr><td colspan="2">Sin datos</td></tr>
        }
      </table>
    }
  `,
})
export class EstadisticasComponent implements OnInit {
  estadisticas: any = null;
  cargando = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.cargando = true;
    this.error = '';
    this.api.getEstadisticas().subscribe({
      next: (datos) => {
        this.estadisticas = datos;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar estadísticas';
        this.cargando = false;
        console.error(err);
      },
    });
  }
}
