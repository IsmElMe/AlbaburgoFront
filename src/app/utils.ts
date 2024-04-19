import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

export const SERVIDOR = 'http://albaburgo.server';
export const API = 'http://albaburgo.server/api';

export function errorPeticion<T>(error: HttpErrorResponse): Observable<T> {
    if (error.status == 0)
        return throwError(() => new Error(`No se pudo conectar con el servidor ${error.url} \n Error: ${error.headers}`));
    else
        return throwError(() => new Error(`Error en la petición. ${error.status} ${error.statusText} \n Error: ${error.message}`));
} 
