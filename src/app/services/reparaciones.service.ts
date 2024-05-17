import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Reparacion } from '../interfaces/reparacion';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root'
})
export class ReparacionesService {

  constructor(private http: HttpClient) { }

  obtenerReparaciones(): Observable<Reparacion[]> {
    return this.http.get<Reparacion[]>(`${API}/reparacion`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Reparacion[]>(error))
     );
  }

  crearReparacion(reparacion: Reparacion): Observable<Respuesta<Reparacion>> {
    return this.http.post<Respuesta<Reparacion>>(`${API}/reparacion`, reparacion)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Reparacion>>(error))
      );
  }

  actualizarReparacion(idReparacion: number, reparacion: Reparacion): Observable<Respuesta<Reparacion>> {
    return this.http.put<Respuesta<Reparacion>>(`${API}/reparacion/${idReparacion}`, reparacion)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Reparacion>>(error))
      );
  }

  borrarReparacion(idReparacion: number): Observable<Respuesta<Reparacion>> {
    return this.http.delete<Respuesta<Reparacion>>(`${API}/reparacion/${idReparacion}`)
    .pipe(
       retry(2),
       catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Reparacion>>(error))
     );
  }
}
