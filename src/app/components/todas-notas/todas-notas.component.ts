import { Component, OnInit } from '@angular/core';
import { NotasService } from '../../services/notas.service';
import { Observable } from 'rxjs';
import { Nota } from '../../interfaces/nota';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DetallesNotaComponent } from '../modals/detalles-nota/detalles-nota.component';
import { TransformarFechaPipe } from '../../pipes/transformar-fecha.pipe';

@Component({
  selector: 'app-todas-notas',
  standalone: true,
  imports: [CommonModule, TransformarFechaPipe],
  templateUrl: './todas-notas.component.html',
  styleUrl: './todas-notas.component.sass'
})
export class TodasNotasComponent implements OnInit {
  notas$!: Observable<Nota[]>;

  constructor(private servicioNotas: NotasService, private modal: MatDialog) { }

  ngOnInit(): void {
    this.notas$ = this.servicioNotas.obtenerNotas();
  }

  detallesNota(nota: Nota) {
    this.modal.open(DetallesNotaComponent, { data: { nota: nota } });
  }
}
