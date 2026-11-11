import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { CurrentChildService } from '../current-child.service';

type VisitNote = (typeof mockData.visitNotes)[number];

@Component({
  selector: 'app-visit-notes',
  imports: [RouterLink, FormsModule],
  templateUrl: './visit-notes.component.html',
  styleUrl: './visit-notes.component.scss',
})
export class VisitNotesComponent {
  readonly child = inject(CurrentChildService).child();
  readonly tags = mockData.visitTags;
  readonly notes = signal<VisitNote[]>(this.childNotes());
  readonly previewCount = 2;
  readonly showAll = signal(false);

  private readonly dateFormat = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  date = this.toLocalInput(new Date());
  text = '';
  readonly selectedTags = signal<ReadonlySet<string>>(new Set());
  readonly attachment = signal('');
  readonly saved = signal(false);

  toggleTag(tag: string): void {
    const next = new Set(this.selectedTags());
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    this.selectedTags.set(next);
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.attachment.set(input.files?.[0]?.name ?? '');
    input.value = '';
  }

  save(): void {
    const text = this.text.trim();
    if (!text && !this.selectedTags().size) {
      return;
    }
    const note: VisitNote = {
      id: Date.now(),
      childId: this.child.id,
      date: this.date,
      tags: [...this.selectedTags()],
      text,
      attachment: this.attachment(),
    };
    mockData.visitNotes.unshift(note);
    this.notes.set(this.childNotes());
    this.text = '';
    this.selectedTags.set(new Set());
    this.attachment.set('');
    this.date = this.toLocalInput(new Date());
    this.saved.set(true);
  }

  formatDate(value: string): string {
    return this.dateFormat.format(new Date(value));
  }

  private childNotes(): VisitNote[] {
    return mockData.visitNotes.filter((n) => n.childId === this.child.id);
  }

  private toLocalInput(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
