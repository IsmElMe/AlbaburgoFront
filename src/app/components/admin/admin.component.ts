import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <section class="container-fluid">
      <router-outlet />
    </section>
  `,
  styles: ``
})
export class AdminComponent {

}
