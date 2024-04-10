import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
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

  actualizarUsuario(idUsuario: number, usuario: object): Observable<RespuestaAuth> {
    return this.http.put<RespuestaAuth>(`${API}/usuario/${idUsuario}`, usuario)
    .pipe(
      catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
    );
  }
}
