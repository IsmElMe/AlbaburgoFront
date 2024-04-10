import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-completado-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './registro-completado.modal.component.html',
  styleUrl: './registro-completado.modal.component.sass'
})
export class RegistroCompletadoModalComponent {

  constructor(private router: Router) { }

  paginaInicio() {
    this.router.navigate(['']);
  }
}
