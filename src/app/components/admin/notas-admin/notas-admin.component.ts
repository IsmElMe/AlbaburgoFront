import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, debounceTime, switchMap } from 'rxjs';
import { Nota } from '../../../interfaces/nota';
import { NotasService } from '../../../services/notas.service';
import { TransformarFechaPipe } from '../../../pipes/transformar-fecha.pipe';
import { MatDialog } from '@angular/material/dialog';
import { DetallesNotaComponent } from '../../modals/detalles-nota/detalles-nota.component';

@Component({
  selector: 'app-notas-admin',
  standalone: true,
  imports: [CommonModule, TransformarFechaPipe, RouterLink],
  templateUrl: './notas-admin.component.html',
  styleUrl: './notas-admin.component.sass'
})
export class NotasAdminComponent implements OnInit {
  notas$!: Observable<Nota[]>;
  filtro$ = new BehaviorSubject<string>('');

  constructor(private servicioNotas: NotasService, private modal: MatDialog) { }

  ngOnInit(): void {
    this.notas$ = this.filtro$.pipe(
      debounceTime(300),
      switchMap(filtro => filtro ? this.servicioNotas.obtenerNotasFiltrado(filtro) : this.servicioNotas.obtenerNotas())
    );
  }

  buscar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    this.filtro$.next(input.value);
  }

  detallesNota(nota: Nota) {
    this.modal.open(DetallesNotaComponent, { data: { nota: nota } });
  }
}
