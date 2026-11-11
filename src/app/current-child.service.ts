import { Injectable, computed, signal } from '@angular/core';
import mockData from './mock-data.json';

const STORAGE_KEY = 'carenest.childId';

@Injectable({ providedIn: 'root' })
export class CurrentChildService {
  readonly id = signal(this.restore());
  readonly child = computed(
    () => mockData.children.find((c) => c.id === this.id()) ?? mockData.children[0],
  );

  select(id: number): void {
    this.id.set(id);
    try {
      localStorage.setItem(STORAGE_KEY, String(id));
    } catch {
      // storage may be unavailable (private mode)
    }
  }

  private restore(): number {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY));
      return mockData.children.some((c) => c.id === saved) ? saved : mockData.children[0].id;
    } catch {
      return mockData.children[0].id;
    }
  }
}
