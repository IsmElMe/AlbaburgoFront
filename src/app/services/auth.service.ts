import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credenciales, Usuario } from '../interfaces/usuario';
import { SERVIDOR, errorPeticion } from '../utils';
import { BehaviorSubject, Observable, catchError, exhaustMap, of, switchMap } from 'rxjs';
import { RespuestaAuth } from '../interfaces/respuestas';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private nombreUsuarioSubject = new BehaviorSubject<string>('');
  private rolUsuarioSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router) { }

  registrar(usuario: Usuario): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${SERVIDOR}/registrar`, JSON.stringify(usuario))
      .pipe(
        exhaustMap(respuesta => { return of(respuesta); }),
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
      );
  }

  login(credenciales: Credenciales): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${SERVIDOR}/login`, JSON.stringify(credenciales))
      .pipe(
        switchMap(respuesta => { return of(respuesta); }),
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
      );
  }

  logout(): Observable<{success: string}> {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    this.nombreUsuarioSubject = new BehaviorSubject<string>('');
    this.router.navigate(['']);

    return this.http.get<{success: string}>(`${SERVIDOR}/logout`)
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
