import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

type YesNoKey = 'emergencyPlan' | 'inhalerUsed' | 'doseRepeated' | 'wentToER';
type Answer = 'yes' | 'no' | null;

@Component({
  selector: 'app-episode-form',
  imports: [RouterLink],
  templateUrl: './episode-form.component.html',
  styleUrl: './episode-form.component.scss',
})
export class EpisodeFormComponent {
  answers: Record<YesNoKey, Answer> = {
    emergencyPlan: null,
    inhalerUsed: null,
    doseRepeated: null,
    wentToER: null,
  };

  constructor(private router: Router) {}

  answer(key: YesNoKey, value: Answer): void {
    this.answers[key] = value;
  }

  save(): void {
    this.router.navigate(['/episodes']);
  }
}
