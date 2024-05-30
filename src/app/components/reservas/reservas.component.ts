import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCalendarCellCssClasses, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../interfaces/servicio';
import { Observable, Subscription, combineLatest, map, startWith, switchMap } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { MarcarDiasCalendarioDirective } from '../../directives/marcar-dias-calendario.directive';
import { RouterLink } from '@angular/router';
import { NgxMaterialTimepickerModule, NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: 'app-reservas',
  standalone: true,
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, NgxMaterialTimepickerModule, FormsModule, ReactiveFormsModule, CommonModule, RouterLink, MarcarDiasCalendarioDirective],
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
  diaSeleccionado: Date | null = null;
  horaSeleccionada?: string;
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDate());
  ocultarReserva = 'd-none';
  temaReloj: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff'
    }
  }

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
            const precioTotal = serviciosSeleccionados
              .map(nombreServicio => servicios.find(servicio => servicio.nombre === nombreServicio)?.precio || 0)
              .reduce((acc, current) => acc + current, 0);
    
            sessionStorage.setItem('serviciosSeleccionados', JSON.stringify(serviciosSeleccionados));
    
            return precioTotal;
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
    this._adapter.getFirstDayOfWeek = () => 1;
  }

  ngOnDestroy(): void {
    this.subscripcionReservas.unsubscribe();
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    const clases: MatCalendarCellCssClasses = {};
    const fecha = date.toDateString();

    if (this.fechasOcupadas.find(dia => dia.toDateString() === fecha)) clases['dia-ocupado'] = true;
    if (date.getDay() === 0) clases['domingo'] = true;

    return clases;
  }

  seleccionarDia(): void {
    const hora = this.horaSeleccionada?.split(':') || ['09', '00'];

    if (!this.horaSeleccionada) this.diaSeleccionado?.setHours(9);
    else this.diaSeleccionado?.setHours(+hora[0], +hora[1]);

    let dia = this.diaSeleccionado!.getDate() < 10 ? `0${this.diaSeleccionado!.getDate()}` : this.diaSeleccionado!.getDate(); 
    let mes = this.diaSeleccionado!.getMonth() + 1 < 10? `0${this.diaSeleccionado!.getMonth() + 1}` : this.diaSeleccionado!.getMonth() + 1;

    sessionStorage.setItem('fechaReserva', `${dia}-${mes}-${this.diaSeleccionado!.getFullYear()},${hora[0]}:${hora[1]}`);
    this.ocultarReserva = 'd-block';
  }

  seleccionarHora(horaSeleccionada: string): void {
    const [tiempo, letras] = horaSeleccionada.split(' ');
    let [hora, minutos] = tiempo.split(':').map(Number);

    if (letras === 'PM' && hora !== 12) hora += 12;
    if (letras === 'AM' && hora === 12) hora = 0;

    const horaFormat = hora.toString().padStart(2, '0');
    const minutosFormat = minutos.toString().padStart(2, '0');

    this.horaSeleccionada = `${horaFormat}:${minutosFormat}`;
    this.diaSeleccionado?.setHours(+horaFormat, +minutosFormat);

    let dia = this.diaSeleccionado!.getDate() < 10 ? `0${this.diaSeleccionado!.getDate()}` : this.diaSeleccionado!.getDate(); 
    let mes = this.diaSeleccionado!.getMonth() + 1 < 10 ? `0${this.diaSeleccionado!.getMonth() + 1}` : this.diaSeleccionado!.getMonth() + 1;
    
    sessionStorage.setItem('fechaReserva', `${dia}-${mes}-${this.diaSeleccionado!.getFullYear()},${horaFormat}:${minutosFormat}`);
  }
}
