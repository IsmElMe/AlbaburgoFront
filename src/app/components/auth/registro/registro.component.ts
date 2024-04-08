import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../interfaces/usuario';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.sass'
})
export class RegistroComponent {
  mostrarPass = false;
  tipoPassword = 'password';
  mostrarRepetirPass = false;
  tipoRepetirPassword = 'password';
  enviado = false;
  registro$!: Observable<Usuario>;

  constructor(private auth: AuthService, private fb: FormBuilder) { }

  usuario = this.fb.group({
    nif: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]{1}$/)]],
    email: ['', [Validators.required, Validators.email]],
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    password: this.fb.group({
      pass: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      repetirPass: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]]
    })
  });

  get nif() { return this.usuario.get('nif'); }
  get email() { return this.usuario.get('email'); }
  get nombre() { return this.usuario.get('nombre'); }
  get apellidos() { return this.usuario.get('apellidos'); }
  get fechaNacimiento() { return this.usuario.get('fechaNacimiento'); }
  get telefono() { return this.usuario.get('telefono'); }
  get password() { return this.usuario.get('password')?.get('pass'); }
  get repetirPassword() { return this.usuario.get('password')?.get('repetirPass'); }

  registrar(evento: Event) {
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

      this.registro$ = this.auth.registrar(nuevoUsuario);
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

  mostrarRepetirPassword() {
    this.tipoRepetirPassword = 'text';
    this.mostrarRepetirPass = true;
  }

  ocultarRepetirPassword() {
    this.tipoRepetirPassword = 'password';
    this.mostrarRepetirPass = false;
  }
}
