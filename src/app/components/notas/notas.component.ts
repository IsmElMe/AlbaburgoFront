import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotasService } from '../../services/notas.service';
import { PreguntasService } from '../../services/preguntas.service';
import { Observable, Subscription } from 'rxjs';
import { Pregunta } from '../../interfaces/pregunta';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from 'angular-star-rating';
import { MatDialog } from '@angular/material/dialog';
import { CrearModalComponent } from '../modals/crear-modal/crear-modal.component';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StarRatingModule],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.sass'
})
export class NotasComponent implements OnInit, OnDestroy {
  idUsuario = JSON.parse(localStorage.getItem('usuario') ?? '').id;
  preguntas$!: Observable<Pregunta[]>;
  subscripcionNota?: Subscription;
  
  constructor(
    private fb: FormBuilder, private modal: MatDialog,
    private servicioNotas: NotasService, private servicioPreguntas: PreguntasService
  ) { }

  ngOnInit(): void {
    this.preguntas$ = this.servicioPreguntas.obtenerPreguntas();
  }

  ngOnDestroy(): void {
    this.subscripcionNota?.unsubscribe();
  }

  nota = this.fb.group({
    comentario: ['', [Validators.required]],
    pregunta1: [''],
    pregunta2: [''],
    pregunta3: [''],
    pregunta4: [''],
    pregunta5: [''],
    pregunta6: ['']
  });

  get comentario() { return this.nota.get('comentario'); }
  get pregunta1() { return this.nota.get('pregunta1'); }
  get pregunta2() { return this.nota.get('pregunta2'); }
  get pregunta3() { return this.nota.get('pregunta3'); }
  get pregunta4() { return this.nota.get('pregunta4'); }
  get pregunta5() { return this.nota.get('pregunta5'); }
  get pregunta6() { return this.nota.get('pregunta6'); }

  guardarNota(): void {
    const nota = {
      comentario: this.comentario!.value ?? '',
      id_usuario: this.idUsuario,
      preguntas: {
        1: this.pregunta1?.value,
        2: this.pregunta2?.value,
        3: this.pregunta3?.value,
        4: this.pregunta4?.value,
        5: this.pregunta5?.value?.toString(),
        6: this.pregunta6?.value?.toString()
      }
    }

    let usuarioEditar = JSON.parse(localStorage.getItem('usuario') ?? '{}');
    usuarioEditar.tiene_nota = 1;
    localStorage.setItem('usuario', JSON.stringify(usuarioEditar));

    this.subscripcionNota = this.servicioNotas.crearNota(nota).subscribe();
    this.modal.open(CrearModalComponent, { data: { creado: true, tipo: 'la reseña' } });
  }
}
