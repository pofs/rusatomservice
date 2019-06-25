// angular
import { Routes } from '@angular/router';

// components
import { HomeComponent } from './home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      state: 'home',
      meta: {
        title: 'PUBLIC.HOME.PAGE_TITLE',
        override: true,
        description: 'PUBLIC.HOME.META_DESCRIPTION'
      }
    }
  }
];
