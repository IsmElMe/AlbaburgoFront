import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom } from 'rxjs';
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
    return this.http.get<Vehiculo[]>(`${API}/vehiculo/usuario/${nif}`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Vehiculo[]>(error))
      );
  }

  obtenerVehiculosFiltrado(filtro: string): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API}/vehiculo/buscar/${filtro}`)
      .pipe(
        catchError((error: HttpErrorResponse) => errorPeticion<Vehiculo[]>(error))
      );
  }

  crearVehiculo(vehiculo: Vehiculo): Observable<Respuesta<Vehiculo>> {
    this.actulizarVehiculosUsuario(vehiculo, 'crear');
    
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

  async actulizarVehiculosUsuario(vehiculo: Vehiculo, accion: 'crear' | 'editar' | 'borrar') {
    const nif = JSON.parse(localStorage.getItem('usuario') || '').nif;
    let vehiculos: Vehiculo[] = [];

    if (accion !== 'borrar') {
      const vehiculosUsuario = await firstValueFrom(this.obtenerVehiculosUsuario(nif));
      
      vehiculos.push(vehiculo);
      vehiculosUsuario!.forEach(coche => vehiculos.push(coche));
      localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    } else {
      let vehiculosUsuario = await firstValueFrom(this.obtenerVehiculosUsuario(nif));
      
      vehiculosUsuario = vehiculosUsuario.filter(coche => coche.vin !== vehiculo.vin);
      vehiculosUsuario!.forEach(coche => vehiculos.push(coche));
      localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    }
  }
}
