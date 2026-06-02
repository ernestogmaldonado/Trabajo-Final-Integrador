import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="caja">
      <h2>Gestion de Proyectos</h2>
      <p>Usuario: <input [(ngModel)]="username" /></p>
      <p>Clave: <input type="password" [(ngModel)]="password" /></p>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      <button (click)="entrar()">Entrar</button>
      <p><small>admin / admin123</small></p>
    </div>
  `,
  styles: [
    `
      .caja {
        max-width: 350px;
        margin: 80px auto;
        padding: 20px;
        border: 1px solid #ccc;
        background: #fff;
      }
      input {
        width: 100%;
        padding: 6px;
      }
      button {
        margin-top: 10px;
        padding: 8px 16px;
      }
      .error {
        color: red;
      }
    `,
  ],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  entrar() {
    this.error = '';
    this.api.login(this.username, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('user', res.user.username);
        this.router.navigate(['/proyectos']);
      },
      error: () => {
        this.error = 'No se pudo iniciar sesion';
      },
    });
  }
}
