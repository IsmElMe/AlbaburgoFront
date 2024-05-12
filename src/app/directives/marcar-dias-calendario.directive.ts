import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ReservasService } from '../services/reservas.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appMarcarDiasCalendario]',
  standalone: true
})
export class MarcarDiasCalendarioDirective implements AfterViewInit, OnDestroy {
  subscripcionReservas!: Subscription;
  fechasOcupadas: Date[] = [];

  constructor(private element: ElementRef, private renderer: Renderer2, private servicioReservas: ReservasService) { }

  ngAfterViewInit() {
    this.subscripcionReservas = this.servicioReservas.obtenerReservas().subscribe(reservas => {
      reservas.map(reserva => {
        const fechaStr = reserva.fecha.split('-');
        const fecha = new Date(`${fechaStr[2]}-${fechaStr[1]}-${fechaStr[0]}`);
        const diasCalendario = this.element.nativeElement.querySelectorAll('.mat-calendar-body-cell');

        this.fechasOcupadas.push(fecha);

        diasCalendario.forEach((diaCalendar: Element) => {
          const labelDia = diaCalendar.getAttribute('aria-label');

          if (labelDia !== null) {
            const fechaCalendario = this.transformarFecha(labelDia);

            if (this.fechasOcupadas.find(dia => dia.toDateString() === fechaCalendario.toDateString())) 
              this.renderer.addClass(diaCalendar, 'dia-ocupado');

            if (fechaCalendario.getDay() === 0)
              this.renderer.addClass(diaCalendar, 'domingo');
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.subscripcionReservas.unsubscribe();
  }

  private transformarFecha(transformar: string): Date {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const partesFecha = transformar.split(' ');
    const dia = parseInt(partesFecha[0]);
    const mes = meses.indexOf(partesFecha[2].toLowerCase());
    const año = parseInt(partesFecha[4]);

    return new Date(año, mes, dia);
  }
}
