import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-tablero-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Panel de Tareas</h2>
    <button (click)="cargar()">Refrescar</button>
    <hr />
    @if (cargando) {
      <p>Cargando tareas...</p>
    }
    @if (error) {
      <p style="color:red">{{ error }}</p>
    }
    @if (tablero && !cargando) {
      <div style="display: flex; gap: 20px; overflow-x: auto; padding: 10px 0;">
        <!-- Columna PENDIENTE -->
        <div style="flex: 0 0 300px; border: 1px solid #ccc; padding: 10px; background: #fffacd; border-radius: 4px;">
          <h3>PENDIENTE ({{ tablero.PENDIENTE.length }})</h3>
          <div style="min-height: 200px;">
            @for (tarea of tablero.PENDIENTE; track tarea.id) {
              <div style="background: white; border: 1px solid #ddd; padding: 8px; margin: 5px 0; border-radius: 4px; cursor: pointer;" (click)="verDetalles(tarea)">
                <b>{{ tarea.description }}</b><br />
                <small style="color: #666;">Proyecto: {{ tarea.project?.name || 'N/A' }}</small>
              </div>
            }
            @if (tablero.PENDIENTE.length === 0) {
              <p style="color: #999;">Sin tareas</p>
            }
          </div>
        </div>

        <!-- Columna FINALIZADO -->
        <div style="flex: 0 0 300px; border: 1px solid #ccc; padding: 10px; background: #e8f5e9; border-radius: 4px;">
          <h3>FINALIZADO ({{ tablero.FINALIZADO.length }})</h3>
          <div style="min-height: 200px;">
            @for (tarea of tablero.FINALIZADO; track tarea.id) {
              <div style="background: white; border: 1px solid #ddd; padding: 8px; margin: 5px 0; border-radius: 4px; cursor: pointer;" (click)="verDetalles(tarea)">
                <b>{{ tarea.description }}</b><br />
                <small style="color: #666;">Proyecto: {{ tarea.project?.name || 'N/A' }}</small>
              </div>
            }
            @if (tablero.FINALIZADO.length === 0) {
              <p style="color: #999;">Sin tareas</p>
            }
          </div>
        </div>

        <!-- Columna BAJA -->
        <div style="flex: 0 0 300px; border: 1px solid #ccc; padding: 10px; background: #ffebee; border-radius: 4px;">
          <h3>BAJA ({{ tablero.BAJA.length }})</h3>
          <div style="min-height: 200px;">
            @for (tarea of tablero.BAJA; track tarea.id) {
              <div style="background: white; border: 1px solid #ddd; padding: 8px; margin: 5px 0; border-radius: 4px; cursor: pointer;" (click)="verDetalles(tarea)">
                <b>{{ tarea.description }}</b><br />
                <small style="color: #666;">Proyecto: {{ tarea.project?.name || 'N/A' }}</small>
              </div>
            }
            @if (tablero.BAJA.length === 0) {
              <p style="color: #999;">Sin tareas</p>
            }
          </div>
        </div>
      </div>

      <!-- Modal de detalles -->
      @if (tareaSeleccionada) {
        <hr />
        <h3>Detalles de la Tarea</h3>
        <p><b>Descripción:</b> {{ tareaSeleccionada.description }}</p>
        <p>
          <b>Estado:</b>
          <select [(ngModel)]="tareaSeleccionada.status">
            <option>PENDIENTE</option>
            <option>FINALIZADO</option>
            @if (esAdmin) {
              <option>BAJA</option>
            }
          </select>
        </p>
        <p><b>Proyecto:</b> {{ tareaSeleccionada.project?.name || 'Interno' }}</p>
        <button (click)="guardarCambios(tareaSeleccionada)">Guardar</button>
        <button (click)="tareaSeleccionada = null">Cerrar</button>
        @if (esAdmin) {
          <button (click)="borrar(tareaSeleccionada.id)" style="background: #ff6b6b; color: white;">Borrar</button>
        }
      }
    }
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 20px;
      }
    `,
  ],
})
export class TableroTareasComponent implements OnInit {
  tablero: any = null;
  cargando = true;
  error = '';
  esAdmin = false;
  tareaSeleccionada: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.esAdmin = this.api.esAdmin();
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.error = '';
    this.api.obtenerTableroTareas().subscribe({
      next: (datos) => {
        this.tablero = datos;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar tareas';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  verDetalles(tarea: any) {
    this.tareaSeleccionada = { ...tarea };
  }

  guardarCambios(tarea: any) {
    this.api.editarTarea(tarea.id, { status: tarea.status }).subscribe({
      next: () => {
        this.tareaSeleccionada = null;
        this.cargar();
      },
      error: (err) => {
        this.error = 'Error al guardar cambios';
        console.error(err);
      },
    });
  }

  borrar(id: number) {
    if (confirm('¿Borrar tarea?')) {
      this.api.borrarTarea(id).subscribe({
        next: () => {
          this.tareaSeleccionada = null;
          this.cargar();
        },
        error: (err) => {
          this.error = 'Error al borrar tarea';
          console.error(err);
        },
      });
    }
  }
}
