import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../interfaces/servicio';
import { Observable, Subscription, combineLatest, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.sass'
})
export class ReservasComponent implements OnInit, OnDestroy {
  servReparacion$!: Observable<Servicio[]>;
  servMantenimiento$!: Observable<Servicio[]>;
  reparacionesSeleccionado = new FormControl();
  mantenimientosSeleccionado = new FormControl();
  subscripcionPrecio!: Subscription;
  precio = 0;

  constructor(private servicioServicios: ServiciosService) { }

  ngOnInit(): void {
    this.servReparacion$ = this.servicioServicios.obtenerServiciosReparacion();
    this.servMantenimiento$ = this.servicioServicios.obtenerServiciosMantenimiento();
  
    const todosServicios$ = combineLatest([this.servReparacion$, this.servMantenimiento$]).pipe(
      map(([reparacion, mantenimiento]) => [...reparacion, ...mantenimiento])
    );
  
    this.subscripcionPrecio = combineLatest([
      this.reparacionesSeleccionado.valueChanges.pipe(startWith(this.reparacionesSeleccionado.value || [])),
      this.mantenimientosSeleccionado.valueChanges.pipe(startWith(this.mantenimientosSeleccionado.value || []))
    ]).pipe(
      switchMap(([reparacionesSeleccionados, mantenimientosSeleccionado]) => 
        todosServicios$.pipe(
          map(servicios => {
            const serviciosSeleccionados = [...(Array.isArray(reparacionesSeleccionados) ? reparacionesSeleccionados : []), ...(Array.isArray(mantenimientosSeleccionado) ? mantenimientosSeleccionado : [])];
            
            return serviciosSeleccionados
              .map(nombreServicio => servicios.find(servicio => servicio.nombre === nombreServicio)?.precio || 0)
              .reduce((acc, current) => acc + current, 0);
          })
        )
      )
    ).subscribe(precio => this.precio = precio);
  }

  ngOnDestroy(): void {
    this.subscripcionPrecio.unsubscribe();
  }
}
