import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './crear-modal.component.html',
  styleUrl: './crear-modal.component.sass'
})
export class CrearModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { creado: boolean, tipo: string }) { }
}
