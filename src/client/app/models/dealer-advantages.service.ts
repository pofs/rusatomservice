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

export class RecordSchema extends ModelSchema {
  id: number;
}

export class Record extends RecordSchema {
  constructor(data: RecordSchema) {
    super();
    merge(this, data);
  }
}

export class Records extends Array<Record> {
  constructor(workdirections: Array<RecordSchema> = []) {
    super();

    workdirections.forEach(workdirection => {
      this.push(new Record(workdirection));
    });

    Object.setPrototypeOf(this, Object.create(Records.prototype));
  }
}

@Injectable()
export class DealerAdvantagesService {
  private currentLanguage$: Observable<Language>;
  private resource: Resource<RecordSchema> = this.api.build('dealerAdvantages');

  constructor(
    private api: ApiClientService,
    private notifications: UiNotificationsService,
    private readonly store: Store<Language>
  ) {
    this.currentLanguage$ = this.store
      .pipe(select(getWorkingLanguage));
  }

  index(): Observable<ApiError | Records> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        let params: HttpParams = new HttpParams();
        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }
        params = params.set('properties', 'color,icon');

        return this.processResponse(this.resource.index(params));
      })
    );
  }

  private processResponse(obs: Observable<Array<RecordSchema> | ApiError>): Observable<ApiError | Records>;
  private processResponse(obs: Observable<RecordSchema | ApiError>): Observable<ApiError | Record>;
  private processResponse(
    obs: Observable<RecordSchema | Array<RecordSchema> | ApiError>
  ): Observable<ApiError | Records | Record> {
    return obs.pipe(
      map((raw: ApiError | Records | Record) => {
        if (raw instanceof ApiError) {
          this.notifications
            .toast({
              type: 'error',
              timeOut: 4000,
              title: 'Ошибка API!',
              text: 'При запросе dealerAdvantages произошла ошибка',
              icon: 'fas fa-code-branch'
            })
            .subscribe();

          return raw;
        }
        if (raw instanceof Array) {
          return new Records(raw as Array<RecordSchema>);
        } else {
          return new Record(raw as RecordSchema);
        }
      })
    );
  }
}
