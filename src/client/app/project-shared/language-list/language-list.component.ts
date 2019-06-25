// angular
import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';

// framework
import { getWorkingLanguage, Language } from '../../framework/i18n/i18n.module';
import { isEqual } from 'lodash';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '@ngx-config/core';
import { Subscription } from 'rxjs/Subscription';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html'
})
export class LanguageListComponent implements OnDestroy, OnInit {
  currentLanguage$: Observable<Language>;
  availableLanguages: Array<Language>;
  currentLanguage: Language;

  subscriptions: Subscription = Subscription.EMPTY;

  constructor(
    private readonly store: Store<Language>,
    private readonly config: ConfigService
  ) { }

  ngOnInit(): void {
    this.currentLanguage$ = this.store.pipe(select(getWorkingLanguage));
    this.availableLanguages = this.config.getSettings('i18n.availableLanguages');

    this.subscriptions.add(
      this.currentLanguage$
        .pipe(
          tap((lang: Language) => this.currentLanguage = lang)
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isLanguageActive(lang: Language): boolean {
    return isEqual(this.currentLanguage, lang);
  }
}
