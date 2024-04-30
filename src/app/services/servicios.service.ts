import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Servicio } from '../interfaces/servicio';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http: HttpClient) { }

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${API}/servicio`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Servicio[]>(error))
      );
  }

  obtenerServiciosFiltrado(filtro: string): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${API}/servicio/buscar/${filtro}`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Servicio[]>(error))
      );
  }

  crearServicio(servicio: Servicio): Observable<Respuesta<Servicio>> {
    return this.http.post(`${API}/servicio`, servicio)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Servicio>>(error))
      );
  }

  borrarServicio(idServicio: number): Observable<Respuesta<Servicio>> {
    return this.http.delete(`${API}/servicio/${idServicio}`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Servicio>>(error))
      );
  }
}
