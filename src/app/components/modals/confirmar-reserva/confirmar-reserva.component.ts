import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { ReservasService } from '../../../services/reservas.service';
import { Reserva, estadoReserva } from '../../../interfaces/reserva';
import { CrearModalComponent } from '../crear-modal/crear-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmar-reserva',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './confirmar-reserva.component.html',
  styleUrl: './confirmar-reserva.component.sass'
})
export class ConfirmarReservaComponent implements OnDestroy {
  idCliente = JSON.parse(localStorage.getItem('usuario') || '').id;
  subscripcionReserva?: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { servicios: string[], fecha: string[], vehiculo: string },
    private dialog: MatDialog, private servicioReservas: ReservasService
  ) { }

  ngOnDestroy(): void {
      this.subscripcionReserva?.unsubscribe();
  }

  confirmarReserva(): void {
    const reserva: Reserva = {
      id_cliente: this.idCliente,
      fecha: this.data.fecha[0],
      hora: this.data.fecha[1],
      estado: 'pendiente' as estadoReserva
    };
    
    this.subscripcionReserva = this.servicioReservas.crearReserva(reserva).subscribe({
      next: () => {
        this.dialog.open(CrearModalComponent, { data: { creado: true, tipo: 'la reserva' } });
      },
      error: () => {
        this.dialog.open(CrearModalComponent, { data: { creado: false, tipo: 'la reserva' } })
      }
    });
  }
}
