import { Component, OnInit } from '@angular/core';
import { NotasService } from '../../services/notas.service';
import { Observable } from 'rxjs';
import { Nota } from '../../interfaces/nota';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todas-notas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todas-notas.component.html',
  styleUrl: './todas-notas.component.sass'
})
export class TodasNotasComponent implements OnInit {
  notas$!: Observable<Nota[]>;

  constructor(private servicioNotas: NotasService) { }

  ngOnInit(): void {
    this.notas$ = this.servicioNotas.obtenerNotas();
  }
}
