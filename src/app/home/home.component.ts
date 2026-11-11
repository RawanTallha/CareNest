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
    daily: 'M172 0C160 10 162 30 185 33L262 35C280 38 278 60 280 80C281 95 290 104 310 104V0Z',
    episode: 'M178 0C168 14 172 34 200 36C240 38 262 30 272 50C282 70 272 96 300 104H310V0Z',
    activity: 'M142 0C138 30 175 40 195 55C220 72 240 78 265 85C285 92 295 104 310 104V0Z',
    triggers: 'M120 0C118 22 150 24 175 28C205 32 200 55 230 60C265 66 272 85 278 98C281 104 300 104 310 104V0Z',
    notes: 'M170 0C160 20 178 34 205 36C235 38 245 50 252 75C258 95 280 104 310 104V0Z',
    appointments: 'M150 0C146 24 176 30 200 30C232 30 250 44 258 66C264 86 284 104 310 104V0Z',
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
