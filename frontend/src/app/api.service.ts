import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private cabeceras() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: 'Bearer ' + token });
  }

  // arma el query string a partir de un objeto, salteando valores vacios
  private armarQuery(filtros: any) {
    const partes: string[] = [];
    for (const clave of Object.keys(filtros || {})) {
      const valor = filtros[clave];
      if (valor !== '' && valor !== null && valor !== undefined) {
        partes.push(clave + '=' + encodeURIComponent(valor));
      }
    }
    return partes.length ? '?' + partes.join('&') : '';
  }

  login(usuario: string, clave: string) {
    return this.http.post<any>(this.api + '/auth/login', {
      username: usuario,
      password: clave,
    });
  }

  getProyectos(filtros?: any) {
    return this.http.get<any>(this.api + '/projects' + this.armarQuery(filtros), {
      headers: this.cabeceras(),
    });
  }

  exportarProyectos(filtros?: any) {
    return this.http.get(this.api + '/projects/export' + this.armarQuery(filtros), {
      headers: this.cabeceras(),
      responseType: 'blob',
    });
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

  getClientes(filtros?: any) {
    return this.http.get<any>(this.api + '/clients' + this.armarQuery(filtros), {
      headers: this.cabeceras(),
    });
  }

  exportarClientes(filtros?: any) {
    return this.http.get(this.api + '/clients/export' + this.armarQuery(filtros), {
      headers: this.cabeceras(),
      responseType: 'blob',
    });
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

  getHistorial(filtros?: any) {
    return this.http.get<any>(this.api + '/history' + this.armarQuery(filtros), {
      headers: this.cabeceras(),
    });
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

  getEstadisticas() {
    return this.http.get<any>(this.api + '/estadisticas', { headers: this.cabeceras() });
  }

  // descarga un blob como archivo
  descargarArchivo(blob: Blob, nombre: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  esAdmin() {
    return localStorage.getItem('role') === 'ADMIN';
  }
}
