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
import { routes } from './press-center.routes';
import { PressCenterComponent } from './press-center.component';
import { NewsComponent } from './news/news.component';
import { IndustryNewsComponent } from './industry-news/industry-news.component';
import { CompanyNewsComponent } from './company-news/company-news.component';
import { GalleryComponent } from './gallery/gallery.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { SmiComponent } from './smi/smi.component';
import { ProjectSharedModule } from '../../project-shared';
import { NewsElementComponent } from './news/news-element.component';
import { SmiElementComponent } from './smi/smi-element.component';
import { GalleryItemComponent } from './gallery/gallery-item.component';

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
    NewsElementComponent,
    PressCenterComponent,
    NewsComponent,
    IndustryNewsComponent,
    CompanyNewsComponent,
    GalleryComponent,
    StyleGuideComponent,
    SmiComponent,
    SmiElementComponent,
    GalleryItemComponent
  ]
})
export class PressCenterModule {
}
