import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, switchMap } from 'rxjs';
import { Vehiculo } from '../../../interfaces/vehiculo';
import { VehiculoService } from '../../../services/vehiculo.service';
import { MatDialog } from '@angular/material/dialog';
import { VehiculoModalComponent } from '../../modals/admin/vehiculo-modal/vehiculo-modal.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vehiculos-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehiculos-admin.component.html',
  styleUrl: './vehiculos-admin.component.sass'
})
export class VehiculosAdminComponent implements OnInit {
  vehiculos$?: Observable<Vehiculo[]>;
  filtro$ = new BehaviorSubject<string>('');

  constructor(private servicioVehiculos: VehiculoService, private dialog: MatDialog) { }

  ngOnInit(): void {
      this.vehiculos$ = this.filtro$.pipe(
        debounceTime(300),
        switchMap(filtro => filtro ? this.servicioVehiculos.obtenerVehiculosFiltrado(filtro) : this.servicioVehiculos.obtenerVehiculos())
      );
  }

  modalVehiculo(vehiculo: Vehiculo): void {
    this.dialog.open(VehiculoModalComponent, { data: { vehiculo: vehiculo } });
  }

  buscar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    this.filtro$.next(input.value);
  }
}
