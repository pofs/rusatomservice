// angular
import { ChangeDetectionStrategy, Component } from '@angular/core';

// framework
import { getWorkingLanguage, Language } from '../../../framework/i18n/i18n.module';
import { News, NewsRecord, NewsService } from '../../models/news.service';

import { filter, map } from 'rxjs/operators';
import { takeRight } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '@ngx-config/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recent-news',
  templateUrl: './recent-news.component.html'
})
export class RecentNewsComponent {

  news$: Observable<Array<{main: NewsRecord, others: News}>> = this.news
    .recent('3')
    .pipe(
      filter(response => response instanceof News),
      map((news: News) => {
       return [{
         main: news[0],
         others: takeRight(news, 2) as News
       }];
      })
    );

  constructor(
    private readonly news: NewsService
  ) { }
}
