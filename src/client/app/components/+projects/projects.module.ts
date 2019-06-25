// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// libs
// TODO: ngx-i18n-router
// import { I18NRouterModule } from '@ngx-i18n-router/core';

// framework
import { SharedModule } from '../../framework/core/shared.module';

// routes & components
import { routes } from './projects.routes';
import { ProjectsComponent } from './projects.component';
import { UiModule } from '../../netlab-modules/ui';
import { ProjectSharedModule } from '../../project-shared';
import { ProjectComponent } from './project.component';

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
  declarations: [ProjectsComponent, ProjectComponent]
})
export class ProjectsModule {
}
