import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { CurrentChildService } from '../current-child.service';

type ExportEntry = (typeof mockData.reports.exports)[number];

@Component({
  selector: 'app-reports',
  imports: [RouterLink],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  readonly child = inject(CurrentChildService).child();
  readonly ranges = mockData.reports.ranges.filter((r) => r.childId === this.child.id);
  readonly includeOptions = ['سجل الأدوية', 'سجل الأعراض', 'ملاحظات الزيارات'];

  readonly rangeKey = signal('month');
  readonly included = signal<ReadonlySet<string>>(new Set(this.includeOptions));
  readonly exports = signal<ExportEntry[]>(this.childExports());
  readonly exported = signal(false);
  readonly previewCount = 2;
  readonly showAllExports = signal(false);
  readonly showPreview = signal(false);

  readonly medications = mockData.medications
    .filter((med) => med.childId === this.child.id)
    .map((med) => ({
      ...med,
      doses: mockData.medSchedule.filter((d) => d.medId === med.id),
    }));
  readonly episodes = mockData.episodes.filter((e) => e.childId === this.child.id);
  readonly visitNotes = mockData.visitNotes.filter((n) => n.childId === this.child.id);
  readonly today = new Date().toISOString();

  readonly range = computed(() => this.ranges.find((r) => r.key === this.rangeKey()) ?? this.ranges[0]);
  readonly maxValue = computed(() =>
    Math.max(1, ...this.range().buckets.map((b) => Math.max(b.symptoms, b.meds))),
  );
  readonly totals = computed(() =>
    this.range().buckets.reduce(
      (sum, b) => ({ symptoms: sum.symptoms + b.symptoms, meds: sum.meds + b.meds }),
      { symptoms: 0, meds: 0 },
    ),
  );

  private readonly dateFormat = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  selectRange(key: string): void {
    this.rangeKey.set(key);
    this.exported.set(false);
  }

  toggleInclude(option: string): void {
    const next = new Set(this.included());
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    this.included.set(next);
  }

  barHeight(value: number): number {
    return Math.max(value ? 4 : 0, Math.round((value / this.maxValue()) * 100));
  }

  exportReport(): void {
    const items = this.includeOptions.filter((o) => this.included().has(o));
    if (!items.length) {
      return;
    }
    const entry: ExportEntry = {
      childId: this.child.id,
      id: Date.now(),
      title: `تقرير ${this.range().label}`,
      date: new Date().toISOString(),
      items,
    };
    mockData.reports.exports.unshift(entry);
    this.exports.set(this.childExports());
    this.exported.set(true);
  }

  formatDate(value: string): string {
    return this.dateFormat.format(new Date(value.replace(/\//g, '-')));
  }

  private childExports(): ExportEntry[] {
    return mockData.reports.exports.filter((e) => e.childId === this.child.id);
  }

  @HostListener('document:keydown.escape')
  closePreview(): void {
    this.showPreview.set(false);
  }
}
