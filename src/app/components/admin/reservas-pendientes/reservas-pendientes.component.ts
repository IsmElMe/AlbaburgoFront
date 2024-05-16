import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { Reserva } from '../../../interfaces/reserva';
import { CommonModule } from '@angular/common';
import { MailService } from '../../../services/mail.service';
import { Correo } from '../../../interfaces/correo';
import { ClientesService } from '../../../services/clientes.service';
import { UsuarioService } from '../../../services/usuario.service';
import { VehiculoService } from '../../../services/vehiculo.service';

@Component({
  selector: 'app-reservas-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-pendientes.component.html',
  styleUrl: './reservas-pendientes.component.sass'
})
export class ReservasPendientesComponent implements OnInit, OnDestroy {
  reservasPendientes$!: Observable<Reserva[]>;
  subscripcionCorreo?: Subscription;
  subscripcionCliente?: Subscription;
  subscripcionUsuario?: Subscription;
  subscripcionDatos?: Subscription;
  subscripcionReserva?: Subscription;

  constructor(
    private servicioReservas: ReservasService, private servicioClientes: ClientesService, 
    private servicioUsuarios: UsuarioService, private servicioVehiculo: VehiculoService,
    private servicioCorreo: MailService
  ) { }

  ngOnInit(): void {
    this.reservasPendientes$ = this.servicioReservas.obtenerReservasFiltrado('pendiente');
  }
  ngOnDestroy(): void {
    this.subscripcionCorreo?.unsubscribe();
    this.subscripcionCliente?.unsubscribe();
    this.subscripcionUsuario?.unsubscribe();
    this.subscripcionDatos?.unsubscribe();
    this.subscripcionReserva?.unsubscribe();
  }

  aceptarReserva(reserva: Reserva): void {
    let servicios = '';
    reserva.estado = 'aceptada';

    reserva.servicios!.forEach(servicio => {
      servicios += `<li>${servicio.nombre}</li>`;
    });

    this.subscripcionCliente = this.servicioClientes.obtenerCliente(reserva.id_cliente!).subscribe({
      next: cliente => {
        const usuario$ = this.servicioUsuarios.obtenerUsuariosFiltrado(cliente.nif_usuario);
        const vehiculo$ = this.servicioVehiculo.obtenerVehiculosFiltrado(cliente.vin_vehiculo);
        
        this.subscripcionDatos = forkJoin([usuario$, vehiculo$]).subscribe({
          next: ([usuario, vehiculo]) => {
            const correo: Correo = {
              destinatario: usuario[0].email,
              asunto: 'Reserva aceptada',
              contenido: `Su reserva a sido aceptada, venga con su vehículo ${vehiculo[0].fabricante} ${vehiculo[0].modelo} el dia ${reserva.fecha} a las ${reserva.hora} para realizar el servicio. <br><br> Servicios que se van a realizar: <ul>${servicios}</ul>`
            }

            this.subscripcionCorreo = this.servicioCorreo.enviarCorreo(correo).subscribe();
          }
        });
      }
    });

    this.subscripcionReserva = this.servicioReservas.actualizarReserva(reserva).subscribe();
    this.reservasPendientes$ = this.servicioReservas.obtenerReservasFiltrado('pendiente');
  }

  rechazarReserva(reserva: Reserva): void {
    reserva.estado = 'rechazada';

    this.subscripcionCliente = this.servicioClientes.obtenerCliente(reserva.id_cliente!).subscribe({
      next: cliente => {
        this.subscripcionUsuario = this.servicioUsuarios.obtenerUsuariosFiltrado(cliente.nif_usuario).subscribe({
          next: usuario => {
            const correo: Correo = {
              destinatario: usuario[0].email,
              asunto: 'Reserva rechazada',
              contenido: 'No podemos aceptar su reserva porque tenemos demasiados servicios activos, disculpe las molestias.'
            }

            this.subscripcionCorreo = this.servicioCorreo.enviarCorreo(correo).subscribe();
          }
        });
        
      }
    });

    this.subscripcionReserva = this.servicioReservas.actualizarReserva(reserva).subscribe();
    this.reservasPendientes$ = this.servicioReservas.obtenerReservasFiltrado('pendiente');
  }
}
