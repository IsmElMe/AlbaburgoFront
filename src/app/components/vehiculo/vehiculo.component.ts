import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vehiculo } from '../../interfaces/vehiculo';
import { VehiculoModalComponent } from '../modals/admin/vehiculo-modal/vehiculo-modal.component';
import { VehiculoService } from '../../services/vehiculo.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.sass'
})
export class VehiculoComponent {
  @Input() vehiculo!: Vehiculo;
  @Input() editable!: boolean;
  @Output() vehiculoEliminado = new EventEmitter<string>();
  @Output() vehiculoSeleccionado = new EventEmitter<Vehiculo>;
  @Input() seleccionado = false;
  @Input() imagen = '';

  constructor(private servicioVehiculos: VehiculoService, private dialog: MatDialog) { }

  modalVehiculo(vehiculo: Vehiculo): void {
    this.dialog.open(VehiculoModalComponent, { data: { vehiculo: vehiculo } });
  }

  borrarVehiculo(vehiculo: Vehiculo): void {
    this.servicioVehiculos.borrarVehiculo(vehiculo).subscribe();
    this.vehiculoEliminado.emit(this.vehiculo.vin);
  }

  seleccionarVehiculo(): void {
    this.vehiculoSeleccionado.emit(this.vehiculo);
  }
}
