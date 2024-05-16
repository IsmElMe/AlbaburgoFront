import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Correo } from '../interfaces/correo';
import { Observable, catchError, retry } from 'rxjs';
import { SERVIDOR, errorPeticion } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) { }

  enviarCorreo(correo: Correo): Observable<{mensaje: string}> {
    return this.http.post<{mensaje: string}>(`${SERVIDOR}/correo`, correo)
      .pipe(
        retry(2),
        catchError((error: HttpErrorResponse) => errorPeticion<{mensaje: string}>(error))
      );
  }
}
