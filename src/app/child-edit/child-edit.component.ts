import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import mockData from '../mock-data.json';

type Child = (typeof mockData.children)[number];

@Component({
  selector: 'app-child-edit',
  imports: [RouterLink, FormsModule],
  templateUrl: './child-edit.component.html',
  styleUrl: './child-edit.component.scss',
})
export class ChildEditComponent {
  private readonly router = inject(Router);
  private readonly child: Child | undefined;

  readonly bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  readonly draft: Child;
  readonly editing = signal(false);
  readonly editingMed = signal<number | null>(null);

  constructor() {
    const id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
    this.child = mockData.children.find((c) => c.id === id);
    const source = this.child ?? mockData.children[0];
    this.draft = { ...source, meds: source.meds.map((m) => ({ ...m })) };
  }

  addMed(): void {
    this.draft.meds.push({ name: '', dose: '', prescription: '' });
    this.editingMed.set(this.draft.meds.length - 1);
  }

  removeMed(index: number): void {
    this.draft.meds.splice(index, 1);
    this.editingMed.set(null);
  }

  doneMed(index: number): void {
    const med = this.draft.meds[index];
    if (!med.name.trim()) {
      this.removeMed(index);
      return;
    }
    this.editingMed.set(null);
  }

  save(): void {
    if (!this.editing()) {
      return;
    }
    this.draft.meds = this.draft.meds.filter((m) => m.name.trim());
    if (this.child) {
      Object.assign(this.child, this.draft);
    }
    this.router.navigate(['/account']);
  }
}
