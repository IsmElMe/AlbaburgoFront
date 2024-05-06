import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './auth.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideHttpClient(withFetch()), provideAnimationsAsync(), 
    importProvidersFrom(HttpClientModule), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideNativeDateAdapter()
  ]
};
