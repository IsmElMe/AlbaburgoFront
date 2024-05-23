import { Component, Inject } from '@angular/core';
import { Nota } from '../../../interfaces/nota';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TransformarFechaPipe } from '../../../pipes/transformar-fecha.pipe';

@Component({
  selector: 'app-detalles-nota',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, CommonModule, TransformarFechaPipe],
  templateUrl: './detalles-nota.component.html',
  styleUrl: './detalles-nota.component.sass'
})
export class DetallesNotaComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { nota: Nota }) { }
}
