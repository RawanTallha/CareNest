import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { CurrentChildService } from '../current-child.service';

type Appointment = (typeof mockData.appointments)[number];
type Remind = 'day' | 'hour' | 'none';

@Component({
  selector: 'app-appointments',
  imports: [RouterLink, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent {
  readonly child = inject(CurrentChildService).child();
  readonly remindOptions: { key: Remind; label: string }[] = [
    { key: 'day', label: 'قبل يوم' },
    { key: 'hour', label: 'قبل ساعة' },
    { key: 'none', label: 'بدون تذكير' },
  ];

  readonly appointments = signal<Appointment[]>(this.childAppointments());
  readonly upcoming = computed(() =>
    this.appointments()
      .filter((a) => this.isUpcoming(a))
      .sort((a, b) => a.date.localeCompare(b.date)),
  );
  readonly past = computed(() =>
    this.appointments()
      .filter((a) => !this.isUpcoming(a))
      .sort((a, b) => b.date.localeCompare(a.date)),
  );

  readonly previewCount = 2;
  readonly showAllPast = signal(false);
  readonly showForm = signal(false);

  doctor = this.child.doctorName;
  date = '';
  reason = '';
  remind: Remind = 'day';

  private readonly dayFormat = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', { day: 'numeric' });
  private readonly monthFormat = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', { month: 'long' });
  private readonly timeFormat = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
  });

  save(): void {
    if (!this.doctor.trim() || !this.date) {
      return;
    }
    mockData.appointments.push({
      id: Date.now(),
      childId: this.child.id,
      doctor: this.doctor.trim(),
      reason: this.reason.trim(),
      date: this.date,
      remind: this.remind,
    });
    this.appointments.set(this.childAppointments());
    this.date = '';
    this.reason = '';
    this.remind = 'day';
    this.showForm.set(false);
  }

  cycleRemind(appointment: Appointment): void {
    const order: Remind[] = ['day', 'hour', 'none'];
    appointment.remind = order[(order.indexOf(appointment.remind as Remind) + 1) % order.length];
    this.appointments.set([...this.appointments()]);
  }

  remindLabel(remind: string): string {
    return this.remindOptions.find((o) => o.key === remind)?.label ?? '';
  }

  day(value: string): string {
    return this.dayFormat.format(new Date(value));
  }

  month(value: string): string {
    return this.monthFormat.format(new Date(value));
  }

  time(value: string): string {
    return this.timeFormat.format(new Date(value));
  }

  private isUpcoming(appointment: Appointment): boolean {
    return new Date(appointment.date).getTime() > Date.now();
  }

  private childAppointments(): Appointment[] {
    return mockData.appointments.filter((a) => a.childId === this.child.id);
  }
}
