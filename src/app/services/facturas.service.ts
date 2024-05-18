import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { Observable, retry, catchError } from 'rxjs';
import { API, errorPeticion } from '../utils';
import { Respuesta } from '../interfaces/respuestas';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  constructor(private http: HttpClient) { }

  obtenerFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${API}/factura`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Factura[]>(error))
     );
  }

  crearFactura(factura: Factura): Observable<Respuesta<Factura>> {
    return this.http.post<Respuesta<Factura>>(`${API}/factura`, factura)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Factura>>(error))
      );
  }

  borrarFactura(factura: Factura): Observable<Respuesta<Factura>> {
    return this.http.delete(`${API}/factura/${factura.id}`)
     .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<Respuesta<Factura>>(error))
      );
  }
}
