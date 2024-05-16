import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, catchError, firstValueFrom, retry, tap } from 'rxjs';
import { Vehiculo } from '../interfaces/vehiculo';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';
import { ClientesService } from './clientes.service';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService implements OnDestroy {
  subscripcionNuevoCliente?: Subscription;
  subscripcionEdicionCliente?: Subscription;
  subscripcionBorradoCliente?: Subscription;
  subscripcionCliente?: Subscription;

  constructor(private http: HttpClient, private servicioClientes: ClientesService) { }

  ngOnDestroy(): void {
    this.subscripcionNuevoCliente?.unsubscribe();
    this.subscripcionEdicionCliente?.unsubscribe();
    this.subscripcionBorradoCliente?.unsubscribe();
    this.subscripcionCliente?.unsubscribe();
  }

  obtenerVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API}/vehiculo`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Vehiculo[]>(error))
      );
  }

  obtenerVehiculosUsuario(nif: string): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API}/vehiculo/usuario/${nif}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Vehiculo[]>(error))
      );
  }

  obtenerVehiculosFiltrado(filtro: string): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API}/vehiculo/buscar/${filtro}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Vehiculo[]>(error))
      );
  }

  crearVehiculo(vehiculo: Vehiculo): Observable<Respuesta<Vehiculo>> {
    const nuevoCliente: Cliente = {
      nif_usuario: JSON.parse(localStorage.getItem('usuario') || '').nif,
      vin_vehiculo: vehiculo.vin
    }

    this.subscripcionNuevoCliente = this.servicioClientes.crearCliente(nuevoCliente).subscribe();

    return this.http.post<Respuesta<Vehiculo>>(`${API}/vehiculo`, vehiculo)
      .pipe(
        tap(() => this.actulizarVehiculosUsuario('crear')),
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Vehiculo>>(error))
      );
  }

  editarVehiculo(idVehiculo: number, vehiculo: object): Observable<Respuesta<Vehiculo>> {
    const nuevoCliente: Cliente = {
      nif_usuario: JSON.parse(localStorage.getItem('usuario') || '').nif,
      vin_vehiculo: (vehiculo as Vehiculo).vin
    }

    this.subscripcionEdicionCliente = this.servicioClientes.editarCliente(nuevoCliente).subscribe();

    return this.http.put<Respuesta<Vehiculo>>(`${API}/vehiculo/${idVehiculo}`, vehiculo)
      .pipe(
        tap(() => this.actulizarVehiculosUsuario('crear')),
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Vehiculo>>(error))
      );
  }

  borrarVehiculo(vehiculo: object): Observable<Respuesta<Vehiculo>> {
    this.subscripcionCliente = this.servicioClientes.obtenerClienteVin((vehiculo as Vehiculo).vin).subscribe({
      next: cliente => this.subscripcionBorradoCliente = this.servicioClientes.borrarCliente(cliente.id ?? -1).subscribe()
    });

    return this.http.delete(`${API}/vehiculo/${(vehiculo as Vehiculo).id}`)
      .pipe(
        tap(() => this.actulizarVehiculosUsuario('borrar', (vehiculo as Vehiculo).id)),
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Vehiculo>>(error))
      );
  }

  async actulizarVehiculosUsuario(accion: 'crear' | 'editar' | 'borrar', idVehiculo?: number) {
    const nif = JSON.parse(localStorage.getItem('usuario') || '').nif;
    let vehiculos: Vehiculo[] = [];

    if (accion !== 'borrar') {
      const vehiculosUsuario = await firstValueFrom(this.obtenerVehiculosUsuario(nif));
      
      vehiculosUsuario!.forEach(coche => vehiculos.push(coche));
      localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    } else {
      let vehiculosUsuario = await firstValueFrom(this.obtenerVehiculosUsuario(nif));
      
      vehiculosUsuario = vehiculosUsuario.filter(coche => coche.id !== idVehiculo!);
      vehiculosUsuario!.forEach(coche => vehiculos.push(coche));
      localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    }
  }
}
