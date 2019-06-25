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

export class AtekDealerinfoSchema extends ModelSchema {
  id: number;
}

export class AtekDealerinfo extends AtekDealerinfoSchema {
  constructor(data: AtekDealerinfoSchema) {
    super();
    merge(this, data);
  }
}

export class AtekDealerinfoes extends Array<AtekDealerinfo> {
  constructor(workdirections: Array<AtekDealerinfoSchema> = []) {
    super();

    workdirections.forEach(workdirection => {
      this.push(new AtekDealerinfo(workdirection));
    });

    Object.setPrototypeOf(this, Object.create(AtekDealerinfoes.prototype));
  }
}

@Injectable()
export class AtekDealerinfoesService {
  private currentLanguage$: Observable<Language>;
  private resource: Resource<AtekDealerinfoSchema> = this.api.build('atekdealerinfo');

  constructor(
    private api: ApiClientService,
    private notifications: UiNotificationsService,
    private readonly store: Store<Language>
  ) {
    this.currentLanguage$ = this.store
      .pipe(select(getWorkingLanguage));
  }

  index(): Observable<ApiError | AtekDealerinfoes> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        let params: HttpParams = new HttpParams();
        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }
        params = params.set('properties', 'FILE');

        return this.processResponse(this.resource.index(params));
      })
    );
  }

  private processResponse(obs: Observable<Array<AtekDealerinfoSchema> | ApiError>): Observable<ApiError | AtekDealerinfoes>;
  private processResponse(obs: Observable<AtekDealerinfoSchema | ApiError>): Observable<ApiError | AtekDealerinfo>;
  private processResponse(
    obs: Observable<AtekDealerinfoSchema | Array<AtekDealerinfoSchema> | ApiError>
  ): Observable<ApiError | AtekDealerinfoes | AtekDealerinfo> {
    return obs.pipe(
      map((raw: ApiError | AtekDealerinfoes | AtekDealerinfo) => {
        if (raw instanceof ApiError) {
          this.notifications
            .toast({
              type: 'error',
              timeOut: 4000,
              title: 'Ошибка API!',
              text: 'При запросе ATEX CERTS произошла ошибка',
              icon: 'fas fa-code-branch'
            })
            .subscribe();

          return raw;
        }
        if (raw instanceof Array) {
          return new AtekDealerinfoes(raw as Array<AtekDealerinfoSchema>);
        } else {
          return new AtekDealerinfo(raw as AtekDealerinfoSchema);
        }
      })
    );
  }
}
