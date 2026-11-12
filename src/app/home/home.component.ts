import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { CurrentChildService } from '../current-child.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly child = inject(CurrentChildService).child();
  readonly menuItems = mockData.homeMenu;

  readonly blobs: Record<string, string> = {
    daily: 'M96 0C92 14 100 24 118 26C140 28 150 40 152 60C154 80 160 100 170 100V0Z',
    episode: 'M104 0C98 16 106 30 128 32C150 34 156 52 160 72C163 88 166 100 170 100V0Z',
    activity: 'M86 0C84 20 110 30 126 42C142 54 150 70 158 86C162 96 166 100 170 100V0Z',
    triggers: 'M80 0C80 16 102 18 118 22C136 26 134 44 150 50C164 56 166 80 170 100V0Z',
    notes: 'M100 0C94 18 106 28 124 30C144 32 150 46 154 68C157 86 164 100 170 100V0Z',
    appointments: 'M90 0C88 18 108 22 124 22C144 22 154 34 158 54C162 74 166 100 170 100V0Z',
  };

  readonly nextDose = this.findNextDose();
  readonly nextAppointment = this.findNextAppointment();
  readonly taken = signal(false);

  private findNextDose() {
    const medIds = new Set(
      mockData.medications.filter((m) => m.childId === this.child.id).map((m) => m.id),
    );
    const doses = mockData.medSchedule
      .filter((d) => medIds.has(d.medId))
      .map((d) => {
        const med = mockData.medications.find((m) => m.id === d.medId)!;
        return { ...d, name: med.name, form: med.form, minutes: this.minutes(d.time) };
      })
      .sort((a, b) => a.minutes - b.minutes);
    if (!doses.length) {
      return null;
    }
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const upcoming = doses.find((d) => d.minutes > nowMinutes);
    return { ...(upcoming ?? doses[0]), tomorrow: !upcoming };
  }

  private findNextAppointment() {
    const now = Date.now();
    const next = mockData.appointments
      .filter((a) => a.childId === this.child.id && new Date(a.date).getTime() > now)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!next) {
      return null;
    }
    const date = new Date(next.date);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', options).format(date);
    return {
      ...next,
      day: `${format({ weekday: 'long' })} ${format({ day: 'numeric', month: 'long' })}`,
      time: format({ hour: 'numeric', minute: '2-digit' }),
    };
  }

  private minutes(time: string): number {
    const [clock, suffix] = time.split(' ');
    const [h, m] = clock.split(':').map(Number);
    return ((h % 12) + (suffix === 'م' ? 12 : 0)) * 60 + m;
  }
}
