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
    <hr />
    <p>
      Buscar: <input [(ngModel)]="filtroNombre" (input)="filtrar()" placeholder="nombre..." />
      Estado:
      <select [(ngModel)]="filtroEstado" (change)="filtrar()">
        <option value="">Todos</option>
        <option>ACTIVO</option>
        <option>BAJA</option>
      </select>
      <button (click)="descargarCsv()">Descargar CSV</button>
    </p>
    <table border="1" cellpadding="6" width="100%">
      <tr>
        <th (click)="ordenarPor('name')" style="cursor:pointer">Nombre {{ flecha('name') }}</th>
        <th (click)="ordenarPor('status')" style="cursor:pointer">Estado {{ flecha('status') }}</th>
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
      @if (lista.length === 0) {
        <tr><td colspan="3">Sin resultados</td></tr>
      }
    </table>
    <p>
      <button (click)="irPagina(pagina - 1)" [disabled]="pagina <= 1">Anterior</button>
      Pagina {{ pagina }} de {{ totalPaginas() }} ({{ total }} clientes)
      <button (click)="irPagina(pagina + 1)" [disabled]="pagina >= totalPaginas()">Siguiente</button>
    </p>
  `,
})
export class ClientesComponent implements OnInit {
  lista: any[] = [];
  total = 0;
  pagina = 1;
  porPagina = 10;
  filtroNombre = '';
  filtroEstado = '';
  orden = 'name';
  dir = 'ASC';
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
    this.api.getClientes(this.filtros()).subscribe((r) => {
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
    this.api.exportarClientes(filtros).subscribe((blob) => {
      this.api.descargarArchivo(blob, 'clientes.csv');
    });
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
