import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiciosService } from '../../../services/servicios.service';
import { Observable } from 'rxjs';
import { Servicio } from '../../../interfaces/servicio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './form-reserva.component.html',
  styleUrl: './form-reserva.component.sass'
})
export class FormReservaComponent implements OnInit {
  servReparacion$!: Observable<Servicio[]>;
  servMantenimiento$!: Observable<Servicio[]>;
  reparacionesSeleccionado = new FormControl();
  mantenimientosSeleccionado = new FormControl();
  fechaSeleccionada!: string;
  serviciosSeleccionados: string[] = [];

  constructor(private fb: FormBuilder, private servicioServicios: ServiciosService) { }
  
  ngOnInit(): void {
    this.fechaSeleccionada = sessionStorage.getItem('fechaReserva') || '';
    this.serviciosSeleccionados = JSON.parse(sessionStorage.getItem('serviciosSeleccionados') || '[]');
    this.servReparacion$ = this.servicioServicios.obtenerServiciosReparacion();
    this.servMantenimiento$ = this.servicioServicios.obtenerServiciosMantenimiento();
    this.reparacionesSeleccionado.setValue(this.serviciosSeleccionados);
    this.mantenimientosSeleccionado.setValue(this.serviciosSeleccionados);
  }
}
