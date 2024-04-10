import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.sass'
})
export class UsuariosAdminComponent implements OnInit {
  usuarios$?: Observable<Usuario[]>;

  constructor(private servicioUsuarios: UsuarioService) { }

  ngOnInit(): void {
      this.usuarios$ = this.servicioUsuarios.obtenerUsuarios();
      // this.servicioUsuarios.obtenerUsuarios();
  }
}
