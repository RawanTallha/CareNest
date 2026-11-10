import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

@Component({
  selector: 'app-emergency',
  imports: [RouterLink],
  templateUrl: './emergency.component.html',
  styleUrl: './emergency.component.scss',
})
export class EmergencyComponent {
  readonly phoneHref = `tel:${mockData.emergencyNumber}`;
}
