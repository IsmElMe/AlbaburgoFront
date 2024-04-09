import { Routes } from '@angular/router';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: PrincipalComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: NotFoundComponent }
];
