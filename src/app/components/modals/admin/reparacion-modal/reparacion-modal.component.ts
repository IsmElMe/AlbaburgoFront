import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Reparacion } from '../../../../interfaces/reparacion';
import { MailService } from '../../../../services/mail.service';
import { Subscription, forkJoin } from 'rxjs';
import { ReparacionesService } from '../../../../services/reparaciones.service';
import { ClientesService } from '../../../../services/clientes.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { VehiculoService } from '../../../../services/vehiculo.service';
import { Correo } from '../../../../interfaces/correo';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reparacion-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, FormsModule],
  templateUrl: './reparacion-modal.component.html',
  styleUrl: './reparacion-modal.component.sass'
})
export class ReparacionModalComponent implements OnDestroy {
  subscripcionCorreo?: Subscription;
  subscripcionCliente?: Subscription;
  subscripcionUsuario?: Subscription;
  subscripcionDatos?: Subscription;
  subscripcionReparacion?: Subscription;
  horasServicio?: number;
  motivoCancelar?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { finalizado: boolean, reparacion: Reparacion }, private dialogRef: MatDialogRef<ReparacionModalComponent>, 
    private servicioReparaciones: ReparacionesService, private servicioClientes: ClientesService, 
    private servicioUsuarios: UsuarioService, private servicioVehiculo: VehiculoService, private servicioCorreo: MailService
  ) { }

  ngOnDestroy(): void {
    this.subscripcionCorreo?.unsubscribe();
    this.subscripcionCliente?.unsubscribe();
    this.subscripcionUsuario?.unsubscribe();
    this.subscripcionDatos?.unsubscribe();
    this.subscripcionReparacion?.unsubscribe();
  }

  finalizarReparacion() {
    let servicios = '';
    this.data.reparacion.estado = 'finalizado';

    this.data.reparacion.servicios!.forEach(servicio => {
      servicios += `<li>${servicio.nombre}</li>`;
    });

    this.subscripcionCliente = this.servicioClientes.obtenerCliente(this.data.reparacion.id_cliente!).subscribe({
      next: cliente => {
        const usuario$ = this.servicioUsuarios.obtenerUsuariosFiltrado(cliente.nif_usuario);
        const vehiculo$ = this.servicioVehiculo.obtenerVehiculosFiltrado(cliente.vin_vehiculo);

        const hoy = new Date();
        hoy.setDate(hoy.getDate() + 1);
        const dia = hoy.getDate().toString().padStart(2, '0');
        hoy.setDate(hoy.getDate() + 3);
        const diaMax = hoy.getDate().toString().padStart(2, '0');
        const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
        const year = hoy.getFullYear();
        
        this.subscripcionDatos = forkJoin([usuario$, vehiculo$]).subscribe({
          next: ([usuario, vehiculo]) => {
            const correo: Correo = {
              destinatario: usuario[0].email,
              asunto: 'Reparación finalizada',
              contenido: `El servicio de su vehículo ${vehiculo[0].fabricante} ${vehiculo[0].modelo} ha finalizado. Puede venir a recogerlo el ${dia}-${mes}-${year} desde las 09:00 hasta las 20:00, recuerde que si no recoge su vehículo antes del ${diaMax}-${mes}-${year} se le sumará un cargo de estancia. Gracias por utilizar nuestros servicios. <br><br> Servicios realizados: <ul>${servicios}</ul> Factura: `
            }

            this.subscripcionCorreo = this.servicioCorreo.enviarCorreo(correo).subscribe();
            this.subscripcionReparacion = this.servicioReparaciones.actualizarReparacion(this.data.reparacion).subscribe();
          }
        });
      }
    });
  }

  cancelarReparacion() {
    this.data.reparacion.estado = 'cancelado';

    this.subscripcionCliente = this.servicioClientes.obtenerCliente(this.data.reparacion.id_cliente!).subscribe({
      next: cliente => {
        this.subscripcionUsuario = this.servicioUsuarios.obtenerUsuariosFiltrado(cliente.nif_usuario).subscribe({
          next: usuario => {
            const correo: Correo = {
              destinatario: usuario[0].email,
              asunto: 'Reparación cancelada',
              contenido: `No podemos finalizar su reparación, disculpe las molestias, vuelva para recoger su vehículo. No se le cobrará nada. <br><br> Motivo: <br> ${this.motivoCancelar}`
            }

            this.subscripcionCorreo = this.servicioCorreo.enviarCorreo(correo).subscribe();
            this.subscripcionReparacion= this.servicioReparaciones.actualizarReparacion(this.data.reparacion).subscribe({
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
