import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { CurrentChildService } from '../current-child.service';

@Component({
  selector: 'app-activity',
  imports: [RouterLink],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class ActivityComponent {
  private readonly childId = inject(CurrentChildService).id();
  readonly activities = mockData.activities.filter((a) => a.childId === this.childId);
}
