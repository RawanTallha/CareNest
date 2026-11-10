import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

@Component({
  selector: 'app-activity',
  imports: [RouterLink],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class ActivityComponent {
  readonly activities = mockData.activities;
}
