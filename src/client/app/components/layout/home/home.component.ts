// angular
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

// framework
import { getWorkingLanguage, Language } from '../../../framework/i18n/i18n.module';

// libs
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import { ConfigService } from '@ngx-config/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {
  title: string;
  currentLanguage$: Observable<Language>;
  availableLanguages: Array<Language>;
  isBrowser: boolean;

  constructor(private readonly store: Store<Language>,
              private elementRef: ElementRef,
              private readonly config: ConfigService,
              @Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.currentLanguage$ = this.store.pipe(select(getWorkingLanguage));
    this.availableLanguages = this.config.getSettings('i18n.availableLanguages');
  }

  ngAfterViewInit(): void {
    if (this.isBrowser)  {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'http://new.rusatomservice.ru/bitrix/templates/Main/js/bundle.js';
      this.elementRef.nativeElement.appendChild(s);
    }
  }
}
