import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-activity-form',
  imports: [RouterLink],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.scss',
})
export class ActivityFormComponent {
  constructor(private router: Router) {}

  save(): void {
    this.router.navigate(['/activity']);
  }
}
