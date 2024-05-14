import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiciosService } from '../../../services/servicios.service';
import { Observable } from 'rxjs';
import { Servicio } from '../../../interfaces/servicio';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { VehiculoComponent } from '../../vehiculo/vehiculo.component';
import { VehiculoService } from '../../../services/vehiculo.service';
import { Vehiculo } from '../../../interfaces/vehiculo';

@Component({
  selector: 'app-form-reserva',
  standalone: true,
  imports: [VehiculoComponent, CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, RouterLink],
  templateUrl: './form-reserva.component.html',
  styleUrl: './form-reserva.component.sass'
})
export class FormReservaComponent implements OnInit {
  servReparacion$!: Observable<Servicio[]>;
  servMantenimiento$!: Observable<Servicio[]>;
  vehiculos$!: Observable<Vehiculo[]>;
  reparacionesSeleccionado = new FormControl();
  mantenimientosSeleccionado = new FormControl();
  vehiculoSeleccionado?: Vehiculo;
  nifUsuario = JSON.parse(localStorage.getItem('usuario') || '').nif;
  fechaSeleccionada!: string;
  diaSeleccionado!: string;
  horaSeleccionada!: string;
  serviciosSeleccionados: string[] = [];

  constructor(private fb: FormBuilder, private servicioVehiculos: VehiculoService, private servicioServicios: ServiciosService) { }
  
  ngOnInit(): void {
    this.fechaSeleccionada = sessionStorage.getItem('fechaReserva') || '';
    this.serviciosSeleccionados = JSON.parse(sessionStorage.getItem('serviciosSeleccionados') || '[]');
    this.servReparacion$ = this.servicioServicios.obtenerServiciosReparacion();
    this.servMantenimiento$ = this.servicioServicios.obtenerServiciosMantenimiento();
    this.vehiculos$ = this.servicioVehiculos.obtenerVehiculosUsuario(this.nifUsuario);
    this.reparacionesSeleccionado.setValue(this.serviciosSeleccionados);
    this.mantenimientosSeleccionado.setValue(this.serviciosSeleccionados);

    [this.diaSeleccionado, this.horaSeleccionada] = this.fechaSeleccionada.split(",");
  }

  seleccionarVehiculo(vehiculo: Vehiculo) {
    this.vehiculoSeleccionado = vehiculo;
  }
}
