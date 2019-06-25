// angular
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UiNotificationsService } from '../../netlab-modules/ui/notifications/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FeedbackFormComponent } from '../../netlab-modules/entry-components/form/feedback/feedback-form.component';
import { getWorkingLanguage, Language } from '../../framework/i18n/i18n.module';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { first, tap } from 'rxjs/operators';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contacts.component.html',
  styleUrls: ['contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  currentLanguage$: Observable<Language>;
  currentLanguage: Language;

  constructor(
    readonly store: Store<Language>,
    readonly notifications: UiNotificationsService,
    readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentLanguage$ = this.store
      .pipe(
        select(getWorkingLanguage),
        tap(l => this.currentLanguage = l),
        first()
      );

    this.currentLanguage$.subscribe();
  }

  openFeedbackForm(): void {
    this.notifications
      .dialog({
        component: FeedbackFormComponent,
        componentInput: {
          form: this.fb.group({
            name: [undefined, Validators.required],
            text: '',
            phone: [undefined, Validators.required],
            acceptTerms: [undefined, Validators.required]
          })
        },
        title: this.currentLanguage.code === 'ru' ? 'Обратная связь' : 'Feedback',
        acceptButtonText: this.currentLanguage.code === 'ru' ? 'Отправить' : 'Send'
      })
      .subscribe();
  }
}
