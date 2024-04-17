import { Routes } from '@angular/router';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { NotFoundComponent } from './components/not-found/not-found.component'

export const routes: Routes = [
    { path: '', component: PrincipalComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'perfil', loadComponent: () => import('./components/perfil-usuario/perfil-usuario.component').then(c => c.PerfilUsuarioComponent) },
    { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(c => c.AdminComponent), children: [
        { path: '', loadComponent: () => import('./components/admin/panel-admin/panel-admin.component').then(c => c.PanelAdminComponent) },
        { path: 'usuarios', loadComponent: () => import('./components/admin/usuarios-admin/usuarios-admin.component').then(c => c.UsuariosAdminComponent) }
    ] },
    { path: '**', component: NotFoundComponent }
];
