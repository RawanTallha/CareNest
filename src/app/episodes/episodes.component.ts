import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { CurrentChildService } from '../current-child.service';

@Component({
  selector: 'app-episodes',
  imports: [RouterLink],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.scss',
})
export class EpisodesComponent {
  private readonly childId = inject(CurrentChildService).id();
  readonly episodes = mockData.episodes.filter((e) => e.childId === this.childId);
  readonly previewCount = 2;
  readonly showAll = signal(false);

  yesNo(value: boolean): string {
    return value ? 'نعم' : 'لا';
  }
}
