import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCalendarCellCssClasses, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../interfaces/servicio';
import { Observable, Subscription, combineLatest, map, startWith, switchMap } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { MarcarDiasCalendarioDirective } from '../../directives/marcar-dias-calendario.directive';

@Component({
  selector: 'app-reservas',
  standalone: true,
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  imports: [MatFormFieldModule, MatSelectModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, CommonModule, MarcarDiasCalendarioDirective],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.sass'
})
export class ReservasComponent implements OnInit, OnDestroy {
  servReparacion$!: Observable<Servicio[]>;
  servMantenimiento$!: Observable<Servicio[]>;
  precio$?: Observable<number>;
  subscripcionReservas!: Subscription;
  reparacionesSeleccionado = new FormControl();
  mantenimientosSeleccionado = new FormControl();
  fechasOcupadas: Date[] = [];
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDate());

  constructor(
    @Inject(MAT_DATE_LOCALE) private _locale: string, private _adapter: DateAdapter<Date>, 
    private servicioServicios: ServiciosService, private servicioReservas: ReservasService
  ) { } 

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

    this.subscripcionReservas = this.servicioReservas.obtenerReservas().subscribe(reservas => {
      reservas.map(reserva => {
        const fechaStr = reserva.fecha.split('-');
        const fecha = new Date(`${fechaStr[2]}-${fechaStr[1]}-${fechaStr[0]}`);
        
        this.fechasOcupadas.push(fecha)
      });
    });

    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);
    
    this.fechasOcupadas.forEach(fecha => this.dateClass(fecha));
  }

  ngOnDestroy(): void {
    this.subscripcionReservas.unsubscribe();
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    const classes: MatCalendarCellCssClasses = {};
    const fecha = date.toDateString();

    if (this.fechasOcupadas.find(dia => dia.toDateString() === fecha)) 
      classes['dia-ocupado'] = true;

    if (date.getDay() === 0) 
      classes['domingo'] = true;

    return classes;
  }
}
