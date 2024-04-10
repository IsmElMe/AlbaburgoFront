import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-login-error-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './login-error-modal.component.html',
  styleUrl: './login-error-modal.component.sass'
})
export class LoginErrorModalComponent {

}
