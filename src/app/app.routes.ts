import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { BeanListComponent } from './components/bean-list/bean-list';
import { StatisticsComponent } from './components/statistics/statistics';
import { DeveloperComponent } from './components/developer/developer';
import { AboutComponent } from './components/about/about';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'beans', component: BeanListComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'developer', component: DeveloperComponent },
  { path: '**', redirectTo: '' }
];
