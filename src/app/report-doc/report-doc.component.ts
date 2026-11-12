import { Component, computed, input } from '@angular/core';
import mockData from '../mock-data.json';

@Component({
  selector: 'app-report-doc',
  templateUrl: './report-doc.component.html',
  styleUrl: './report-doc.component.scss',
})
export class ReportDocComponent {
  readonly childId = input.required<number>();
  readonly rangeKey = input.required<string>();
  readonly items = input.required<readonly string[]>();
  readonly date = input.required<string>();

  readonly child = computed(() => mockData.children.find((c) => c.id === this.childId())!);
  readonly range = computed(() => {
    const ranges = mockData.reports.ranges.filter((r) => r.childId === this.childId());
    return ranges.find((r) => r.key === this.rangeKey()) ?? ranges[0];
  });
  readonly totals = computed(() =>
    this.range().buckets.reduce(
      (sum, b) => ({ symptoms: sum.symptoms + b.symptoms, meds: sum.meds + b.meds }),
      { symptoms: 0, meds: 0 },
    ),
  );
  readonly medications = computed(() =>
    mockData.medications
      .filter((med) => med.childId === this.childId())
      .map((med) => ({ ...med, doses: mockData.medSchedule.filter((d) => d.medId === med.id) })),
  );
  readonly episodes = computed(() => mockData.episodes.filter((e) => e.childId === this.childId()));
  readonly visitNotes = computed(() => mockData.visitNotes.filter((n) => n.childId === this.childId()));

  private readonly dateFormat = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  has(item: string): boolean {
    return this.items().includes(item);
  }

  formatDate(value: string): string {
    return this.dateFormat.format(new Date(value.replace(/\//g, '-')));
  }
}
