import { Component } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, switchMap } from 'rxjs';
import { Reserva } from '../../../interfaces/reserva';
import { ReservasService } from '../../../services/reservas.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reservas-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservas-admin.component.html',
  styleUrl: './reservas-admin.component.sass'
})
export class ReservasAdminComponent {
  reservas$?: Observable<Reserva[]>;
  filtro$ = new BehaviorSubject<string>('');

  constructor(private servicioReservas: ReservasService) { }

  ngOnInit(): void {
    this.reservas$ = this.filtro$.pipe(
      debounceTime(300),
      switchMap(filtro => filtro ? this.servicioReservas.obtenerReservasFiltrado(filtro) : this.servicioReservas.obtenerReservas())
    );
  }

  buscar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    this.filtro$.next(input.value);
  }
}
