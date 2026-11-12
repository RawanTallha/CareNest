import { Component, HostListener, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { ReportDocComponent } from '../report-doc/report-doc.component';

type Student = (typeof mockData.students)[number];
type SharedReport = (typeof mockData.sharedReports)[number];

@Component({
  selector: 'app-teacher-home',
  imports: [RouterLink, ReportDocComponent],
  templateUrl: './teacher-home.component.html',
  styleUrl: './teacher-home.component.scss',
})
export class TeacherHomeComponent {
  readonly teacher = mockData.teacher;
  readonly classes = mockData.classes;
  readonly classId = signal(this.classes[this.classes.length - 1].id);
  readonly students = computed(() => mockData.students.filter((s) => s.classId === this.classId()));

  readonly requested = signal<ReadonlySet<number>>(
    new Set(mockData.students.filter((s) => s.requested).map((s) => s.id)),
  );
  readonly open = signal<{ student: Student; report: SharedReport } | null>(null);

  private readonly dateFormat = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  reportFor(student: Student): SharedReport | undefined {
    return mockData.sharedReports.find((r) => r.studentId === student.id);
  }

  showReport(student: Student): void {
    const report = this.reportFor(student);
    if (report) {
      this.open.set({ student, report });
    }
  }

  requestReport(student: Student): void {
    student.requested = true;
    this.requested.set(new Set([...this.requested(), student.id]));
  }

  formatDate(value: string): string {
    return this.dateFormat.format(new Date(value));
  }

  formatBirthDate(value: string): string {
    const [year, month, day] = value.split('-').map(Number);
    return `${day}/${month}/${year}`;
  }

  @HostListener('document:keydown.escape')
  closeReport(): void {
    this.open.set(null);
  }
}
