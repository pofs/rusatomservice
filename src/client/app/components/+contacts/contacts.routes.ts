// angular
import { Routes } from '@angular/router';

// components
import { ContactsComponent } from './contacts.component';

export const routes: Routes = [
  {
    path: '',
    component: ContactsComponent,
    data: {
      state: 'contacts',
      meta: {
        title: 'PUBLIC.CONTACTS.PAGE_TITLE',
        override: true,
        description: 'PUBLIC.CONTACTS.META_DESCRIPTION'
      }
    }
  }
];
