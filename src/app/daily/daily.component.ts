import { Component, HostListener, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

type Medication = (typeof mockData.medications)[number];
type ScheduledDose = (typeof mockData.medSchedule)[number] & { med: Medication };

@Component({
  selector: 'app-daily',
  imports: [RouterLink],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.scss',
})
export class DailyComponent {
  readonly streakDays = mockData.medStreakDays;
  readonly medications = mockData.medications;

  readonly today = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  private readonly timeFormat = new Intl.DateTimeFormat('ar-u-nu-latn', {
    hour: 'numeric',
    minute: '2-digit',
  });

  readonly doses: ScheduledDose[] = mockData.medSchedule.map((dose) => ({
    ...dose,
    med: this.medications.find((m) => m.id === dose.medId)!,
  }));
  readonly morning = this.doses.filter((d) => d.period === 'morning');
  readonly evening = this.doses.filter((d) => d.period === 'evening');
  readonly sections = [
    { key: 'morning', title: 'أدوية الصباح', list: this.morning },
    { key: 'evening', title: 'أدوية المساء', list: this.evening },
  ];

  readonly taken = signal<ReadonlyMap<string, string>>(new Map());
  readonly showList = signal(false);

  readonly doneCount = computed(() => this.taken().size);
  readonly progress = computed(() => Math.round((this.doneCount() / this.doses.length) * 100));
  readonly nextDose = computed(() => this.doses.find((d) => !this.taken().has(d.id)));

  toggle(id: string): void {
    const next = new Map(this.taken());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.set(id, this.timeFormat.format(new Date()));
    }
    this.taken.set(next);
  }

  doneIn(list: ScheduledDose[]): number {
    return list.filter((d) => this.taken().has(d.id)).length;
  }

  scheduleFor(medId: string): ScheduledDose[] {
    return this.doses.filter((d) => d.medId === medId);
  }

  @HostListener('document:keydown.escape')
  closeList(): void {
    this.showList.set(false);
  }
}
