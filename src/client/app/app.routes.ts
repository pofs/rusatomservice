// angular
import { Routes } from '@angular/router';

// libs
import { MetaGuard } from '@ngx-meta/core';

// components
import { NoContentComponent } from './components/404/no-content.component';
import { LoginComponent } from './components/login';
import { MainComponent } from './components/layout';

const mainRouterPart: Routes = [
  {
    path: '',
    loadChildren: './components/+home/home.module#HomeModule'
  },
  {
    path: 'about',
    loadChildren: './components/+about/about.module#AboutModule'
  },
  {
    path: 'contacts',
    loadChildren: './components/+contacts/contacts.module#ContactsModule'
  },
  {
    path: 'press-center',
    loadChildren: './components/+press-center/press-center.module#PressCenterModule'
  },
  {
    path: 'activities',
    loadChildren: './components/+activities/activities.module#ActivitiesModule'
  },
  {
    path: 'projects',
    loadChildren: './components/+projects/projects.module#ProjectsModule'
  }
];

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: mainRouterPart,
    canActivateChild: [MetaGuard],
    data: {
      i18n: {
        isRoot: true
      }
    }
  },
  {
    path: 'ru',
    redirectTo: '/'
  },
  {
    path: ':locale',
    component: MainComponent,
    children: mainRouterPart,
    canActivateChild: [MetaGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NoContentComponent
  }
];
