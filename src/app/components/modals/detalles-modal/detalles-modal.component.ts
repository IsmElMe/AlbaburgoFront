import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Reserva } from '../../../interfaces/reserva';
import { Reparacion } from '../../../interfaces/reparacion';
import { VehiculoComponent } from '../../vehiculo/vehiculo.component';
import { Vehiculo } from '../../../interfaces/vehiculo';
import { Observable, Subscription, take } from 'rxjs';
import { ClientesService } from '../../../services/clientes.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalles-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, CommonModule, VehiculoComponent],
  templateUrl: './detalles-modal.component.html',
  styleUrl: './detalles-modal.component.sass'
})
export class DetallesModalComponent implements OnInit, OnDestroy {
  subscripcionCliente?: Subscription;
  vehiculo$?: Observable<Vehiculo[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { reserva: Reserva, reparacion: Reparacion },
    private servicioClientes: ClientesService, private servicioVehiculo: VehiculoService
  ) { }

  ngOnInit(): void {
    if (this.data.reparacion) {
      this.servicioClientes.obtenerCliente(this.data.reparacion.id_cliente).subscribe({
        next: cliente => {
          this.vehiculo$ = this.servicioVehiculo.obtenerVehiculosFiltrado(cliente.vin_vehiculo).pipe(take(1));
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscripcionCliente?.unsubscribe();
  }

  descargarParte() {
    this.data.reserva 
      ? window.open(`http://albaburgo.server/descargar-parte/${this.data.reserva.parte_seguro}`)
      : window.open(`http://albaburgo.server/descargar-parte/${this.data.reparacion.parte_seguro}`);
  }
}
