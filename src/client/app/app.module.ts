// angular
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowserModule, makeStateKey } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
// import { TransferHttpCacheModule } from '@nguniversal/common';

// libs
import { ConfigLoader, ConfigService } from '@ngx-config/core';
import { MetaLoader } from '@ngx-meta/core';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ANGULARTICS2_TOKEN } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { AgmCoreModule } from '@agm/core';

// framework
import { configFactory, CoreModule, metaFactory } from './framework/core/core.module';
import { SharedModule } from './framework/core/shared.module';
import { I18NModule, translateFactory } from './framework/i18n/i18n.module';
import { AnalyticsModule } from './framework/analytics/analytics.module';

// Netlab Framework
import { ApiModule } from './netlab-framework/api/api.module';

// Netlab Modules
import { UiModule } from './netlab-modules/ui';
import { ProjectSharedModule } from './project-shared';
import { ModelsModule } from './models';

// routes & components
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { NoContentComponent } from './components/404/no-content.component';
import { LAYOUT_COMPONENTS } from './components/layout';

export const REQ_KEY = makeStateKey<string>('req');

// styles
import '../assets/sass/lib.scss';
import '../assets/sass/layout.scss';
import '../assets/sass/netlab/styles.scss';
import { UiNotificationsModule } from './netlab-modules/ui/notifications/ui-notifications.module';
import { EntryComponentsModule } from './netlab-modules/entry-components';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'rus-atom-service'}),
    RouterModule.forRoot(routes),
    CoreModule.forRoot([
      {
        provide: ConfigLoader,
        useFactory: configFactory,
        deps: [
          PLATFORM_ID,
          HttpClient
        ]
      },
      {
        provide: MetaLoader,
        useFactory: metaFactory,
        deps: [
          ConfigService,
          TranslateService
        ]
      }
    ]),
    ApiModule,
    EntryComponentsModule,
    SharedModule,
    UiNotificationsModule.forRoot(),
    ProjectSharedModule,
    ModelsModule,
    UiModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDiiq1ZDHpeVlsaQzKGQAuLdJED4nNdbg8',
      language: 'en',
      region: 'US'
    }),
    I18NModule.forRoot([
      {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [
          PLATFORM_ID,
          HttpClient
        ]
      }
    ]),
    AnalyticsModule.forRoot([
      {
        provide: ANGULARTICS2_TOKEN,
        useValue: {
          providers: [Angulartics2GoogleAnalytics],
          settings: {}
        }
      }
    ])
  ],
  declarations: [
    AppComponent,
    NoContentComponent,
    LAYOUT_COMPONENTS
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private readonly platformId: any) {
  }
}
