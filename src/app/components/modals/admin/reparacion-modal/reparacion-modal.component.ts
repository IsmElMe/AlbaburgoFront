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
import { Factura } from '../../../../interfaces/factura';
import { FacturasService } from '../../../../services/facturas.service';

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
  subscripcionFacturas?: Subscription;
  horasServicio?: number;
  motivoCancelar?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { finalizado: boolean, reparacion: Reparacion }, private dialogRef: MatDialogRef<ReparacionModalComponent>, 
    private servicioReparaciones: ReparacionesService, private servicioClientes: ClientesService, private servicioFacturas: FacturasService,
    private servicioUsuarios: UsuarioService, private servicioVehiculo: VehiculoService, private servicioCorreo: MailService
  ) { }

  ngOnDestroy(): void {
    this.subscripcionCorreo?.unsubscribe();
    this.subscripcionCliente?.unsubscribe();
    this.subscripcionUsuario?.unsubscribe();
    this.subscripcionDatos?.unsubscribe();
    this.subscripcionReparacion?.unsubscribe();
    this.subscripcionFacturas?.unsubscribe();
  }

  finalizarReparacion() {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const year = hoy.getFullYear();

    let factura = `<li>Horas de trabajo (${this.horasServicio}h): ${this.horasServicio! * 30}€</li>`;
    let precioTotal = this.data.reparacion.servicios!.reduce((acc, servicio) => acc + servicio.precio, 0);
    precioTotal += this.horasServicio! * 30;
    this.data.reparacion.estado = 'finalizado';
    this.data.reparacion.fecha_fin = `${dia}-${mes}-${year}`;

    this.data.reparacion.servicios!.forEach(servicio => {
      factura += `<li>${servicio.nombre}: ${servicio.precio}€</li>`;
    });

    this.subscripcionCliente = this.servicioClientes.obtenerCliente(this.data.reparacion.id_cliente!).subscribe({
      next: cliente => {
        const usuario$ = this.servicioUsuarios.obtenerUsuariosFiltrado(cliente.nif_usuario);
        const vehiculo$ = this.servicioVehiculo.obtenerVehiculosFiltrado(cliente.vin_vehiculo);

        hoy.setDate(hoy.getDate() + 1);
        const diaMin = hoy.getDate().toString().padStart(2, '0');
        hoy.setDate(hoy.getDate() + 3);
        const diaMax = hoy.getDate().toString().padStart(2, '0');
 
        this.subscripcionDatos = forkJoin([usuario$, vehiculo$]).subscribe({
          next: ([usuario, vehiculo]) => {
            const correo: Correo = {
              destinatario: usuario[0].email,
              asunto: 'Reparación finalizada',
              contenido: `El servicio de su vehículo ${vehiculo[0].fabricante} ${vehiculo[0].modelo} ha finalizado. Puede venir a recogerlo el ${diaMin}-${mes}-${year} desde las 09:00 hasta las 20:00, si no recoge su vehículo antes del ${diaMax}-${mes}-${year} se le sumará un cargo de estancia. Gracias por utilizar nuestros servicios. <br><br> Factura: <ul>${factura}</ul> IVA (21%): ${precioTotal * 0.21}€ <br> Precio total: ${precioTotal}€`
            }

            const datosFactura: Factura = {
              id_reparacion: this.data.reparacion.id!,
              precio_total: precioTotal,
              horas: this.horasServicio
            }

            this.subscripcionCorreo = this.servicioCorreo.enviarCorreo(correo).subscribe();
            this.subscripcionReparacion = this.servicioReparaciones.actualizarReparacion(this.data.reparacion).subscribe();
            this.subscripcionFacturas = this.servicioFacturas.crearFactura(datosFactura).subscribe({
              next: () => {
                this.dialogRef.close();
              }
            });
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
