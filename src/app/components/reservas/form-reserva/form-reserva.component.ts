import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiciosService } from '../../../services/servicios.service';
import { Observable, Subscription } from 'rxjs';
import { Servicio } from '../../../interfaces/servicio';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { VehiculoComponent } from '../../vehiculo/vehiculo.component';
import { VehiculoService } from '../../../services/vehiculo.service';
import { Vehiculo } from '../../../interfaces/vehiculo';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarReservaComponent } from '../../modals/confirmar-reserva/confirmar-reserva.component';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-form-reserva',
  standalone: true,
  imports: [VehiculoComponent, CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, RouterLink],
  templateUrl: './form-reserva.component.html',
  styleUrl: './form-reserva.component.sass'
})
export class FormReservaComponent implements OnInit, OnDestroy {
  servReparacion$!: Observable<Servicio[]>;
  servMantenimiento$!: Observable<Servicio[]>;
  vehiculos$!: Observable<Vehiculo[]>;
  reparacionesControl = new FormControl();
  mantenimientosControl = new FormControl();
  subscripcionReparaciones!: Subscription;
  subscripcionMantenimientos!: Subscription;
  subscripcionCliente?: Subscription;
  vehiculoSeleccionado?: Vehiculo;
  nifUsuario = JSON.parse(localStorage.getItem('usuario') || '').nif;
  fechaSeleccionada!: string;
  diaSeleccionado!: string;
  horaSeleccionada!: string;
  reparacionesSeleccionado: string[] = [];
  mantenimientosSeleccionado: string[] = [];
  serviciosSeleccionados: string[] = [];
  imagen?: string;
  parteSeguro?: string;
  reservaAutomatica?: number;
  reservar = false;
  parteSeguroCheck = false;
  reservaAutomaticaCheck = false;

  constructor(
    private dialog: MatDialog, private servicioVehiculos: VehiculoService, 
    private servicioServicios: ServiciosService, private servicioClientes: ClientesService
  ) { }
  
  ngOnInit(): void {
    const serviciosPresupuesto = JSON.parse(sessionStorage.getItem('serviciosSeleccionados') || '[]');

    this.fechaSeleccionada = sessionStorage.getItem('fechaReserva') || '';
    this.servReparacion$ = this.servicioServicios.obtenerServiciosReparacion();
    this.servMantenimiento$ = this.servicioServicios.obtenerServiciosMantenimiento();
    this.vehiculos$ = this.servicioVehiculos.obtenerVehiculosUsuario(this.nifUsuario);
    this.reparacionesControl.setValue(serviciosPresupuesto);
    this.mantenimientosControl.setValue(serviciosPresupuesto);
    this.serviciosSeleccionados = [...serviciosPresupuesto];
    this.reparacionesSeleccionado = serviciosPresupuesto.filter((servicio: string) => servicio.startsWith('Repara'));

    this.subscripcionReparaciones = this.reparacionesControl.valueChanges.subscribe((reparaciones: string[]) => {
      this.reparacionesSeleccionado = [...reparaciones];
      
      if (reparaciones.some(servicio => serviciosPresupuesto.includes(servicio)))
        this.serviciosSeleccionados = [...serviciosPresupuesto, ...this.reparacionesSeleccionado, ...this.mantenimientosSeleccionado];
      else {
        this.serviciosSeleccionados = [...this.reparacionesSeleccionado, ...this.mantenimientosSeleccionado];
        this.serviciosSeleccionados = this.serviciosSeleccionados.filter(servicio =>
          !serviciosPresupuesto.some((servicioPresupuesto: string) => servicioPresupuesto === servicio)
        );
      }
        
      this.serviciosSeleccionados = this.eliminarServiciosDuplicados(this.serviciosSeleccionados);
      this.comprobarDatos();
    });
  
    this.subscripcionMantenimientos = this.mantenimientosControl.valueChanges.subscribe((mantenimientos: string[]) => {
      this.mantenimientosSeleccionado = [...mantenimientos];

      if (mantenimientos.some(servicio => serviciosPresupuesto.includes(servicio)))
        this.serviciosSeleccionados = [...serviciosPresupuesto, ...this.reparacionesSeleccionado, ...this.mantenimientosSeleccionado];
      else {
        this.serviciosSeleccionados = [...this.reparacionesSeleccionado, ...this.mantenimientosSeleccionado];
        this.serviciosSeleccionados = this.serviciosSeleccionados.filter(servicio =>
          !serviciosPresupuesto.some((servicioPresupuesto: string) => servicioPresupuesto === servicio)
        );
      }
      
      this.serviciosSeleccionados = this.eliminarServiciosDuplicados(this.serviciosSeleccionados);
      this.comprobarDatos();
    });

    [this.diaSeleccionado, this.horaSeleccionada] = this.fechaSeleccionada.split(',');
  }

  ngOnDestroy(): void {
    this.subscripcionMantenimientos.unsubscribe();
    this.subscripcionReparaciones.unsubscribe();
    this.subscripcionCliente?.unsubscribe();
  }

  seleccionarVehiculo(vehiculo: Vehiculo) {
    this.vehiculoSeleccionado = vehiculo;
    this.comprobarDatos();
  }

  subirImagen(evento: Event): void {
    const reader = new FileReader();
    const imagen = (evento.target as HTMLInputElement).files![0];

    reader.readAsDataURL(imagen);
    reader.onload = () => {
      this.imagen = reader.result?.toString();
    };
  }

  subirParteSeguro(evento: Event) {
    const reader = new FileReader();
    const parte = (evento.target as HTMLInputElement).files![0];

    reader.readAsDataURL(parte);
    reader.onload = () => {
      this.parteSeguro = reader.result?.toString();
    };
  }

  modalConfirmarReserva(): void {
    if (!this.reservaAutomaticaCheck) this.reservaAutomatica = undefined;

    this.subscripcionCliente = this.servicioClientes.obtenerClienteVin(this.vehiculoSeleccionado!.vin).subscribe({
      next: cliente => sessionStorage.setItem('id_cliente', cliente.id!.toString())
    });

    this.dialog.open(ConfirmarReservaComponent, { 
      data: { 
        servicios: this.serviciosSeleccionados, 
        fecha: [this.diaSeleccionado, this.horaSeleccionada], 
        vehiculo: `${this.vehiculoSeleccionado!.fabricante} ${this.vehiculoSeleccionado!.modelo}`,
        imagen: this.imagen,
        parte: this.parteSeguro,
        frecuencia: this.reservaAutomatica
      } 
    });
  }

  eliminarServiciosDuplicados(servicios: string[]): string[] {
    let aux: string[] = [];

    servicios.forEach(servicio => {
      if (aux.indexOf(servicio) === -1) aux.push(servicio);
    });

    return aux;
  }

  comprobarDatos(): void {
    if (this.vehiculoSeleccionado && this.serviciosSeleccionados.length !== 0)
      this.reservar = true;
    else this.reservar = false;
  }
}
