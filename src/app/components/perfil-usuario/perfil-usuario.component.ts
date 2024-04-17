import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../interfaces/vehiculo';
import { VehiculoService } from '../../services/vehiculo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.sass',
})
export class PerfilUsuarioComponent implements OnInit {
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') ?? '');
  vehiculos$!: Observable<Vehiculo[]>;

  constructor(private servicioVehiculos: VehiculoService) { }

  ngOnInit(): void {
    this.vehiculos$ = this.servicioVehiculos.obtenerVehiculosUsuario(this.usuario.nif);
  }
}
