import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-completado-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './login-completado-modal.component.html',
  styleUrl: './login-completado-modal.component.sass'
})
export class LoginCompletadoModalComponent {
  
  constructor(private router: Router) { }

  paginaInicio() {
    this.router.navigate(['']);
  }
}
