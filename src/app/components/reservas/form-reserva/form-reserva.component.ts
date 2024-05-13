import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-reserva.component.html',
  styleUrl: './form-reserva.component.sass'
})
export class FormReservaComponent implements OnInit {
  fechaSeleccionada!: Observable<Date>;

  constructor(private servicioReservas: ReservasService) { }
  
  ngOnInit(): void {
    this.fechaSeleccionada = this.servicioReservas.getFechaSeleccionada();
  }
}
