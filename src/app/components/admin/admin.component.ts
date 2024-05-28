import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <style>
      ::ng-deep main {
        background-image: url('../../../assets/images/fondo1.jpg');
        background-size: cover;
      }

      ::ng-deep .dark-mode main {
        background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../../../assets/images/fondo1.jpg');
        background-size: cover;
      }
    </style>
    <section class="container-fluid">
      <router-outlet />
    </section>
  `,
  styles: ``
})
export class AdminComponent {

}
