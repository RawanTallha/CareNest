import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ChildProfilesComponent } from './child-profiles/child-profiles.component';
import { AddChildComponent } from './add-child/add-child.component';
import { HomeComponent } from './home/home.component';
import { EpisodesComponent } from './episodes/episodes.component';
import { EpisodeFormComponent } from './episode-form/episode-form.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { TriggersComponent } from './triggers/triggers.component';
import { DailyComponent } from './daily/daily.component';
import { EmergencyComponent } from './emergency/emergency.component';
import { AccountComponent } from './account/account.component';
import { ChildEditComponent } from './child-edit/child-edit.component';
import { MedFormComponent } from './med-form/med-form.component';
import { VisitNotesComponent } from './visit-notes/visit-notes.component';
import { ReportsComponent } from './reports/reports.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'signin' },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'children', component: ChildProfilesComponent },
  { path: 'children/add', component: AddChildComponent },
  { path: 'home', component: HomeComponent },
  { path: 'episodes', component: EpisodesComponent },
  { path: 'episodes/new', component: EpisodeFormComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'activity/new', component: ActivityFormComponent },
  { path: 'triggers', component: TriggersComponent },
  { path: 'daily', component: DailyComponent },
  { path: 'daily/new', component: MedFormComponent },
  { path: 'notes', component: VisitNotesComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'emergency', component: EmergencyComponent },
  { path: 'account', component: AccountComponent },
  { path: 'account/children/:id', component: ChildEditComponent },
  { path: 'analytics', pathMatch: 'full', redirectTo: 'reports' },
  { path: 'reports', component: ReportsComponent },
  { path: 'teacher', component: TeacherHomeComponent },
  { path: 'teacher/emergency', component: EmergencyComponent, data: { teacher: true } },
  { path: 'teacher/account', component: AccountComponent, data: { teacher: true } },
];
