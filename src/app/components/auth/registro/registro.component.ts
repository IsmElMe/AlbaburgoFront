import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../interfaces/usuario';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RegistroCompletadoModalComponent } from '../../modals/auth/registro-completado.modal/registro-completado.modal.component';
import { RegistroErrorModalComponent } from '../../modals/auth/registro-error.modal/registro-error.modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.sass'
})
export class RegistroComponent implements OnDestroy {
  mostrarPass = false;
  tipoPassword = 'password';
  mostrarRepetirPass = false;
  tipoRepetirPassword = 'password';
  subscripcionRegistro?: Subscription;
  tipoInput = 'text';

  constructor(private auth: AuthService, private fb: FormBuilder, private dialog: MatDialog) { }

  usuario = this.fb.group({
    nif: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]{1}$/)]],
    email: ['', [Validators.required, Validators.email]],
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    password: this.fb.group({
      pass: ['', [Validators.required]],
      repetirPass: ['', [Validators.required]]
    }, { validators: passIguales })
  });

  get nif() { return this.usuario.get('nif'); }
  get email() { return this.usuario.get('email'); }
  get nombre() { return this.usuario.get('nombre'); }
  get apellidos() { return this.usuario.get('apellidos'); }
  get fechaNacimiento() { return this.usuario.get('fechaNacimiento'); }
  get telefono() { return this.usuario.get('telefono'); }
  get password() { return this.usuario.get('password')?.get('pass'); }
  get repetirPassword() { return this.usuario.get('password')?.get('repetirPass'); }

  ngOnDestroy(): void {
    this.subscripcionRegistro?.unsubscribe();
  }

  registrar(evento: Event): void {
    evento.preventDefault();
    
    if (this.usuario.valid) {
      const nuevoUsuario: Usuario = {
        'nif': this.nif!.value ?? '',
        'id_rol': 2,
        'email': this.email!.value ?? '',
        'nombre': this.nombre!.value ?? '',
        'apellidos': this.apellidos!.value ?? '',
        'password': this.password!.value ?? '',
        'fecha_nacimiento': this.fechaNacimiento!.value ?? '',
        'telefono': this.telefono!.value ?? ''
      };

      this.subscripcionRegistro = this.auth.registrar(nuevoUsuario).subscribe({
        next: respuesta => {
          if (respuesta.token && respuesta.usuario) {
            localStorage.setItem('token', respuesta.token);
            localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
            this.auth.setNombreUsuario(respuesta.usuario.nombre);
            this.dialog.open(RegistroCompletadoModalComponent);

            switch (respuesta.usuario.id_rol) {
              case 1: 
                localStorage.setItem('rol', 'administrador'); 
                this.auth.setRolUsuario('administrador');
                break;
              case 2: 
                localStorage.setItem('rol', 'cliente'); 
                this.auth.setRolUsuario('cliente');
                break;
              case 3: 
                localStorage.setItem('rol', 'mecanico'); 
                this.auth.setRolUsuario('mecanico');
                break;
            }
          }
        },
        error: error => {
          console.error(error);
          
          this.dialog.open(RegistroErrorModalComponent);
        }
      });
    }
  }

  mostrarPassword(): void {
    this.tipoPassword = 'text';
    this.mostrarPass = true;
  }

  ocultarPassword(): void {
    this.tipoPassword = 'password';
    this.mostrarPass = false;
  }

  mostrarRepetirPassword(): void {
    this.tipoRepetirPassword = 'text';
    this.mostrarRepetirPass = true;
  }

  ocultarRepetirPassword(): void {
    this.tipoRepetirPassword = 'password';
    this.mostrarRepetirPass = false;
  }

  cambiarInput(): void {
    this.tipoInput = 'date';
  }
}

function passIguales(control: AbstractControl): ValidationErrors | null {
  const password = control.get('pass');
  const repetirPassword = control.get('repetirPass');

  if (!password || !repetirPassword) return null;

  return password.value === repetirPassword.value ? null : { passwordsMismatch: true };
}
