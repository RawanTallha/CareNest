import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

type Account = typeof mockData.account;

@Component({
  selector: 'app-account',
  imports: [RouterLink, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  readonly isTeacher = inject(ActivatedRoute).snapshot.data['teacher'] === true;
  private readonly source: Account = this.isTeacher ? mockData.teacher : mockData.account;

  readonly account = signal<Account>({ ...this.source });
  readonly children = mockData.children;
  readonly initial = computed(() => this.account().name.replace(/^أ\.\s*/, '').trim().charAt(0));

  readonly editing = signal(false);
  draft: Account = { ...this.source };

  readonly notifications = signal(true);

  startEdit(): void {
    this.draft = { ...this.account() };
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  saveEdit(): void {
    Object.assign(this.source, this.draft);
    this.account.set({ ...this.draft });
    this.editing.set(false);
  }
}
