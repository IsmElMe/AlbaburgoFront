import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Reserva } from '../interfaces/reserva';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private http: HttpClient) { }

  obtenerReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${API}/reserva`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Reserva[]>(error))
      );
  }

  obtenerReservasFiltrado(filtro: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${API}/reserva/buscar/${filtro}`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Reserva[]>(error))
      );
  }

  crearReserva(reserva: object): Observable<Respuesta<Reserva>> {
    return this.http.post<Respuesta<Reserva>>(`${API}/reserva`, reserva)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Reserva>>(error))
      );
  }

  actualizarReserva(reserva: object): Observable<Respuesta<Reserva>> {
    return this.http.put<Respuesta<Reserva>>(`${API}/reserva/${(reserva as Reserva).id}`, reserva)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Reserva>>(error))
      );
  }

  borrarReserva(id: number): Observable<Respuesta<Reserva>> {
    return this.http.delete(`${API}/reserva/${id}`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Reserva>>(error))
      );
  }
}
