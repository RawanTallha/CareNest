import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

type Account = typeof mockData.account;

@Component({
  selector: 'app-account',
  imports: [RouterLink, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  readonly account = signal<Account>({ ...mockData.account });
  readonly children = mockData.children;
  readonly initial = computed(() => this.account().name.trim().charAt(0));

  readonly editing = signal(false);
  draft: Account = { ...mockData.account };

  readonly notifications = signal(true);

  startEdit(): void {
    this.draft = { ...this.account() };
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  saveEdit(): void {
    Object.assign(mockData.account, this.draft);
    this.account.set({ ...this.draft });
    this.editing.set(false);
  }
}
