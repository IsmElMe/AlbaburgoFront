import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Credenciales } from '../../../interfaces/usuario';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  mostrarPass = false;
  tipoPassword = 'password';
  enviado = false;
  login$!: Observable<Credenciales>;

  constructor(private auth: AuthService, private fb: FormBuilder) { }

  usuario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  get email() { return this.usuario.get('email'); }
  get password() { return this.usuario.get('password'); }

  login(evento: Event) {
    evento.preventDefault();

    if (this.usuario.valid) {
      const credenciales: Credenciales = {
        'email': this.email!.value ?? '',
        'password': this.password!.value ?? ''
      };
      
      // this.login$ = this.auth.login(credenciales);
      this.enviado = true;
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

  guardarToken() {
    // sessionStorage.setItem('token', );
  }
}
