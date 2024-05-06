import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../interfaces/servicio';
import { Observable, combineLatest, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-reservas',
  standalone: true,
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  imports: [MatFormFieldModule, MatSelectModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.sass'
})
export class ReservasComponent implements OnInit {
  servReparacion$!: Observable<Servicio[]>;
  servMantenimiento$!: Observable<Servicio[]>;
  precio$?: Observable<number>;
  reparacionesSeleccionado = new FormControl();
  mantenimientosSeleccionado = new FormControl();

  constructor(@Inject(MAT_DATE_LOCALE) private _locale: string, private _adapter: DateAdapter<any>, private servicioServicios: ServiciosService) { }

  ngOnInit(): void {
    this.servReparacion$ = this.servicioServicios.obtenerServiciosReparacion();
    this.servMantenimiento$ = this.servicioServicios.obtenerServiciosMantenimiento();
  
    const todosServicios$ = combineLatest([this.servReparacion$, this.servMantenimiento$]).pipe(
      map(([reparacion, mantenimiento]) => [...reparacion, ...mantenimiento])
    );
  
    this.precio$ = combineLatest([
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
    );

    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);
  }
}
