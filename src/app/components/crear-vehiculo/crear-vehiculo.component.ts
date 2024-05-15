import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carroceria, Motor, Vehiculo } from '../../interfaces/vehiculo';
import { VehiculoService } from '../../services/vehiculo.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CrearModalComponent } from '../modals/crear-modal/crear-modal.component';

@Component({
  selector: 'app-crear-vehiculo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-vehiculo.component.html',
  styleUrl: './crear-vehiculo.component.sass'
})
export class CrearVehiculoComponent implements OnDestroy {
  maxFecha = new Date().getFullYear();
  subscripcionVehiculo?: Subscription;

  constructor(private fb: FormBuilder, private servicioVehiculos: VehiculoService, private dialog: MatDialog) { }

  vehiculo = this.fb.group({
    vin: ['', [Validators.required, Validators.pattern(/^[A-HJ-NP-Z0-9]{11}[0-9]{6}$/)]],
    matricula: ['', [Validators.required, Validators.pattern(/^[\d]{4} [\w]{3}$/)]],
    fabricante: ['Alfa Romeo', [Validators.required]],
    modelo: ['', [Validators.required]],
    motor: ['Gasolina', [Validators.required]],
    potencia: [0, [Validators.required]],
    year: [2000, [Validators.required, Validators.min(1900), Validators.max(this.maxFecha)]],
    kilometros: [0, [Validators.required]],
    carroceria: ['Sedán', [Validators.required]],
    transmision: ['Automática', [Validators.required]]
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

  ngOnDestroy(): void {
    this.subscripcionVehiculo?.unsubscribe();
  }

  crearVehiculo(evento: Event) {
    evento.preventDefault();

    const nuevoVehiculo: Vehiculo = {
      vin: this.vin!.value ?? '',
      matricula: this.matricula!.value ?? '',
      nif_propietario: JSON.parse(localStorage.getItem('usuario') ?? '').nif,
      fabricante: this.fabricante!.value ?? '',
      modelo: this.modelo!.value ?? '',
      motor: this.motor!.value as Motor ?? 'Gasolina',
      potencia: this.potencia!.value ?? 0,
      year: this.year!.value ?? 0,
      kilometros: this.kilometros!.value ?? 0,
      carroceria: this.carroceria!.value as Carroceria ?? 'Sedán',
      transmision: this.transmision!.value as 'Automática' | 'Manual' ?? 'Automática'
    };

    this.subscripcionVehiculo = this.servicioVehiculos.crearVehiculo(nuevoVehiculo).subscribe({
      next: respuesta => {
        this.dialog.open(CrearModalComponent, { data: { creado: true, tipo: 'el vehiculo' } });
      },
      error: error => {
        console.error(error);

        this.dialog.open(CrearModalComponent, { data: { creado: false, tipo: 'el vehiculo' } });
      }
    });
  }
}
