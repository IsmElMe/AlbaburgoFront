import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service';
import { Observable } from 'rxjs';
import { Reserva } from '../../../interfaces/reserva';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-pendientes.component.html',
  styleUrl: './reservas-pendientes.component.sass'
})
export class ReservasPendientesComponent implements OnInit {
  reservasPendientes$!: Observable<Reserva[]>;

  constructor(private servicioReservas: ReservasService) { }

  ngOnInit(): void {
    this.reservasPendientes$ = this.servicioReservas.obtenerReservasFiltrado('pendiente');
  }

  aceptarReserva(): void {

  }

  rechazarReserva(): void {
    
  }
}
