import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credenciales, Usuario } from '../interfaces/usuario';
import { SERVIDOR, errorPeticion } from '../utils';
import { Observable, catchError, exhaustMap, of, switchMap } from 'rxjs';
import { RespuestaAuth } from '../interfaces/respuesta-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  registrar(usuario: Usuario): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${SERVIDOR}/registrar`, JSON.stringify(usuario), { headers: this.headers })
      .pipe(
        exhaustMap(respuesta => { console.log(respuesta); return of(respuesta) }),
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
      );
  }

  login(credenciales: Credenciales): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${SERVIDOR}/login`, JSON.stringify(credenciales), { headers: this.headers })
      .pipe(
        switchMap(respuesta => { console.log(respuesta); return of(respuesta) }),
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaAuth>(error))
      );
  }
}
