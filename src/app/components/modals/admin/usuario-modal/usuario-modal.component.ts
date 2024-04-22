import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Usuario } from '../../../../interfaces/usuario';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../services/usuario.service';
import { Observable } from 'rxjs';
import { RespuestaAuth } from '../../../../interfaces/respuestas';

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './usuario-modal.component.html',
  styleUrl: './usuario-modal.component.sass'
})
export class UsuarioModalComponent {
  mostrarPass = false;
  tipoPassword = 'password';
  editado$?: Observable<RespuestaAuth>;
  borrado$?: Observable<RespuestaAuth>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {usuario: Usuario}, private servicioUsuarios: UsuarioService, private fb: FormBuilder) { }

  fecha = this.transformarFecha();
  rol = this.data.usuario.id_rol == 1 ? 'Administrador' : this.data.usuario.id_rol == 2 ? 'Cliente' : 'Mecánico';
  usuario = this.fb.group({
    nif: [this.data.usuario.nif, [Validators.pattern(/^[0-9]{8}[A-Za-z]{1}$/)]],
    email: [this.data.usuario.email, [Validators.email]],
    nombre: [this.data.usuario.nombre],
    apellidos: [this.data.usuario.apellidos],
    fechaNacimiento: [this.fecha],
    telefono: [this.data.usuario.telefono],
    password: ['', [Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]]
  });

  get nif() { return this.usuario.get('nif'); }
  get email() { return this.usuario.get('email'); }
  get nombre() { return this.usuario.get('nombre'); }
  get apellidos() { return this.usuario.get('apellidos'); }
  get fechaNacimiento() { return this.usuario.get('fechaNacimiento'); }
  get telefono() { return this.usuario.get('telefono'); }
  get password() { return this.usuario?.get('password'); }

  editarUsuario(): void {
    const usuarioEditado: Usuario = {
      'nif': this.nif?.value ?? '',
      'id_rol': this.data.usuario.id_rol,
      'email': this.email?.value ?? '',
      'nombre': this.nombre?.value ?? '',
      'apellidos': this.apellidos?.value ?? '',
      'fecha_nacimiento': this.fechaNacimiento?.value ?? '',
      'telefono': this.telefono?.value ?? '',
    };

    if (this.password?.value)
      usuarioEditado.password = this.password?.value ?? '';
    
    this.editado$ = this.servicioUsuarios.actualizarUsuario(this.data.usuario.id ?? 0, usuarioEditado);
  }

  borrarUsuario() {
    this.borrado$ = this.servicioUsuarios.borrarUsuario(this.data.usuario.id ?? 0);
  }

  mostrarPassword(): void {
    this.tipoPassword = 'text';
    this.mostrarPass = true;
  }

  ocultarPassword(): void {
    this.tipoPassword = 'password';
    this.mostrarPass = false;
  }

  transformarFecha(): string {
    const fechaSeparada = this.data.usuario.fecha_nacimiento.split('-');
    const fechaDate = new Date(parseInt(fechaSeparada[2]), parseInt(fechaSeparada[1]) - 1, parseInt(fechaSeparada[0]));
    const mes = fechaDate.getMonth() < 9 ? `0${fechaDate.getMonth() + 1}` : fechaDate.getMonth() + 1;
    const dia = fechaDate.getDate() < 9 ? `0${fechaDate.getDate()}` : fechaDate.getDate();
    
    return `${fechaDate.getFullYear()}-${mes.toString()}-${dia.toString()}`;
  }
}
