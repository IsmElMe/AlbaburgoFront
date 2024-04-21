import { Routes } from '@angular/router';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component'

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'perfil', loadComponent: () => import('./components/perfil-usuario/perfil-usuario.component').then(c => c.PerfilUsuarioComponent) },
    { path: 'trabajos-anteriores', loadComponent: () => import('./components/trabajos-anteriores/trabajos-anteriores.component').then(c => c.TrabajosAnterioresComponent) },
    { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(c => c.AdminComponent), children: [
        { path: '', loadComponent: () => import('./components/admin/panel-admin/panel-admin.component').then(c => c.PanelAdminComponent) },
        { path: 'usuarios', loadComponent: () => import('./components/admin/usuarios-admin/usuarios-admin.component').then(c => c.UsuariosAdminComponent) }
    ] },
    { path: '**', component: NotFoundComponent }
];
