import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { CurrentChildService } from '../current-child.service';

type Period = 'morning' | 'evening' | 'asNeeded';

@Component({
  selector: 'app-med-form',
  imports: [RouterLink, FormsModule],
  templateUrl: './med-form.component.html',
  styleUrl: './med-form.component.scss',
})
export class MedFormComponent {
  private readonly router = inject(Router);
  private readonly childId = inject(CurrentChildService).id();

  readonly periods: { key: Period; label: string }[] = [
    { key: 'morning', label: 'الصباح' },
    { key: 'evening', label: 'المساء' },
    { key: 'asNeeded', label: 'عند الحاجة' },
  ];

  name = '';
  form = '';
  purpose = '';
  period: Period = 'morning';
  time = '08:00';
  dose = '';
  note = '';

  save(): void {
    const name = this.name.trim();
    if (!name) {
      return;
    }
    const id = `med-${Date.now()}`;
    mockData.medications.push({
      id,
      childId: this.childId,
      name,
      form: this.form.trim(),
      purpose: this.purpose.trim(),
      asNeeded: this.period === 'asNeeded' ? this.note.trim() || 'عند الحاجة' : null,
    });
    if (this.period !== 'asNeeded') {
      mockData.medSchedule.push({
        id: `dose-${Date.now()}`,
        medId: id,
        period: this.period,
        time: this.formatTime(this.time),
        dose: this.dose.trim(),
        note: this.note.trim(),
      });
    }
    this.router.navigate(['/daily']);
  }

  private formatTime(value: string): string {
    const [h, m] = value.split(':').map(Number);
    const suffix = h < 12 ? 'ص' : 'م';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  }
}
