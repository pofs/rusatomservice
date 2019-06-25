import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { getWorkingLanguage, Language } from '../../../framework/i18n/i18n.module';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/* tslint:disable */
@Directive({ selector: '[appIfLocale]'})
/* tslint:enable */
export class IfLocaleDirective implements OnDestroy, OnInit {
  currentLanguage: Language;

  private subscriptions: Subscription = Subscription.EMPTY;
  private condLocale: string;

  @Input() set appIfLocale(condition: string) {
    this.condLocale = condition;
    this.checkCond();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private readonly store: Store<Language>
    ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .pipe(select(getWorkingLanguage))
        .subscribe(lang => {
          this.currentLanguage = lang;
          this.checkCond();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkCond(): void {
    if (typeof this.currentLanguage === 'undefined') {
      this.viewContainer.clear();
    } else {
      if (this.condLocale === this.currentLanguage.code) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (this.condLocale !== this.currentLanguage.code) {
        this.viewContainer.clear();
      }
    }
  }
}
