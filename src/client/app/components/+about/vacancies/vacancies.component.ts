// angular
import { Component } from '@angular/core';
import { Records, VacanciesService } from '../../../models/vacancies.service';
import { Observable } from 'rxjs/Observable';
import { ApiError } from '../../../netlab-framework/api/src/api.service';
import { filter } from 'rxjs/operators';
import { UiNotificationsService } from '../../../netlab-modules/ui/notifications/core';
import { VacanciesFormComponent } from '../../../netlab-modules/entry-components/form/vacancies/vacancies-form.component';
import { FormBuilder, RequiredValidator, Validators } from '@angular/forms';

@Component({
  templateUrl: './vacancies.component.html',
  styleUrls: ['vacancies.component.scss']
})
export class VacanciesComponent {
  openedVacancy: number;

  vacancies$: Observable<Records> = this.vacancies
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    ) as Observable<Records>;

  constructor(
    readonly vacancies: VacanciesService,
    readonly notifications: UiNotificationsService,
    readonly fb: FormBuilder
  ) { }

  open(id: number): void {
    this.openedVacancy = (this.openedVacancy === id) ? undefined : id;
  }

  openVacanciesForm(): void {
    this.notifications
      .dialog({
        component: VacanciesFormComponent,
        componentInput: {
          form: this.fb.group({
            name: [undefined, Validators.required],
            age: '',
            job: '',
            phone: [undefined, Validators.required],
            acceptTerms: [undefined, Validators.required]
          })
        },
        title: 'Откликнуться на вакансию',
        acceptButtonText: 'Отправить'
      })
      .subscribe();
  }
}
