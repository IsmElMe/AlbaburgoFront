import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service';
import { Observable, Subscription} from 'rxjs';
import { Reserva } from '../../../interfaces/reserva';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReservasPendientesModalComponent } from '../../modals/admin/reservas-pendientes-modal/reservas-pendientes-modal.component';
import { DetallesModalComponent } from '../../modals/detalles-modal/detalles-modal.component';

@Component({
  selector: 'app-reservas-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-pendientes.component.html',
  styleUrl: './reservas-pendientes.component.sass'
})
export class ReservasPendientesComponent implements OnInit, OnDestroy {
  reservasPendientes$!: Observable<Reserva[]>;
  subscripcionModalAceptar?: Subscription;
  subscripcionModalRechazar?: Subscription;

  constructor(private servicioReservas: ReservasService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.reservasPendientes$ = this.servicioReservas.obtenerReservasFiltrado('pendiente');
  }

  ngOnDestroy(): void {
    this.subscripcionModalAceptar?.unsubscribe();
    this.subscripcionModalRechazar?.unsubscribe();
  }

  aceptarReserva(reserva: Reserva): void {
    this.dialog.open(ReservasPendientesModalComponent, { data: { aceptada: true, reserva: reserva } }).afterClosed().subscribe({
      next: () => {
        this.reservasPendientes$ = this.servicioReservas.obtenerReservasFiltrado('pendiente');
      }
    });
  }

  detallesReserva(reserva: Reserva): void {
    this.dialog.open(DetallesModalComponent, { data: { reserva: reserva } });
  }

  rechazarReserva(reserva: Reserva): void {
    this.dialog.open(ReservasPendientesModalComponent, { data: { aceptada: false, reserva: reserva } }).afterClosed().subscribe({
      next: () => {
        this.reservasPendientes$ = this.servicioReservas.obtenerReservasFiltrado('pendiente');
      }
    });
  }
}
