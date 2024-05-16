import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Cliente } from '../interfaces/cliente';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(private http: HttpClient) {}

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${API}/cliente`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Cliente[]>(error))
      );
  }

  obtenerCliente(id_cliente: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${API}/cliente/${id_cliente}`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Cliente>(error))
      );
  }

  obtenerClienteNif(nif: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${API}/cliente/buscar/usuario/${nif}`)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Cliente>(error))
      );
  }

  obtenerClienteVin(vin: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${API}/cliente/buscar/vehiculo/${vin}`)
    .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Cliente>(error))
      );
  }

  crearCliente(cliente: Cliente): Observable<Respuesta<Cliente>> {
    return this.http.post<Respuesta<Cliente>>(`${API}/cliente`, cliente)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Cliente>>(error))
      );
  }

  editarCliente(cliente: Cliente): Observable<Respuesta<Cliente>> {
    return this.http.put<Respuesta<Cliente>>(`${API}/cliente`, cliente)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Cliente>>(error))
      );
  }

  borrarCliente(idCliente: number): Observable<Respuesta<Cliente>> {
    return this.http.delete(`${API}/cliente/${idCliente}`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Cliente>>(error))
      );
  }
}
