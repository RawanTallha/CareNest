import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import mockData from '../mock-data.json';
import { Router } from '@angular/router';

interface ChildProfile {
  id: number;
  name: string;
  age: number;
  gender: 'boy' | 'girl';
  color: 'blue' | 'pink';
}

@Component({
  selector: 'app-child-profiles',
  imports: [RouterLink],
  templateUrl: './child-profiles.component.html',
  styleUrl: './child-profiles.component.scss',
})
export class ChildProfilesComponent {
  readonly children = mockData.children as ChildProfile[];
  constructor(private router: Router) {}

goTo(id: number) {
  this.router.navigate(['/home']);
}

// goTo(id: number) {
//   this.router.navigate(['/' + id]);
// }

  ageWord(age: number): string {
    if (age >= 3 && age <= 10) {
      return 'سنوات';
    }
    return 'سنه';
  }
}

