import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, switchMap } from 'rxjs';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioModalComponent } from '../../modals/admin/usuario-modal/usuario-modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.sass'
})
export class UsuariosAdminComponent implements OnInit {
  usuarios$?: Observable<Usuario[]>;
  filtro$ = new BehaviorSubject<string>('');

  constructor(private servicioUsuarios: UsuarioService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.usuarios$ = this.filtro$.pipe(
      debounceTime(300),
      switchMap(filtro => filtro ? this.servicioUsuarios.obtenerUsuariosFiltrado(filtro) : this.servicioUsuarios.obtenerUsuarios())
    );
  }

  modalUsuario(usuario: Usuario): void {
    this.dialog.open(UsuarioModalComponent, { data: { usuario: usuario } });
  }

  buscar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    this.filtro$.next(input.value);
  }
}
