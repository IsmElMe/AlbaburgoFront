import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credenciales, Usuario } from '../interfaces/usuario';
import { SERVIDOR, errorPeticion } from '../utils';
import { Observable, catchError, exhaustMap, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${SERVIDOR}/registrar`, JSON.stringify(usuario), { headers: this.headers })
      .pipe(
        exhaustMap(respuesta => { console.log(respuesta); return of(respuesta) }),
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario>(error))
      );
  }

  login(credenciales: Credenciales): Observable<Credenciales> {
    return this.http.post<Credenciales>(`${SERVIDOR}/login`, JSON.stringify(credenciales), { headers: this.headers })
      .pipe(
        switchMap(respuesta => { console.log(respuesta); return of(respuesta) }),
        catchError((error: HttpErrorResponse) => errorPeticion<Credenciales>(error))
      );
  }
}
