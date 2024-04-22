import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Vehiculo } from '../interfaces/vehiculo';
import { API, errorPeticion } from '../utils';
import { RespuestaAuth, RespuestaVehiculo } from '../interfaces/respuestas';

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

  crearVehiculo(vehiculo: Vehiculo): Observable<RespuestaVehiculo> {
    return this.http.post(`${API}/vehiculo`, vehiculo)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<RespuestaVehiculo>(error))
      );
  }
}
