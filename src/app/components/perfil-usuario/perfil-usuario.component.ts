import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { Observable, Subscription } from 'rxjs';
import { Vehiculo } from '../../interfaces/vehiculo';
import { VehiculoService } from '../../services/vehiculo.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioModalComponent } from '../modals/admin/usuario-modal/usuario-modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.sass',
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') ?? '');
  vehiculos$!: Observable<Vehiculo[]>;
  subscripcionBorradoVehiculo?: Subscription;

  constructor(private servicioVehiculos: VehiculoService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.vehiculos$ = this.servicioVehiculos.obtenerVehiculosUsuario(this.usuario.nif);
  }

  ngOnDestroy(): void {
    this.subscripcionBorradoVehiculo?.unsubscribe();
  }

  modalUsuario(): void {  
    this.dialog.open(UsuarioModalComponent, { data: { usuario: this.usuario } });
  }

  borrarVehiculo(id: number): void {
    this.subscripcionBorradoVehiculo = this.servicioVehiculos.borrarVehiculo(id).subscribe();
    this.vehiculos$ = this.servicioVehiculos.obtenerVehiculosUsuario(this.usuario.nif);
  }
}
