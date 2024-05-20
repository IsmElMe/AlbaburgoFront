import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Pregunta } from '../interfaces/pregunta';
import { API, errorPeticion } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  constructor(private http: HttpClient) { }

  obtenerPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${API}/pregunta`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Pregunta[]>(error))
     );
  }

  obtenerPregunta(id_pregunta: number): Observable<Pregunta> {
    return this.http.get<Pregunta>(`${API}/nota/${id_pregunta}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Pregunta>(error))
      );
  }
}
