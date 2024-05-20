import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Nota } from '../../interfaces/nota';
import { NotasService } from '../../services/notas.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent implements OnInit {
  usuario?: Usuario = JSON.parse(localStorage.getItem('usuario') ?? '{}');
  notas$!: Observable<Nota[]>;

  constructor(private servicioNotas: NotasService) { }

  ngOnInit(): void {
    this.notas$ = this.servicioNotas.obtenerNotasHome();
  }
}
