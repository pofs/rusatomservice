import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { LoadingUiModule } from './loading';
import { FormUiModule } from './form';
import { AccordeonModule } from './accordeon';
import { PaginationUiModule } from './pagination';
import { IfLocaleDirective } from './if-locale/if-locale.directive';
import { UiNotificationsModule } from './notifications/ui-notifications.module';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NguCarouselModule } from '@ngu/carousel';
import { LightboxModule } from 'angular2-lightbox';
import { NgPipesModule } from 'angular-pipes';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  // suppressScrollX: true
};

/**
 * `UiModule` - модуль элементов интерфейса
 */
@NgModule({
  imports: [
    CommonModule,
    LoadingUiModule,
    FormUiModule,
    UiNotificationsModule,
    PerfectScrollbarModule,
    AccordeonModule,
    PaginationUiModule,
    NguCarouselModule,
    LightboxModule,
    NgPipesModule
  ],
  exports: [
    LoadingUiModule,
    FormUiModule,
    UiNotificationsModule,
    PerfectScrollbarModule,
    AccordeonModule,
    PaginationUiModule,
    NguCarouselModule,
    IfLocaleDirective,
    LightboxModule,
    NgPipesModule
  ],
  declarations: [
    IfLocaleDirective
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class UiModule {}
