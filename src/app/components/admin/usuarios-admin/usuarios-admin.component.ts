import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioModalComponent } from '../../modals/admin/usuario-modal/usuario-modal.component';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.sass'
})
export class UsuariosAdminComponent implements OnInit {
  usuarios$?: Observable<Usuario[]>;

  constructor(private servicioUsuarios: UsuarioService, private dialog: MatDialog) { }

  ngOnInit(): void {
      this.usuarios$ = this.servicioUsuarios.obtenerUsuarios();
  }

  modalUsuario(usuario: Usuario): void {
    this.dialog.open(UsuarioModalComponent, { data: { usuario: usuario } });
  }
}
