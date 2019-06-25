import { ModuleWithProviders, NgModule } from '@angular/core';

// Services
import { UiNotificationsService } from './core';

// Components
import { UiDialogComponent, UiNotificationsComponent, UiToastComponent } from './components';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    UiNotificationsComponent,
    UiToastComponent,
    UiDialogComponent
  ],
  exports: [
    UiNotificationsComponent,
    UiToastComponent,
    UiDialogComponent
  ]
})
export class UiNotificationsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UiNotificationsModule,
      providers: [
        UiNotificationsService
      ]
    };
  }
}
