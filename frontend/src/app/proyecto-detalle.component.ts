import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    @if (proyecto) {
      <h2>{{ proyecto.name }}</h2>
      <p>Estado: {{ proyecto.status }}</p>
      <p>Cliente: {{ proyecto.client ? proyecto.client.name : 'Interno' }}</p>
      <a [routerLink]="['/proyectos', proyecto.id, 'editar']">Editar proyecto</a>
      <hr />
      <h3>Tareas</h3>
      <p>
        Nueva tarea:
        <input [(ngModel)]="tareaNueva" />
        <select [(ngModel)]="estadoNueva">
          <option>PENDIENTE</option>
          <option>FINALIZADO</option>
          @if (esAdmin) {
            <option>BAJA</option>
          }
        </select>
        <button (click)="agregarTarea()">Agregar</button>
      </p>
      <table border="1" cellpadding="6" width="100%">
        <tr>
          <th>Descripcion</th>
          <th>Estado</th>
          <th></th>
        </tr>
        @for (t of proyecto.tasks; track t.id) {
          <tr>
            @if (editando === t.id) {
              <td><input [(ngModel)]="editDesc" /></td>
              <td>
                <select [(ngModel)]="editEstado">
                  <option>PENDIENTE</option>
                  <option>FINALIZADO</option>
                  @if (esAdmin) {
                    <option>BAJA</option>
                  }
                </select>
              </td>
              <td>
                <button (click)="guardarTarea(t.id)">Ok</button>
                <button (click)="editando = 0">X</button>
              </td>
            } @else {
              <td>{{ t.description }}</td>
              <td>{{ t.status }}</td>
              <td>
                <button (click)="empezarEditar(t)">Editar</button>
                @if (esAdmin) {
                  <button (click)="borrarTarea(t.id)">Borrar</button>
                }
              </td>
            }
          </tr>
        }
      </table>
      <br />
      <a routerLink="/proyectos">Volver</a>
    }
  `,
})
export class ProyectoDetalleComponent implements OnInit {
  proyecto: any = null;
  esAdmin = false;
  projectId = 0;
  tareaNueva = '';
  estadoNueva = 'PENDIENTE';
  editando = 0;
  editDesc = '';
  editEstado = 'PENDIENTE';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.esAdmin = this.api.esAdmin();
    this.cargar();
  }

  cargar() {
    this.api.getProyecto(this.projectId).subscribe((p) => (this.proyecto = p));
  }

  agregarTarea() {
    if (!this.tareaNueva.trim()) return;
    this.api
      .crearTarea(this.projectId, {
        description: this.tareaNueva,
        status: this.estadoNueva,
      })
      .subscribe(() => {
        this.tareaNueva = '';
        this.cargar();
      });
  }

  empezarEditar(t: any) {
    this.editando = t.id;
    this.editDesc = t.description;
    this.editEstado = t.status;
  }

  guardarTarea(id: number) {
    this.api
      .editarTarea(id, { description: this.editDesc, status: this.editEstado })
      .subscribe(() => {
        this.editando = 0;
        this.cargar();
      });
  }

  borrarTarea(id: number) {
    if (confirm('Borrar tarea?')) {
      this.api.borrarTarea(id).subscribe(() => this.cargar());
    }
  }
}
