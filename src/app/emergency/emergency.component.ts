import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

@Component({
  selector: 'app-emergency',
  imports: [RouterLink],
  templateUrl: './emergency.component.html',
  styleUrl: './emergency.component.scss',
})
export class EmergencyComponent {
  readonly isTeacher = inject(ActivatedRoute).snapshot.data['teacher'] === true;
  readonly phoneHref = `tel:${mockData.emergencyNumber}`;
}
