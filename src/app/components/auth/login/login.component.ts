import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Credenciales } from '../../../interfaces/usuario';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginCompletadoModalComponent } from '../../modals/login-completado-modal/login-completado-modal.component';
import { LoginErrorModalComponent } from '../../modals/login-error-modal/login-error-modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent implements OnDestroy {
  mostrarPass = false;
  tipoPassword = 'password';
  subscripcionLogin?: Subscription;

  constructor(private auth: AuthService, private fb: FormBuilder, private dialog: MatDialog) { }

  usuario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  get email() { return this.usuario.get('email'); }
  get password() { return this.usuario.get('password'); }

  ngOnDestroy(): void {
    if (this.subscripcionLogin)
      this.subscripcionLogin.unsubscribe();
  }

  login(evento: Event): void {
    evento.preventDefault();

    if (this.usuario.valid) {
      const credenciales: Credenciales = {
        'email': this.email!.value ?? '',
        'password': this.password!.value ?? ''
      };
      
      this.subscripcionLogin = this.auth.login(credenciales).subscribe({
        next: respuesta => {
          if (respuesta.token && respuesta.usuario) {
            sessionStorage.setItem('token', respuesta.token);
            sessionStorage.setItem('email', respuesta.usuario.email);
            sessionStorage.setItem('usuario', respuesta.usuario.nombre);
            this.dialog.open(LoginCompletadoModalComponent);
          }
        },
        error: error => {
          console.log(error);
          
          this.dialog.open(LoginErrorModalComponent);
        }
      });
    }
  }

  mostrarPassword() {
    this.tipoPassword = 'text';
    this.mostrarPass = true;
  }

  ocultarPassword() {
    this.tipoPassword = 'password';
    this.mostrarPass = false;
  }
}
