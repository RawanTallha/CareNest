import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly child = mockData.children[0];
  readonly menuItems = mockData.homeMenu;

  readonly blobs: Record<string, string> = {
    daily: 'M172 0C160 10 162 30 185 33L262 35C280 38 278 60 280 80C281 95 290 104 310 104V0Z',
    episode: 'M178 0C168 14 172 34 200 36C240 38 262 30 272 50C282 70 272 96 300 104H310V0Z',
    activity: 'M142 0C138 30 175 40 195 55C220 72 240 78 265 85C285 92 295 104 310 104V0Z',
    triggers: 'M120 0C118 22 150 24 175 28C205 32 200 55 230 60C265 66 272 85 278 98C281 104 300 104 310 104V0Z',
    notes: 'M170 0C160 20 178 34 205 36C235 38 245 50 252 75C258 95 280 104 310 104V0Z',
  };
}
