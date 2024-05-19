import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<Usuario[]> {  
    return this.http.get<Usuario[]>(`${API}/usuario`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario[]>(error))
      );
  }

  obtenerUsuario(nif: string): Observable<Usuario> {  
    return this.http.get<Usuario>(`${API}/usuario/${nif}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario>(error))
      );
  }

  obtenerUsuariosFiltrado(filtro: string): Observable<Usuario[]> { 
    return this.http.get<Usuario[]>(`${API}/usuario/buscar/${filtro}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario[]>(error))
      );
  }

  obtenerUsuariosRol(id_rol: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API}/usuario/rol/${id_rol}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario[]>(error))
      );
  }

  actualizarUsuario(idUsuario: number, usuario: object): Observable<Usuario> {
    return this.http.put<Usuario>(`${API}/usuario/${idUsuario}`, usuario)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario>(error))
      );
  }

  borrarUsuario(idUsuario: number): Observable<Respuesta<Usuario>> {
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');

    return this.http.delete(`${API}/usuario/${idUsuario}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Usuario>>(error))
      );
  }
}
