import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { CurrentChildService } from '../current-child.service';

type Medication = (typeof mockData.medications)[number];
type ScheduledDose = (typeof mockData.medSchedule)[number] & { med: Medication };

@Component({
  selector: 'app-daily',
  imports: [RouterLink],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.scss',
})
export class DailyComponent {
  private readonly child = inject(CurrentChildService).child();
  readonly streakDays = this.child.medStreak;
  readonly medications = mockData.medications.filter((m) => m.childId === this.child.id);

  readonly today = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  private readonly timeFormat = new Intl.DateTimeFormat('ar-u-nu-latn', {
    hour: 'numeric',
    minute: '2-digit',
  });

  readonly doses: ScheduledDose[] = mockData.medSchedule
    .filter((dose) => this.medications.some((m) => m.id === dose.medId))
    .map((dose) => ({
      ...dose,
      med: this.medications.find((m) => m.id === dose.medId)!,
    }))
    .sort((a, b) => this.minutes(a.time) - this.minutes(b.time));
  readonly morning = this.doses.filter((d) => d.period === 'morning');
  readonly evening = this.doses.filter((d) => d.period === 'evening');
  readonly sections = [
    { key: 'morning', title: 'أدوية الصباح', list: this.morning },
    { key: 'evening', title: 'أدوية المساء', list: this.evening },
  ].filter((section) => section.list.length);

  readonly taken = signal<ReadonlyMap<string, string>>(new Map());
  readonly showList = signal(false);

  readonly doneCount = computed(() => this.taken().size);
  readonly progress = computed(() =>
    this.doses.length ? Math.round((this.doneCount() / this.doses.length) * 100) : 0,
  );
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

  private minutes(time: string): number {
    const [clock, suffix] = time.split(' ');
    const [h, m] = clock.split(':').map(Number);
    return ((h % 12) + (suffix === 'م' ? 12 : 0)) * 60 + m;
  }

  @HostListener('document:keydown.escape')
  closeList(): void {
    this.showList.set(false);
  }
}
