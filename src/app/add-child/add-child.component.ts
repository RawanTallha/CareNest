import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-child',
  imports: [RouterLink],
  templateUrl: './add-child.component.html',
  styleUrl: './add-child.component.scss',
})
export class AddChildComponent {
  readonly gender = signal<'boy' | 'girl' | null>(null);
}
