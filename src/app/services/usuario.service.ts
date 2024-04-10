import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, concatAll, mergeAll, of, switchAll, switchMap } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { API, errorPeticion } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private headers = { 'Authorization: ': `Bearer ${sessionStorage.getItem('token')}` }

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<Usuario[]> {  
    return this.http.get<Usuario[]>(`${API}/usuario`)
      .pipe(
        // switchMap(respuesta => respuesta),
        // catchError((error: HttpErrorResponse) => errorPeticion<Usuario[]>(error))
      );
  }
}
