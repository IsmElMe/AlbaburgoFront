import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './crear-modal.component.html',
  styleUrl: './crear-modal.component.sass'
})
export class CrearModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { creado: boolean, tipo: string }, private router: Router) { }

  redireccionar() {
    if (this.data.creado) { 
      switch (this.data.tipo) {
        case 'vehiculo': this.router.navigate(['perfil']); break;
      }
    }
  }
}
