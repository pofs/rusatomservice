// angular
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

// Framework
import { ApiClientService, ApiError, Resource } from '../netlab-framework/api/src/api.service';
import { UiNotificationsService } from '../netlab-modules/ui/notifications';
import { select, Store } from '@ngrx/store';
import { getWorkingLanguage, Language } from '../framework/i18n/i18n.module';
import { ModelSchema } from './models';

// libs
import { Observable } from 'rxjs/Observable';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { merge } from 'lodash';
import { isUndefined } from 'util';

import { ObservableQueues } from '../netlab-framework/ui-notifications/observable-queue';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

export class WorkDirectionSchema extends ModelSchema {
  id: number;
}

export class WorkDirection extends WorkDirectionSchema {
  constructor(data: WorkDirectionSchema) {
    super();
    merge(this, data);
  }
}

export class WorkDirections extends Array<WorkDirection> {
  constructor(workdirections: Array<WorkDirectionSchema> = []) {
    super();

    workdirections.forEach(workdirection => {
      this.push(new WorkDirection(workdirection));
    });

    Object.setPrototypeOf(this, Object.create(WorkDirections.prototype));
  }
}

@Injectable()
export class WorkdirectionsService {
  private currentLanguage$: Observable<Language>;
  private resource: Resource<WorkDirectionSchema> = this.api.build<WorkDirectionSchema>('workdirections', false);
  private requestQueues = new ObservableQueues<ApiError | WorkDirections>();
  private indexCacheRu = new WorkDirections();
  private indexCacheEn = new WorkDirections();

  constructor(
    private api: ApiClientService,
    private notifications: UiNotificationsService,
    private readonly store: Store<Language>
  ) {
    this.currentLanguage$ = this.store
      .pipe(select(getWorkingLanguage));
  }

  index(): Observable<ApiError | WorkDirections> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        let params: HttpParams = this.langParam(lang);
        params = params.set('properties', 'image,color');

        return this.processResponseWithCache(this.resource.index(params), lang.code);
      })
    );
  }

  show(id: string | number): Observable<ApiError | WorkDirection> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        const params: HttpParams = new HttpParams()
          .set('properties', 'descriptions');

        return this.processResponse(this.resource.show(id, params));
      })
    );
  }

  private processResponseWithCache(
    obs: Observable<Array<WorkDirectionSchema> | ApiError>, lang = 'ru', method = 'index'
  ): Observable<ApiError | WorkDirections> {
    return this.requestQueues.add(
      defer(() => {
        if (
          (lang === 'ru' ? this.indexCacheRu : this.indexCacheEn).length === 0
        ) {
          return this.processResponse(obs)
            .pipe(
              filter(e => !(e instanceof ApiError)),
              tap((wd: WorkDirections) => {
                lang === 'ru' ? this.indexCacheRu = wd : this.indexCacheEn = wd;
              })
            );
        } else {
          return lang === 'ru' ? of(this.indexCacheRu) : of(this.indexCacheEn);
        }
      }), method);
  }

  private langParam(lang: Language): HttpParams {
    let params: HttpParams = new HttpParams();
    if (!isUndefined(lang) && lang.code) {
      params = params.set('lang', lang.code);
    }

    return params;
  }

  private processResponse(obs: Observable<Array<WorkDirectionSchema> | ApiError>): Observable<ApiError | WorkDirections>;
  private processResponse(obs: Observable<WorkDirectionSchema | ApiError>): Observable<ApiError | WorkDirection>;
  private processResponse(
    obs: Observable<WorkDirectionSchema | Array<WorkDirectionSchema> | ApiError>
  ): Observable<ApiError | WorkDirections | WorkDirection> {
    return obs.pipe(
      map((raw: ApiError | WorkDirections | WorkDirection) => {
        if (raw instanceof ApiError) {
          this.notifications
            .toast({
              type: 'error',
              timeOut: 4000,
              title: 'Ошибка API!',
              text: 'При запросе списка услуг произошла ошибка',
              icon: 'fas fa-code-branch'
            })
            .subscribe();

          return raw;
        }
        if (raw instanceof Array) {
          return new WorkDirections(raw as Array<WorkDirectionSchema>);
        } else {
          return new WorkDirection(raw as WorkDirectionSchema);
        }
      })
    );
  }
}
