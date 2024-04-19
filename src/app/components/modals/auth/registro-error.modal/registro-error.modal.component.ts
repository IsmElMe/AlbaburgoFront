import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-error-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './registro-error.modal.component.html',
  styleUrl: './registro-error.modal.component.sass'
})
export class RegistroErrorModalComponent {

}
