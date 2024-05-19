import { Component } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, switchMap } from 'rxjs';
import { Reparacion } from '../../../interfaces/reparacion';
import { ReparacionesService } from '../../../services/reparaciones.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reparaciones-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reparaciones-admin.component.html',
  styleUrl: './reparaciones-admin.component.sass'
})
export class ReparacionesAdminComponent {
  reparaciones$?: Observable<Reparacion[]>;
  filtro$ = new BehaviorSubject<string>('');

  constructor(private servicioReparaciones: ReparacionesService) { }

  ngOnInit(): void {
    this.reparaciones$ = this.filtro$.pipe(
      debounceTime(300),
      switchMap(filtro => filtro ? this.servicioReparaciones.obtenerReparacionesFiltrado(filtro) : this.servicioReparaciones.obtenerReparaciones())
    );
  }

  buscar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    this.filtro$.next(input.value);
  }
}
