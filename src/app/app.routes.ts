import { Routes } from '@angular/router';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component'
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { reservaGuard } from './guards/reserva.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Taller Albaburgo' },
    { path: 'registro', component: RegistroComponent, title: 'Registro' },
    { path: 'login', component: LoginComponent, title: 'Iniciar sesión' },
    {
        path: 'perfil', title: 'Perfil usuario',
        loadComponent: () => import('./components/perfil-usuario/perfil-usuario.component').then(c => c.PerfilUsuarioComponent),
        canActivate: [authGuard]
    },
    {
        path: 'crear-vehiculo', title: 'Añadir vehículo',
        loadComponent: () => import('./components/crear-vehiculo/crear-vehiculo.component').then(c => c.CrearVehiculoComponent),
        canActivate: [authGuard]
    },
    {
        path: 'trabajos-anteriores', title: 'Trabajos anteriores',
        loadComponent: () => import('./components/trabajos-anteriores/trabajos-anteriores.component').then(c => c.TrabajosAnterioresComponent),
    },
    {
        path: 'reservas', title: 'Reservas',
        loadComponent: () => import('./components/reservas/reservas.component').then(c => c.ReservasComponent),
        canActivate: [authGuard]
    },
    {
        path: 'reservas/formulario', title: 'Formulario reserva',
        loadComponent: () => import('./components/reservas/form-reserva/form-reserva.component').then(c => c.FormReservaComponent),
        canActivate: [authGuard, reservaGuard]
    },
    {
        path: 'admin', title: 'Administración',
        loadComponent: () => import('./components/admin/admin.component').then(c => c.AdminComponent),
        canActivate: [authGuard, adminGuard], children: [
            { path: '', loadComponent: () => import('./components/admin/panel-admin/panel-admin.component').then(c => c.PanelAdminComponent) },
            { path: 'reservas-pendientes', loadComponent: () => import('./components/admin/reservas-pendientes/reservas-pendientes.component').then(c => c.ReservasPendientesComponent) },
            { path: 'usuarios', loadComponent: () => import('./components/admin/usuarios-admin/usuarios-admin.component').then(c => c.UsuariosAdminComponent) },
            { path: 'vehiculos', loadComponent: () => import('./components/admin/vehiculos-admin/vehiculos-admin.component').then(c => c.VehiculosAdminComponent) },
            { path: 'servicios', loadComponent: () => import('./components/admin/servicios-admin/servicios-admin.component').then(c => c.ServiciosAdminComponent) }
        ]
    },
    { path: '**', component: NotFoundComponent, title: '404 Página no encontrada' }
];
