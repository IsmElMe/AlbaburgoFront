import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Respuesta } from '../../../../interfaces/respuestas';
import { Carroceria, Motor, Vehiculo } from '../../../../interfaces/vehiculo';
import { VehiculoService } from '../../../../services/vehiculo.service';

@Component({
  selector: 'app-vehiculo-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './vehiculo-modal.component.html',
  styleUrl: './vehiculo-modal.component.sass'
})
export class VehiculoModalComponent {
  maxFecha = new Date().getFullYear();
  editado$?: Observable<Respuesta<Vehiculo>>;
  borrado$?: Observable<Respuesta<Vehiculo>>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { vehiculo: Vehiculo }, private servicioVehiculos: VehiculoService, private fb: FormBuilder) { }

  vehiculo = this.fb.group({
    vin: [this.data.vehiculo.vin, [Validators.required, Validators.pattern(/^[A-HJ-NP-Z0-9]{11}[0-9]{6}$/)]],
    matricula: [this.data.vehiculo.matricula, [Validators.required, Validators.pattern(/^[\d]{4} [\w]{3}$/)]],
    fabricante: [this.data.vehiculo.fabricante, [Validators.required]],
    modelo: [this.data.vehiculo.modelo, [Validators.required]],
    motor: [this.data.vehiculo.motor, [Validators.required]],
    potencia: [this.data.vehiculo.potencia, [Validators.required]],
    year: [this.data.vehiculo.year, [Validators.required, Validators.min(1900), Validators.max(this.maxFecha)]],
    kilometros: [this.data.vehiculo.kilometros, [Validators.required]],
    carroceria: [this.data.vehiculo.carroceria, [Validators.required]],
    transmision: [this.data.vehiculo.transmision, [Validators.required]]
  });

  get vin() { return this.vehiculo.get('vin'); }
  get matricula() { return this.vehiculo.get('matricula'); }
  get fabricante() { return this.vehiculo.get('fabricante'); }
  get modelo() { return this.vehiculo.get('modelo'); }
  get motor() { return this.vehiculo.get('motor'); }
  get potencia() { return this.vehiculo.get('potencia'); }
  get year() { return this.vehiculo.get('year'); }
  get kilometros() { return this.vehiculo.get('kilometros'); }
  get carroceria() { return this.vehiculo.get('carroceria'); }
  get transmision() { return this.vehiculo.get('transmision'); }

  editarVehiculo(): void {
    const vehiculoEditado: Vehiculo = {
      carroceria: this.carroceria?.value as Carroceria,
      fabricante: this.fabricante?.value ?? '',
      kilometros: this.kilometros?.value ?? 0,
      matricula: this.matricula?.value ?? '',
      modelo: this.modelo?.value ?? '',
      motor: this.motor?.value as Motor,
      potencia: this.potencia?.value ?? 0,
      transmision: this.transmision?.value as 'Automática' | 'Manual',
      vin: this.vin?.value ?? '',
      year: this.year?.value ?? 0
    }

    this.editado$ = this.servicioVehiculos.editarVehiculo(this.data.vehiculo.id ?? -1, vehiculoEditado);
  }

  borrarVehiculo(): void {
    this.borrado$ = this.servicioVehiculos.borrarVehiculo(this.data.vehiculo);
  }
}
