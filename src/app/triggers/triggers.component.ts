import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

interface Trigger {
  id: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-triggers',
  imports: [RouterLink],
  templateUrl: './triggers.component.html',
  styleUrl: './triggers.component.scss',
})
export class TriggersComponent {
  readonly period = mockData.triggerPeriod;
  readonly triggers = signal<Trigger[]>(mockData.triggers);
  readonly today = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  readonly selected = signal<ReadonlySet<string>>(new Set());
  readonly submitted = signal<ReadonlySet<string>>(new Set());
  readonly lastAction = signal<'saved' | 'updated' | null>(null);

  readonly ranked = computed(() => [...this.triggers()].sort((a, b) => b.count - a.count));
  readonly top = computed(() => this.ranked()[0]);
  readonly hasSubmission = computed(() => this.submitted().size > 0);
  readonly dirty = computed(() => {
    const selected = this.selected();
    const submitted = this.submitted();
    return selected.size !== submitted.size || [...selected].some((id) => !submitted.has(id));
  });

  toggle(id: string): void {
    const next = new Set(this.selected());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.selected.set(next);
    this.lastAction.set(null);
  }

  save(): void {
    if (!this.dirty()) {
      return;
    }
    const selected = this.selected();
    const submitted = this.submitted();
    this.triggers.update((list) =>
      list.map((t) => ({
        ...t,
        count: t.count + (selected.has(t.id) ? 1 : 0) - (submitted.has(t.id) ? 1 : 0),
      })),
    );
    this.lastAction.set(this.hasSubmission() ? 'updated' : 'saved');
    this.submitted.set(new Set(selected));
  }

  barWidth(count: number): number {
    return Math.round((count / this.top().count) * 100);
  }

  times(count: number): string {
    if (count === 1) {
      return 'مرة واحدة';
    }
    if (count === 2) {
      return 'مرتان';
    }
    if (count <= 10) {
      return `${count} مرات`;
    }
    return `${count} مرة`;
  }
}
