import { Component } from '@angular/core';
import { FormComponent } from './componemts/form/form.component';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    FormComponent,
    RouterOutlet,
    Toast
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {

}
