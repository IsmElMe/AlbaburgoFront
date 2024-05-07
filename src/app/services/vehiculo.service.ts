import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Vehiculo } from '../interfaces/vehiculo';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(private http: HttpClient) { }

  obtenerVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API}/vehiculo`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Vehiculo[]>(error))
      );
  }

  obtenerVehiculosUsuario(nif: string): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API}/vehiculo/usuario/${nif}`);
  }

  obtenerVehiculosFiltrado(filtro: string): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API}/vehiculo/buscar/${filtro}`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Vehiculo[]>(error))
      );
  }

  crearVehiculo(vehiculo: Vehiculo): Observable<Respuesta<Vehiculo>> {
    return this.http.post<Respuesta<Vehiculo>>(`${API}/vehiculo`, vehiculo)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Vehiculo>>(error))
      );
  }

  editarVehiculo(idVehiculo: number, vehiculo: object): Observable<Respuesta<Vehiculo>> {
    return this.http.put<Respuesta<Vehiculo>>(`${API}/vehiculo/${idVehiculo}`, vehiculo)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Vehiculo>>(error))
      );
  }

  borrarVehiculo(idVehiculo: number): Observable<Respuesta<Vehiculo>> {
    return this.http.delete(`${API}/vehiculo/${idVehiculo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Vehiculo>>(error))
      );
  }
}
