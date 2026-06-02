import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { ProyectoDetalleComponent } from './proyecto-detalle.component';
import { ProyectoFormComponent } from './proyecto-form.component';
import { ProyectosComponent } from './proyectos.component';

function estaLogueado() {
  if (localStorage.getItem('token')) {
    return true;
  }
  return inject(Router).parseUrl('/login');
}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [estaLogueado],
    children: [
      { path: '', redirectTo: 'proyectos', pathMatch: 'full' },
      { path: 'proyectos', component: ProyectosComponent },
      { path: 'proyectos/nuevo', component: ProyectoFormComponent },
      { path: 'proyectos/:id/editar', component: ProyectoFormComponent },
      { path: 'proyectos/:id', component: ProyectoDetalleComponent },
      { path: 'clientes', component: ClientesComponent },
    ],
  },
];
