// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// libs
// TODO: ngx-i18n-router
// import { I18NRouterModule } from '@ngx-i18n-router/core';

// framework
import { SharedModule } from '../../framework/core/shared.module';
import { UiModule } from '../../netlab-modules/ui';

// routes & components
import { routes } from './about.routes';
import { AboutComponent } from './about.component';
import { RusatomserviceComponent } from './rusatomservice/rusatomservice.component';
import { TeamComponent } from './team/team.component';
import { PartnersComponent } from './partners/partners.component';
import { AdvantagesComponent } from './advantages/advantages.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { CertificatesComponent } from './certificetes/certificates.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { AntiCorruptionComponent } from './anti-corruption/anti-corruption.component';
import { CandidatesPoolComponent } from './candidates-pool/candidates-pool.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { AtomtehexportComponent } from './atomtehexport/atomtehexport.component';
import { ProjectSharedModule } from '../../project-shared';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    // TODO: ngx-i18n-router
    // I18NRouterModule.forChild(routes, 'home')
    RouterModule.forChild(routes),
    SharedModule,
    ProjectSharedModule
  ],
  declarations: [
    AboutComponent,
    RusatomserviceComponent,
    TeamComponent,
    PartnersComponent,
    AdvantagesComponent,
    ReviewsComponent,
    CertificatesComponent,
    SuppliersComponent,
    AntiCorruptionComponent,
    CandidatesPoolComponent,
    VacanciesComponent,
    AtomtehexportComponent
  ]
})
export class AboutModule {
}
