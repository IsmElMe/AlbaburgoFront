import { Routes } from '@angular/router';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component'
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Taller Albaburgo' },
    { path: 'registro', component: RegistroComponent, title: 'Registro' },
    { path: 'login', component: LoginComponent, title: 'Iniciar sesión' },
    { path: 'perfil', loadComponent: () => import('./components/perfil-usuario/perfil-usuario.component').then(c => c.PerfilUsuarioComponent), canActivate: [authGuard], title: 'Perfil usuario' },
    { path: 'trabajos-anteriores', loadComponent: () => import('./components/trabajos-anteriores/trabajos-anteriores.component').then(c => c.TrabajosAnterioresComponent), title: 'Trabajos anteriores' },
    { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(c => c.AdminComponent), canActivate: [authGuard, adminGuard], title: 'Administración', children: [
        { path: '', loadComponent: () => import('./components/admin/panel-admin/panel-admin.component').then(c => c.PanelAdminComponent) },
        { path: 'usuarios', loadComponent: () => import('./components/admin/usuarios-admin/usuarios-admin.component').then(c => c.UsuariosAdminComponent) }
    ] },
    { path: '**', component: NotFoundComponent, title: '404 Página no encontrada' }
];
