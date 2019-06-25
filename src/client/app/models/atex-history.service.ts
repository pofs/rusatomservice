// angular
import { Injectable } from '@angular/core';

// Framework
import { ApiClientService, ApiError, Resource } from '../netlab-framework/api/src/api.service';
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

export class AtexHistoryRecordSchema extends ModelSchema {
  id: number;
}

export class AtexHistoryRecord extends AtexHistoryRecordSchema {
  constructor(data: AtexHistoryRecordSchema) {
    super();
    merge(this, data);
  }
}

export class AtexHistory extends Array<AtexHistoryRecord> {
  constructor(workdirections: Array<AtexHistoryRecordSchema> = []) {
    super();

    workdirections.forEach(workdirection => {
      this.push(new AtexHistoryRecord(workdirection));
    });

    Object.setPrototypeOf(this, Object.create(AtexHistory.prototype));
  }
}

@Injectable()
export class AtexHistoryService {
  private currentLanguage$: Observable<Language>;
  private resource: Resource<AtexHistoryRecordSchema> = this.api.build('history', false);

  constructor(
    private api: ApiClientService,
    private notifications: UiNotificationsService,
    private readonly store: Store<Language>
  ) {
    this.currentLanguage$ = this.store
      .pipe(select(getWorkingLanguage));
  }

  index(): Observable<ApiError | AtexHistory> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        let params: HttpParams = new HttpParams();
        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }
        params = params.set('properties', 'YEAR');

        return this.processResponse(this.resource.index(params));
      })
    );
  }

  private processResponse(obs: Observable<Array<AtexHistoryRecordSchema> | ApiError>): Observable<ApiError | AtexHistory>;
  private processResponse(obs: Observable<AtexHistoryRecordSchema | ApiError>): Observable<ApiError | AtexHistoryRecord>;
  private processResponse(
    obs: Observable<AtexHistoryRecordSchema | Array<AtexHistoryRecordSchema> | ApiError>
  ): Observable<ApiError | AtexHistory | AtexHistoryRecord> {
    return obs.pipe(
      map((raw: ApiError | AtexHistory | AtexHistoryRecord) => {
        if (raw instanceof ApiError) {
          this.notifications
            .toast({
              type: 'error',
              timeOut: 4000,
              title: 'Ошибка API!',
              text: 'При запросе ATEX HISTORY произошла ошибка',
              icon: 'fas fa-code-branch'
            })
            .subscribe();

          return raw;
        }
        if (raw instanceof Array) {
          return new AtexHistory(raw as Array<AtexHistoryRecordSchema>);
        } else {
          return new AtexHistoryRecord(raw as AtexHistoryRecordSchema);
        }
      })
    );
  }
}
