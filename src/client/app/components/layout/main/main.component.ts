// angular
import {
  Component, OnInit, ViewEncapsulation
} from '@angular/core';

import { ActivatedRoute, RouterOutlet } from '@angular/router';

import { routeAnimation } from '../../../app.animations';
import { Store } from '@ngrx/store';
import { Language } from '../../../framework/i18n/src/models/language';
import * as language from '../../../framework/i18n/src/language.actions';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    routeAnimation
  ]
})
export class MainComponent implements OnInit {
  wrapperClass: [string, string] = ['content-wrapper', ''];

  constructor(
    private readonly store: Store<Language>,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: {locale: string}) => {
        if (params.locale) {
          this.store.dispatch(new language.UseLanguage(params.locale));
        } else {
          this.store.dispatch(new language.UseLanguage('ru'));
        }
      });
  }

  onActivate(event$: any, scrollContainer: any): void {
    scrollContainer.scrollTop = 0;
  }

  getState(outlet: RouterOutlet): any {
    this.wrapperClass[1] = outlet.activatedRouteData.state;

    return outlet.activatedRouteData.state;
  }
}
