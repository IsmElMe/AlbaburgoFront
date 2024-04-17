import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credenciales, Usuario } from '../interfaces/usuario';
import { SERVIDOR, errorPeticion } from '../utils';
import { BehaviorSubject, Observable, catchError, exhaustMap, of, switchMap } from 'rxjs';
import { RespuestaAuth } from '../interfaces/respuesta-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private headers = { 'Content-Type': 'application/json' };
  private nombreUsuarioSubject = new BehaviorSubject<string>('');
  private rolUsuarioSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  registrar(usuario: Usuario): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${SERVIDOR}/registrar`, JSON.stringify(usuario), { headers: this.headers })
      .pipe(
        exhaustMap(respuesta => { console.log(respuesta); return of(respuesta); }),
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
      );
  }

  login(credenciales: Credenciales): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${SERVIDOR}/login`, JSON.stringify(credenciales), { headers: this.headers })
      .pipe(
        switchMap(respuesta => { return of(respuesta); }),
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
      );
  }

  logout(token: string): Observable<{success: string}> {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    this.nombreUsuarioSubject = new BehaviorSubject<string>('');

    return this.http.get<{success: string}>(`${SERVIDOR}/logout`, { headers: { 'Authorization: Bearer ': token } })
      .pipe(
        switchMap(respuesta => { return of(respuesta); }),
        catchError((error: HttpErrorResponse) => errorPeticion<{success: string}>(error))
      );
  }

  setNombreUsuario(nombreUsuario: string): void {
    this.nombreUsuarioSubject.next(nombreUsuario);
  }

  getNombreUsuario(): BehaviorSubject<string> {
    return this.nombreUsuarioSubject;
  }

  setRolUsuario(rol: string): void {
    this.rolUsuarioSubject.next(rol);
  }

  getRolUsuario(): BehaviorSubject<string> {
    return this.rolUsuarioSubject;
  }
}
