import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Nota } from '../interfaces/nota';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  constructor(private http: HttpClient) { }

  obtenerNotas(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${API}/nota`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Nota[]>(error))
     );
  }

  obtenerNotasHome(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${API}/nota/obtener/random`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Nota[]>(error))
      );
  }

  obtenerNota(id_nota: number): Observable<Nota> {
    return this.http.get<Nota>(`${API}/nota/${id_nota}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Nota>(error))
      );
  }

  obtenerNotasFiltrado(filtro: string): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${API}/nota/buscar/${filtro}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Nota[]>(error))
      );
  }

  crearNota(nota: object): Observable<Nota> { 
    return this.http.post<Nota>(`${API}/nota`, nota)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Nota>(error))
      );
  }

  borrarNota(id_nota: number): Observable<Respuesta<Nota>> {
    return this.http.delete<Respuesta<Nota>>(`${API}/nota/${id_nota}`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Nota>>(error))
      );
  }
}
