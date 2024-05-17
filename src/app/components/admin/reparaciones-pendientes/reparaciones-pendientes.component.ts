import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReparacionesService } from '../../../services/reparaciones.service';
import { Observable, Subscription, switchMap } from 'rxjs';
import { Reparacion } from '../../../interfaces/reparacion';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../interfaces/usuario';
import { ClientesService } from '../../../services/clientes.service';
import { Vehiculo } from '../../../interfaces/vehiculo';
import { UsuarioService } from '../../../services/usuario.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { MatDialog } from '@angular/material/dialog';
import { ReparacionModalComponent } from '../../modals/admin/reparacion-modal/reparacion-modal.component';

@Component({
  selector: 'app-reparaciones-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reparaciones-pendientes.component.html',
  styleUrl: './reparaciones-pendientes.component.sass'
})
export class ReparacionesPendientesComponent implements OnInit, OnDestroy {
  nif = JSON.parse(localStorage.getItem('usuario') ?? '').nif;
  reparaciones$!: Observable<Reparacion[]>;
  subscripcionFinalizar?: Subscription;
  subscripcionCancelar?: Subscription;

  constructor(
    private servicioReparaciones: ReparacionesService, private servicioClientes: ClientesService, 
    private servicioUsuarios: UsuarioService, private servicioVehiculos: VehiculoService,
    private modal: MatDialog
  ) {}

  ngOnInit(): void {
    this.reparaciones$ = this.servicioReparaciones.obtenerReparacionesMecanico(this.nif);
  }

  ngOnDestroy(): void {
    this.subscripcionFinalizar?.unsubscribe();
    this.subscripcionCancelar?.unsubscribe();
  }

  obtenerUsuario(idCliente: number): Observable<Usuario> {
    return this.servicioClientes.obtenerCliente(idCliente).pipe(
      switchMap(cliente => this.servicioUsuarios.obtenerUsuario(cliente.nif_usuario))
    );
  }

  obtenervehiculo(idCliente: number): Observable<Vehiculo> {
    return this.servicioClientes.obtenerCliente(idCliente).pipe(
      switchMap(cliente => this.servicioVehiculos.obtenerVehiculo(cliente.nif_usuario))
    );
  }

  finalizarReparacion(reparacion: Reparacion) {
    this.subscripcionFinalizar = this.modal.open(ReparacionModalComponent, { data: { finalizado: true, reparacion: reparacion } }).afterClosed().subscribe({
      next: () => {
        this.reparaciones$ = this.servicioReparaciones.obtenerReparacionesMecanico(this.nif);
      }
    });
  }

  cancelarReparacion(reparacion: Reparacion) {
    this.subscripcionCancelar = this.modal.open(ReparacionModalComponent, { data: { finalizado: false, reparacion: reparacion } }).afterClosed().subscribe({
      next: () => {
        this.reparaciones$ = this.servicioReparaciones.obtenerReparacionesMecanico(this.nif);
      }
    });
  }
}
