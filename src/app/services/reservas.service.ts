import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, catchError } from 'rxjs';
import { Reserva } from '../interfaces/reserva';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private fechaSeleccionada: ReplaySubject<Date> = new ReplaySubject(1);

  constructor(private http: HttpClient) { }

  obtenerReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${API}/reserva`)
     .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Reserva[]>(error))
      );
  }

  obtenerReservasFiltrado(filtro: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${API}/reserva/buscar/${filtro}`)
     .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Reserva[]>(error))
      );
  }

  crearReserva(reserva: Reserva): Observable<Respuesta<Reserva>> {
    return this.http.post<Respuesta<Reserva>>(`${API}/reserva`, reserva)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Reserva>>(error))
      );
  }

  borrarReserva(id: number): Observable<Respuesta<Reserva>> {
    return this.http.delete(`${API}/reserva/${id}`)
     .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Reserva>>(error))
      );
  }

  setFechaSeleccionada(fecha: Date): void {
    this.fechaSeleccionada.next(fecha);
  }

  getFechaSeleccionada(): Observable<Date> {
    return this.fechaSeleccionada.asObservable();
  }
}
