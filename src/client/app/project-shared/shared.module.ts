import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ServicesTreeComponent } from './services-tree/services-tree.component';
import { LanguageListComponent } from './language-list/language-list.component';
import { WithoutSelectedLanguagePipe } from './language-list/language-list-without.pipe';
import { RecentProjectsComponent } from './recent-projects/recent-projects.component';
import { RecentNewsComponent } from './recent-news/recent-news.component';
import { SharedModule } from '../framework/core/shared.module';
import { AddDefaultHostPipe, HtmlSanitizerPipe } from './pipes/html-sanitizer.pipe';

/**
 * `SharedModule` - модуль элементов интерфейса
 */
@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  declarations: [
    LanguageListComponent,
    ServicesTreeComponent,
    WithoutSelectedLanguagePipe,
    RecentProjectsComponent,
    RecentNewsComponent,
    HtmlSanitizerPipe,
    AddDefaultHostPipe
  ],
  exports: [
    HtmlSanitizerPipe,
    AddDefaultHostPipe,
    LanguageListComponent,
    ServicesTreeComponent,
    WithoutSelectedLanguagePipe,
    RecentProjectsComponent,
    RecentNewsComponent
  ]
})
export class ProjectSharedModule {}
