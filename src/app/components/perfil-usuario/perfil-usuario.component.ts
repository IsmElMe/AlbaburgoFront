import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { Observable, Subscription, map } from 'rxjs';
import { Vehiculo } from '../../interfaces/vehiculo';
import { VehiculoService } from '../../services/vehiculo.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioModalComponent } from '../modals/admin/usuario-modal/usuario-modal.component';
import { RouterLink } from '@angular/router';
import { VehiculoComponent } from '../vehiculo/vehiculo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink, VehiculoComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.sass',
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') ?? '');
  vehiculos$!: Observable<Vehiculo[]>;
  subscripcionEditar?: Subscription;

  constructor(private servicioVehiculos: VehiculoService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.vehiculos$ = this.servicioVehiculos.obtenerVehiculosUsuario(this.usuario.nif);
  }

  ngOnDestroy(): void {
    this.subscripcionEditar?.unsubscribe();
  }

  modalUsuario(): void {
    this.dialog.open(UsuarioModalComponent, { data: { usuario: this.usuario } }).afterClosed().subscribe({
      next: () => this.usuario = JSON.parse(localStorage.getItem('usuario') ?? '')
    });
  }

  eliminarVehiculo(vin: string): void {
    this.vehiculos$ = this.vehiculos$.pipe(
      map(vehiculos => vehiculos.filter(vehiculo => vehiculo.vin !== vin))
    );
  }
}
