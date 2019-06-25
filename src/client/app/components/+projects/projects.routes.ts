// angular
import { Routes } from '@angular/router';

// components
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    data: {
      state: 'projects',
      meta: {
        title: 'PUBLIC.PROJECTS.PAGE_TITLE',
        override: true,
        description: 'PUBLIC.PROJECTS.META_DESCRIPTION'
      }
    }
  },
  {
    path: ':id',
    component: ProjectComponent,
    data: {
      state: 'projectsItem',
      meta: {
        title: 'PUBLIC.PROJECTS.PAGE_TITLE',
        override: true,
        description: 'PUBLIC.PROJECTS.META_DESCRIPTION'
      }
    }
  }
];
