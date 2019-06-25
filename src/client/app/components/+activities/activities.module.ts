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
import { routes } from './activities.routes';
import { ActivitiesComponent } from './activities.component';
import { ActivityComponent } from './activity/activity.component';
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
    ActivitiesComponent,
    ActivityComponent
  ]
})
export class ActivitiesModule {
}
