import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <h2>{{ id ? 'Editar proyecto' : 'Nuevo proyecto' }}</h2>
    <p>Nombre: <input [(ngModel)]="name" /></p>
    <p>
      Estado:
      <select [(ngModel)]="status">
        <option>ACTIVO</option>
        <option>FINALIZADO</option>
        <option>BAJA</option>
      </select>
    </p>
    <p>
      Cliente:
      <select [(ngModel)]="clientId">
        <option value="">Interno (sin cliente)</option>
        @for (c of clientes; track c.id) {
          <option [value]="c.id">{{ c.name }}</option>
        }
      </select>
    </p>
    @if (error) {
      <p style="color:red">{{ error }}</p>
    }
    <button (click)="guardar()">Guardar</button>
    <a routerLink="/proyectos">Volver</a>
  `,
})
export class ProyectoFormComponent implements OnInit {
  id = 0;
  name = '';
  status = 'ACTIVO';
  clientId: any = '';
  clientes: any[] = [];
  error = '';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.api.getClientesActivos().subscribe((c) => (this.clientes = c));

    const param = this.route.snapshot.paramMap.get('id');
    if (param && param !== 'nuevo') {
      this.id = Number(param);
      this.api.getProyecto(this.id).subscribe((p) => {
        this.name = p.name;
        this.status = p.status;
        this.clientId = p.clientId || '';
      });
    }
  }

  guardar() {
    const data: any = {
      name: this.name,
      status: this.status,
      clientId: this.clientId === '' ? null : Number(this.clientId),
    };

    const peticion = this.id
      ? this.api.editarProyecto(this.id, data)
      : this.api.guardarProyecto(data);

    peticion.subscribe({
      next: (p: any) => this.router.navigate(['/proyectos', p.id]),
      error: (e) => {
        this.error = e.error?.message || 'Error al guardar';
      },
    });
  }
}
