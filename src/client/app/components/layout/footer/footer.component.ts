// angular
import { Component, OnInit } from '@angular/core';

// libs
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import { ConfigService } from '@ngx-config/core';

// framework
import { getWorkingLanguage, Language } from '../../../framework/i18n/i18n.module';
import { WorkdirectionsService } from '../../../models/workdirections.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  title: string;
  currentLanguage$: Observable<Language>;
  availableLanguages: Array<Language>;
  workdirections$ = this.workdirections.index();

  constructor(private readonly store: Store<Language>,
              private readonly config: ConfigService,
              private readonly workdirections: WorkdirectionsService) {
  }

  ngOnInit(): void {
    this.currentLanguage$ = this.store.pipe(select(getWorkingLanguage));
    this.availableLanguages = this.config.getSettings('i18n.availableLanguages');
  }
}
