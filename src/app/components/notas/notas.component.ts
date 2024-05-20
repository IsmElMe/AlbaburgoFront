import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotasService } from '../../services/notas.service';
import { PreguntasService } from '../../services/preguntas.service';
import { Observable, Subscription } from 'rxjs';
import { Pregunta } from '../../interfaces/pregunta';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.sass'
})
export class NotasComponent implements OnInit, OnDestroy {
  preguntas$!: Observable<Pregunta[]>;
  subscripcionNota?: Subscription;
  
  constructor(private fb: FormBuilder, private servicioNotas: NotasService, private servicioPreguntas: PreguntasService) { }

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
    pregunta5: [0],
    pregunta6: [0]
  });

  get comentario() { return this.nota.get('comentario'); }
  get pregunta1() { return this.nota.get('pregunta1'); }
  get pregunta2() { return this.nota.get('pregunta2'); }
  get pregunta3() { return this.nota.get('pregunta3'); }
  get pregunta4() { return this.nota.get('pregunta4'); }
  get pregunta5() { return this.nota.get('pregunta5'); }
  get pregunta6() { return this.nota.get('pregunta6'); }

  guardarNota(): void {
    
  }
}
