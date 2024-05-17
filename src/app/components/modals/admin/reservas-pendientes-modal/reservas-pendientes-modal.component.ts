import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { UsuarioService } from '../../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { Usuario } from '../../../../interfaces/usuario';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Reserva } from '../../../../interfaces/reserva';
import { VehiculoService } from '../../../../services/vehiculo.service';
import { ReservasService } from '../../../../services/reservas.service';
import { ClientesService } from '../../../../services/clientes.service';
import { MailService } from '../../../../services/mail.service';
import { Correo } from '../../../../interfaces/correo';
import { FormsModule } from '@angular/forms';
import { Reparacion } from '../../../../interfaces/reparacion';
import { ReparacionesService } from '../../../../services/reparaciones.service';

@Component({
  selector: 'app-reservas-pendientes-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatFormFieldModule, MatSelectModule, FormsModule, CommonModule],
  templateUrl: './reservas-pendientes-modal.component.html',
  styleUrl: './reservas-pendientes-modal.component.sass'
})
export class ReservasPendientesModalComponent implements OnInit, OnDestroy {
  subscripcionCorreo?: Subscription;
  subscripcionCliente?: Subscription;
  subscripcionUsuario?: Subscription;
  subscripcionDatos?: Subscription;
  subscripcionReserva?: Subscription;
  subscripcionReparacion?: Subscription;
  mecanicos$!: Observable<Usuario[]>;
  mecanicoSeleccionado?: Usuario;
  descripcionReparacion?: string;
  motivoRechazar?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { aceptada: boolean, reserva: Reserva }, private dialogRef: MatDialogRef<ReservasPendientesModalComponent>, 
    private servicioReservas: ReservasService, private servicioReparaciones: ReparacionesService, private servicioClientes: ClientesService, 
    private servicioUsuarios: UsuarioService, private servicioVehiculo: VehiculoService, private servicioCorreo: MailService
  ) { }

  ngOnInit(): void {
    this.mecanicos$ = this.servicioUsuarios.obtenerUsuariosRol(3);
  }

  ngOnDestroy(): void {
    this.subscripcionCorreo?.unsubscribe();
    this.subscripcionCliente?.unsubscribe();
    this.subscripcionUsuario?.unsubscribe();
    this.subscripcionDatos?.unsubscribe();
    this.subscripcionReserva?.unsubscribe();
    this.subscripcionReparacion?.unsubscribe();
  }

  aceptarReserva(): void {
    let servicios = '';
    this.data.reserva.estado = 'aceptada';

    this.data.reserva.servicios!.forEach(servicio => {
      servicios += `<li>${servicio.nombre}</li>`;
    });

    this.subscripcionCliente = this.servicioClientes.obtenerCliente(this.data.reserva.id_cliente!).subscribe({
      next: cliente => {
        const usuario$ = this.servicioUsuarios.obtenerUsuariosFiltrado(cliente.nif_usuario);
        const vehiculo$ = this.servicioVehiculo.obtenerVehiculosFiltrado(cliente.vin_vehiculo);
        
        this.subscripcionDatos = forkJoin([usuario$, vehiculo$]).subscribe({
          next: ([usuario, vehiculo]) => {
            const hoy = new Date();
            const dia = hoy.getDate().toString().padStart(2, '0');
            const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
            const year = hoy.getFullYear().toString();

            const correo: Correo = {
              destinatario: usuario[0].email,
              asunto: 'Reserva aceptada',
              contenido: `Su reserva a sido aceptada, venga con su vehículo ${vehiculo[0].fabricante} ${vehiculo[0].modelo} el dia ${this.data.reserva.fecha} a las ${this.data.reserva.hora} para realizar el servicio. Se le ha asignado el mecánico ${this.mecanicoSeleccionado!.nombre} ${this.mecanicoSeleccionado!.apellidos}. <br><br> Servicios que se van a realizar: <ul>${servicios}</ul>`
            }

            const reparacion: Reparacion = {
              id_cliente: cliente.id!,
              nif_mecanico: this.mecanicoSeleccionado!.nif,
              descripcion: this.descripcionReparacion,
              fecha_inicio: `${dia}-${mes}-${year}`,
              estado: 'pendiente',
              servicios: this.data.reserva.servicios
            }

            this.subscripcionCorreo = this.servicioCorreo.enviarCorreo(correo).subscribe();
            this.subscripcionReserva = this.servicioReservas.actualizarReserva(this.data.reserva).subscribe();
            this.subscripcionReparacion = this.servicioReparaciones.crearReparacion(reparacion).subscribe({
              next: () => {
                this.dialogRef.close();
              }
            });
          }
        });
      }
    });
  }

  rechazarReserva(): void {
    this.data.reserva.estado = 'rechazada';

    this.subscripcionCliente = this.servicioClientes.obtenerCliente(this.data.reserva.id_cliente!).subscribe({
      next: cliente => {
        this.subscripcionUsuario = this.servicioUsuarios.obtenerUsuariosFiltrado(cliente.nif_usuario).subscribe({
          next: usuario => {
            const correo: Correo = {
              destinatario: usuario[0].email,
              asunto: 'Reserva rechazada',
              contenido: `No podemos aceptar su reserva, disculpe las molestias. <br><br> Motivo: <br> ${this.motivoRechazar}`
            }

            this.subscripcionCorreo = this.servicioCorreo.enviarCorreo(correo).subscribe();
            this.subscripcionReserva = this.servicioReservas.actualizarReserva(this.data.reserva).subscribe({
              next: () => {
                this.dialogRef.close();
              }
            });
          }
        });
      }
    });
  }
}
