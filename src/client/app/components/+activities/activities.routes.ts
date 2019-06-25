// angular
import { Routes } from '@angular/router';

// components
import { ActivitiesComponent } from './activities.component';
import { ActivityComponent } from './activity/activity.component';

export const routes: Routes = [
  {
    path: '',
    component: ActivitiesComponent,
    data: {
      state: 'activities'
    },
    children: [
      {
        path: '',
        component: ActivityComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ACTIVITIES.PAGE_TITLE',
            description: 'PUBLIC.ACTIVITIES.META_DESCRIPTION'
          }
        }
      },
      {
        path: ':activitySlug',
        component: ActivityComponent
      }
    ]
  }
];
