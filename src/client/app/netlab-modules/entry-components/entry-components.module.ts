import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { RouterModule } from '@angular/router';

import { UiModule } from '../ui';
import { VacanciesFormComponent } from './form/vacancies/vacancies-form.component';
import { FeedbackFormComponent } from './form/feedback/feedback-form.component';
import { SharedModule } from '../../framework/core/shared.module';

/**
 * `EntryComponentsModule` - модуль компонентов, которые не декларируются в шаблонах
 */
@NgModule({
  entryComponents: [
    VacanciesFormComponent,
    FeedbackFormComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UiModule
  ],
  declarations: [
    VacanciesFormComponent,
    FeedbackFormComponent
  ]
})
export class EntryComponentsModule {}
