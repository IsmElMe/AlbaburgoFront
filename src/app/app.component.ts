import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {

  constructor (private auth: AuthService) { }

  get nombreUsuario() { return this.auth.getNombreUsuario(); } 
  get rolUsuario() { return this.auth.getRolUsuario(); }

  ngOnInit(): void {
    if (localStorage.getItem('usuario')) {
      this.auth.setNombreUsuario(localStorage.getItem('usuario') ?? '');
      this.auth.setRolUsuario(localStorage.getItem('rol') ?? '');
    }
    
    if (localStorage.getItem('tema') && localStorage.getItem('tema') === 'oscuro') {
      const body = document.getElementsByTagName('body')[0];
      const inputCambioTema = document.getElementById('cambioTema') as HTMLInputElement;

      body.className = 'mat-typography dark-mode';
      inputCambioTema.checked = true;
    }
  }

  cambioTema(evento: Event): void {
    const body = document.getElementsByTagName('body')[0];
    const target = evento.target as HTMLInputElement;

    if (target.checked) {
      body.className = 'mat-typography dark-mode';
      localStorage.setItem('tema', 'oscuro');
    } else {
      body.className = 'mat-typography';
      localStorage.setItem('tema', 'claro');
    } 
  }

  cerrarSesion(): void {
    this.auth.logout(sessionStorage.getItem('token') ?? '');
  }
}
