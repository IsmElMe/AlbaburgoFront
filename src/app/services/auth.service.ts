import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { SERVIDOR, errorPeticion } from '../utils';
import { Observable, catchError, exhaustMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${SERVIDOR}/registrar`, JSON.stringify(usuario), { headers: { 'Content-Type': 'application/json' } })
      .pipe(
        exhaustMap(respuesta => { console.log(respuesta); return of(respuesta) }),
        catchError((error: HttpErrorResponse) => errorPeticion<Usuario>(error))
      );
  }
}
