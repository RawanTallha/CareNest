import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

@Component({
  selector: 'app-episodes',
  imports: [RouterLink],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.scss',
})
export class EpisodesComponent {
  readonly episodes = mockData.episodes;

  yesNo(value: boolean): string {
    return value ? 'نعم' : 'لا';
  }
}
