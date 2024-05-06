import { Component } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, switchMap } from 'rxjs';
import { Servicio } from '../../../interfaces/servicio';
import { ServiciosService } from '../../../services/servicios.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// import { ServicioModalComponent } from '../../modals/admin/servicio-modal/servicio-modal.component';

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios-admin.component.html',
  styleUrl: './servicios-admin.component.sass'
})
export class ServiciosAdminComponent {
  servicios$?: Observable<Servicio[]>;
  filtro$ = new BehaviorSubject<string>('');

  constructor(private servicioServicios: ServiciosService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.servicios$ = this.filtro$.pipe(
      debounceTime(300),
      switchMap(filtro => filtro ? this.servicioServicios.obtenerServiciosFiltrado(filtro) : this.servicioServicios.obtenerServicios())
    );
  }

  modalServicio(servicio: Servicio): void {
  //   this.dialog.open(ServicioModalComponent, { data: { servicio: servicio } });
  }

  buscar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    this.filtro$.next(input.value);
  }
}
