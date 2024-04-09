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

  get nombreUsuario() {
    return this.auth.getNombreUsuario();
  } 

  ngOnInit(): void {
      if (localStorage.getItem('usuario'))
        this.auth.setNombreUsuario(localStorage.getItem('usuario') ?? '');
  }

  cerrarSesion() {
    this.auth.logout(sessionStorage.getItem('token') ?? '');
  }
}
