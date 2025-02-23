import { Routes } from '@angular/router';

import { LoginComponent } from '../Components/login/login.component';
import { RegisterComponent } from '../Components/register/register.component';
import { ForgotPasswordComponent } from '../Components/forgot-password/forgot-password.component';
import { HomeComponent } from '../Components/home/home.component';
import { ReelsComponent } from '../Components/reels/reels.component';
import { ProfileComponent } from '../Components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'home', component: HomeComponent },
  //{ path: 'profile', component: Profile },
  // { path: '**', redirectTo: 'login' } // Redirect unknown paths to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'reels/:topic', component: ReelsComponent },
  { path: 'profile', component: ProfileComponent },
];
