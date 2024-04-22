import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-vehiculo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-vehiculo.component.html',
  styleUrl: './crear-vehiculo.component.sass'
})
export class CrearVehiculoComponent {

  constructor(private fb: FormBuilder) { }

  vehiculo = this.fb.group({
    vin: ['', [Validators.required, Validators.pattern(/^[A-HJ-NP-Z0-9]{11}[0-9]{6}$/)]],
    matricula: ['', [Validators.required, Validators.pattern(/^[\d]{4} [\w]{3}$/)]],
    fabricante: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    motor: ['', [Validators.required]],
    potencia: [0, [Validators.required]],
    year: [0, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    kilometros: [0, [Validators.required]],
    carroceria: ['', [Validators.required]],
    transmision: ['', [Validators.required]]
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
}
