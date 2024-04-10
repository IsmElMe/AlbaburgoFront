import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token');
    let peticion = request.clone();
    
    if (token) {
      peticion = peticion.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    if (request.method === 'POST' || request.method === 'PUT') {
      peticion = peticion.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }

    return next.handle(peticion);
  }
}
