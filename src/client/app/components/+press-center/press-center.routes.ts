// angular
import { Routes } from '@angular/router';

// components
import { PressCenterComponent } from './press-center.component';
import { NewsComponent } from './news/news.component';
import { IndustryNewsComponent } from './industry-news/industry-news.component';
import { CompanyNewsComponent } from './company-news/company-news.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { SmiComponent } from './smi/smi.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NewsElementComponent } from './news/news-element.component';
import { SmiElementComponent } from './smi/smi-element.component';
import { GalleryItemComponent } from './gallery/gallery-item.component';

export const routes: Routes = [
  {
    path: '',
    component: PressCenterComponent,
    data: {
      state: 'press-center'
    },
    children: [
      {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full'
      },
      {
        path: 'news',
        component: NewsComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.NEWS.PAGE_TITLE',
            description: 'PUBLIC.NEWS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'industry-news',
        component: IndustryNewsComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.OTRASLY_NEWS.PAGE_TITLE',
            description: 'PUBLIC.OTRASLY_NEWS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'company-news',
        component: CompanyNewsComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.COMPANY_NEWS.PAGE_TITLE',
            description: 'PUBLIC.COMPANY_NEWS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'news/:id',
        component: NewsElementComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.COMPANY_NEWS.PAGE_TITLE',
            description: 'PUBLIC.COMPANY_NEWS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'smi',
        component: SmiComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.NEWS.PAGE_TITLE',
            description: 'PUBLIC.NEWS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'smi/:id',
        component: SmiElementComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.COMPANY_NEWS.PAGE_TITLE',
            description: 'PUBLIC.COMPANY_NEWS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'gallery',
        component: GalleryComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.GALLERY.PAGE_TITLE',
            description: 'PUBLIC.GALLERY.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'gallery/:id',
        component: GalleryItemComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.GALLERY.PAGE_TITLE',
            description: 'PUBLIC.GALLERY.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'style-guide',
        component: StyleGuideComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.CORPORATE_IDENTITY.PAGE_TITLE',
            description: 'PUBLIC.CORPORATE_IDENTITY.META_DESCRIPTION'
          }
        }
      }
    ]
  }
];
