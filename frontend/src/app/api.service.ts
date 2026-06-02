import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private cabeceras() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: 'Bearer ' + token });
  }

  login(usuario: string, clave: string) {
    return this.http.post<any>(this.api + '/auth/login', {
      username: usuario,
      password: clave,
    });
  }

  getProyectos() {
    return this.http.get<any[]>(this.api + '/projects', { headers: this.cabeceras() });
  }

  getProyecto(id: number) {
    return this.http.get<any>(this.api + '/projects/' + id, { headers: this.cabeceras() });
  }

  guardarProyecto(datos: any) {
    return this.http.post(this.api + '/projects', datos, { headers: this.cabeceras() });
  }

  editarProyecto(id: number, datos: any) {
    return this.http.patch(this.api + '/projects/' + id, datos, { headers: this.cabeceras() });
  }

  getClientes() {
    return this.http.get<any[]>(this.api + '/clients', { headers: this.cabeceras() });
  }

  getClientesActivos() {
    return this.http.get<any[]>(this.api + '/clients/active', { headers: this.cabeceras() });
  }

  guardarCliente(datos: any) {
    return this.http.post(this.api + '/clients', datos, { headers: this.cabeceras() });
  }

  editarCliente(id: number, datos: any) {
    return this.http.patch(this.api + '/clients/' + id, datos, { headers: this.cabeceras() });
  }

  crearTarea(proyectoId: number, datos: any) {
    return this.http.post(
      this.api + '/projects/' + proyectoId + '/tasks',
      datos,
      { headers: this.cabeceras() },
    );
  }

  editarTarea(id: number, datos: any) {
    return this.http.patch(this.api + '/tasks/' + id, datos, { headers: this.cabeceras() });
  }

  borrarTarea(id: number) {
    return this.http.delete(this.api + '/tasks/' + id, { headers: this.cabeceras() });
  }
}
