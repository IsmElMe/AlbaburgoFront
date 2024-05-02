import { Component, OnInit } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../interfaces/servicio';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.sass'
})
export class ReservasComponent implements OnInit {
  servicios$?: Observable<Servicio[]>;
  serviciosSeleccionado = new FormControl();

  constructor(private servicioServicios: ServiciosService) { }

  ngOnInit(): void {
    this.servicios$ = this.servicioServicios.obtenerServicios();
  }
}
