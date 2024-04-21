import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, debounceTime } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { API, errorPeticion } from '../utils';
import { RespuestaAuth } from '../interfaces/respuesta-auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<Usuario[]> {  
    return this.http.get<Usuario[]>(`${API}/usuario`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario[]>(error))
      );
  }

  obtenerUsuariosFiltrado(filtro: string): Observable<Usuario[]> { 
    return this.http.get<Usuario[]>(`${API}/usuario/buscar/${filtro}`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario[]>(error))
      );
  }

  actualizarUsuario(idUsuario: number, usuario: object): Observable<RespuestaAuth> {
    const user = usuario as Usuario;
    let nuevoUsuario: Usuario = JSON.parse(localStorage.getItem('usuario') ?? '');
    
    nuevoUsuario.apellidos = user.apellidos;
    nuevoUsuario.email = user.email;
    nuevoUsuario.fecha_nacimiento = user.fecha_nacimiento;
    nuevoUsuario.nif = user.nif;
    nuevoUsuario.nombre = user.nombre;
    nuevoUsuario.telefono = user.telefono;
    
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));

    return this.http.put<RespuestaAuth>(`${API}/usuario/${idUsuario}`, usuario)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
      );
  }

  borrarUsuario(idUsuario: number): Observable<RespuestaAuth> {
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');

    return this.http.delete(`${API}/usuario/${idUsuario}`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
      );
  }
}
