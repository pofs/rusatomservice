// angular
import { Injectable } from '@angular/core';

// Framework
import { ApiClientService, ApiError, Collection, Resource } from '../netlab-framework/api/src/api.service';
import { ModelSchema } from './models';
import { UiNotificationsService } from '../netlab-modules/ui/notifications';
import { HttpParams } from '@angular/common/http';

// libs
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import { merge } from 'lodash';
import { select, Store } from '@ngrx/store';
import { getWorkingLanguage, Language } from '../framework/i18n/i18n.module';
import { isUndefined } from 'util';

export class NewsRecordSchema extends ModelSchema {
  id: number;
}

export class NewsRecord extends NewsRecordSchema {
  constructor(data: NewsRecordSchema) {
    super();
    merge(this, data);
  }
}

export class News extends Collection<NewsRecord> {
  constructor(nws: Collection<NewsRecordSchema>) {
    super();

    this.currentPage = nws.currentPage;
    this.total = nws.total;
    this.perPage = nws.perPage;
    this.pageCount = nws.pageCount;

    nws.forEach(n => {
      this.push(new NewsRecord(n));
    });

    Object.setPrototypeOf(this, Object.create(News.prototype));
  }
}

@Injectable()
export class SmiService {
  private currentLanguage$: Observable<Language>;
  private resource: Resource<NewsRecordSchema> = this.api.build('smi', false);

  constructor(
    private api: ApiClientService,
    private notifications: UiNotificationsService,
    private readonly store: Store<Language>
  ) {
    this.currentLanguage$ = this.store
      .pipe(select(getWorkingLanguage));
  }

  index(params = new HttpParams()): Observable<ApiError | News> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }

        params = params
          .set('order', 'created_at')
          .set('direction', 'desc');

        return this.processResponse(this.resource.index(params));
      })
    );
  }

  recent(count = '3'): Observable<ApiError | News> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        let params: HttpParams = new HttpParams();

        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }

        params = params
          .set('page', '1')
          .set('per', count)
          .set('order', 'created_at')
          .set('direction', 'desc');

        return this.processResponse(this.resource.index(params));
      })
    );
  }

  show(id: number, params = new HttpParams()): Observable<ApiError | NewsRecord> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }
        params = params.set('properties', 'ADDITIONAL_PHOTOS');

        return this.processResponse(this.resource.show(id, params));
      })
    );
  }

  private processResponse(obs: Observable<Array<NewsRecordSchema> | ApiError>): Observable<ApiError | News>;
  private processResponse(obs: Observable<NewsRecordSchema | ApiError>): Observable<ApiError | NewsRecord>;
  private processResponse(
    obs: Observable<NewsRecordSchema | Array<NewsRecordSchema> | ApiError>
  ): Observable<ApiError | News | NewsRecord> {
    return obs.pipe(
      map((raw: ApiError | News | NewsRecord) => {
        if (raw instanceof ApiError) {
          this.notifications
            .toast({
              type: 'error',
              timeOut: 4000,
              title: 'Ошибка API!',
              text: 'При запросе новости произошла ошибка',
              icon: 'fas fa-code-branch'
            })
            .subscribe();

          return raw;
        }
        if (raw instanceof Array) {
          return new News(raw as Collection<NewsRecordSchema>);
        } else {
          return new NewsRecord(raw as NewsRecordSchema);
        }
      })
    );
  }
}
