import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { ReservasService } from '../services/reservas.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appMarcarDiasCalendario]',
  standalone: true
})
export class MarcarDiasCalendarioDirective implements AfterViewInit, OnDestroy {
  subscripcionReservas!: Subscription;
  fechasOcupadas: Date[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2, private servicioReservas: ReservasService) { }

  ngAfterViewInit() {
    this.subscripcionReservas = this.servicioReservas.obtenerReservas().subscribe(reservas => {
      reservas.map(reserva => {
        const fechaStr = reserva.fecha.split('-');
        const fecha = new Date(`${fechaStr[2]}-${fechaStr[1]}-${fechaStr[0]}`);
        const cells = this.el.nativeElement.querySelectorAll('.mat-calendar-body-cell');

        this.fechasOcupadas.push(fecha)

        cells.forEach((cell: Element) => {
          const ariaLabel = cell.getAttribute('aria-label');

          if (ariaLabel !== null) {
            const partesFecha = ariaLabel.split(' ');
            const dia = parseInt(partesFecha[0]);
            const mes = this.obtenerNumeroMes(partesFecha[2]);
            const año = parseInt(partesFecha[4]);
            const date = new Date(año, mes, dia);

            if (this.fechasOcupadas.find(dia => dia.toDateString() === date.toDateString())) {
              this.renderer.addClass(cell, 'dia-ocupado');
            }

            if (date.getDay() === 0)
              this.renderer.addClass(cell, 'domingo');
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.subscripcionReservas.unsubscribe();
  }

  obtenerNumeroMes(nombreMes: string): number {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses.indexOf(nombreMes.toLowerCase());
  }
}
