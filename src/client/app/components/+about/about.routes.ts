// angular
import { Routes } from '@angular/router';

// components
import { AboutComponent } from './about.component';
import { RusatomserviceComponent } from './rusatomservice/rusatomservice.component';
import { TeamComponent } from './team/team.component';
import { PartnersComponent } from './partners/partners.component';
import { AdvantagesComponent } from './advantages/advantages.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { CertificatesComponent } from './certificetes/certificates.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { AntiCorruptionComponent } from './anti-corruption/anti-corruption.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { CandidatesPoolComponent } from './candidates-pool/candidates-pool.component';
import { AtomtehexportComponent } from './atomtehexport/atomtehexport.component';

export const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    data: {
      state: 'about'
    },
    children: [
      {
        path: '',
        redirectTo: 'rusatom-service'
      },
      {
        path: 'rusatom-service',
        component: RusatomserviceComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'team',
        component: TeamComponent,
        data: {
          sectionCode: 'rusatomservice',
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.TEAM.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.TEAM.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'atomtehexport',
        component: AtomtehexportComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.ATEX.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.ATEX.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'atex-team',
        component: TeamComponent,
        data: {
          sectionCode: 'atex',
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.ATEX_TEAM.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.ATEX_TEAM.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'partners',
        component: PartnersComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.PARTNERS.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.PARTNERS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'advantages',
        component: AdvantagesComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.ADVANTAGES.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.ADVANTAGES.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'reviews',
        component: ReviewsComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.REVIEWS.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.REVIEWS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'certificates',
        component: CertificatesComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.CERTIFICATES.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.CERTIFICATES.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'suppliers',
        component: SuppliersComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.SUPPLIERS.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.SUPPLIERS.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'anti-corruption',
        component: AntiCorruptionComponent,
        data: {
          meta: {
            override: true,
            title: 'PUBLIC.ABOUT.ANTICORRUPTION.PAGE_TITLE',
            description: 'PUBLIC.ABOUT.ANTICORRUPTION.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'vacancies',
        children: [
          {
            path: '',
            redirectTo: 'all'
          },
          {
            path: 'all',
            component: VacanciesComponent,
            data: {
              meta: {
                override: true,
                title: 'PUBLIC.ABOUT.VACANCIESALL.PAGE_TITLE',
                description: 'PUBLIC.ABOUT.VACANCIESALL.META_DESCRIPTION'
              }
            }
          },
          {
            path: 'candidates-pool',
            component: CandidatesPoolComponent,
            data: {
              meta: {
                override: true,
                title: 'PUBLIC.ABOUT.CANDIDATES.PAGE_TITLE',
                description: 'PUBLIC.ABOUT.CANDIDATES.META_DESCRIPTION'
              }
            }
          }
        ]
      }
    ]
  }
];
