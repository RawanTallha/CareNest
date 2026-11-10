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

  constructor() {
    const id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
    this.child = mockData.children.find((c) => c.id === id);
    this.draft = { ...(this.child ?? mockData.children[0]) };
  }

  save(): void {
    if (!this.editing()) {
      return;
    }
    if (this.child) {
      Object.assign(this.child, this.draft);
    }
    this.router.navigate(['/account']);
  }
}
