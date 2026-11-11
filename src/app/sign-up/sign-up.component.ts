import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrls: ['../sign-in/sign-in.component.scss', './sign-up.component.scss'],
})
export class SignUpComponent {
  readonly role = signal<'parent' | 'teacher'>('parent');
  showPassword = false;
}
