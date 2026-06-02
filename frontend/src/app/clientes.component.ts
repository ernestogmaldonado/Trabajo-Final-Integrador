import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Clientes</h2>
    <p>Nombre: <input [(ngModel)]="nombreNuevo" /></p>
    <p>
      Estado:
      <select [(ngModel)]="estadoNuevo">
        <option>ACTIVO</option>
        <option>BAJA</option>
      </select>
    </p>
    <button (click)="crear()">Crear cliente</button>
    @if (mensaje) {
      <p style="color:green">{{ mensaje }}</p>
    }
    @if (error) {
      <p style="color:red">{{ error }}</p>
    }
    <br />
    <table border="1" cellpadding="6" width="100%">
      <tr>
        <th>Nombre</th>
        <th>Estado</th>
        <th></th>
      </tr>
      @for (c of lista; track c.id) {
        <tr>
          @if (editId === c.id) {
            <td><input [(ngModel)]="editNombre" /></td>
            <td>
              <select [(ngModel)]="editEstado">
                <option>ACTIVO</option>
                <option>BAJA</option>
              </select>
            </td>
            <td>
              <button (click)="guardarEdit(c.id)">Guardar</button>
              <button (click)="editId = 0">Cancelar</button>
            </td>
          } @else {
            <td>{{ c.name }}</td>
            <td>{{ c.status }}</td>
            <td><button (click)="empezarEdit(c)">Editar</button></td>
          }
        </tr>
      }
    </table>
  `,
})
export class ClientesComponent implements OnInit {
  lista: any[] = [];
  nombreNuevo = '';
  estadoNuevo = 'ACTIVO';
  editId = 0;
  editNombre = '';
  editEstado = 'ACTIVO';
  mensaje = '';
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.api.getClientes().subscribe((d) => (this.lista = d));
  }

  crear() {
    this.mensaje = '';
    this.error = '';
    this.api
      .guardarCliente({ name: this.nombreNuevo, status: this.estadoNuevo })
      .subscribe({
        next: () => {
          this.nombreNuevo = '';
          this.mensaje = 'Cliente creado';
          this.cargar();
        },
        error: (e) => (this.error = e.error?.message || 'Error'),
      });
  }

  empezarEdit(c: any) {
    this.editId = c.id;
    this.editNombre = c.name;
    this.editEstado = c.status;
    this.error = '';
  }

  guardarEdit(id: number) {
    this.api.editarCliente(id, { name: this.editNombre, status: this.editEstado }).subscribe({
      next: () => {
        this.editId = 0;
        this.cargar();
      },
      error: (e) => (this.error = e.error?.message || 'Error al editar'),
    });
  }
}
