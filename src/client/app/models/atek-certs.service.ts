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

export class AtekCertificateSchema extends ModelSchema {
  id: number;
}

export class AtekCertificate extends AtekCertificateSchema {
  constructor(data: AtekCertificateSchema) {
    super();
    merge(this, data);
  }
}

export class AtekCertificates extends Array<AtekCertificate> {
  constructor(workdirections: Array<AtekCertificateSchema> = []) {
    super();

    workdirections.forEach(workdirection => {
      this.push(new AtekCertificate(workdirection));
    });

    Object.setPrototypeOf(this, Object.create(AtekCertificates.prototype));
  }
}

@Injectable()
export class AtekCertificatesService {
  private currentLanguage$: Observable<Language>;
  private resource: Resource<AtekCertificateSchema> = this.api.build('atekcerts');

  constructor(
    private api: ApiClientService,
    private notifications: UiNotificationsService,
    private readonly store: Store<Language>
  ) {
    this.currentLanguage$ = this.store
      .pipe(select(getWorkingLanguage));
  }

  index(): Observable<ApiError | AtekCertificates> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        let params: HttpParams = new HttpParams();
        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }

        return this.processResponse(this.resource.index(params));
      })
    );
  }

  private processResponse(obs: Observable<Array<AtekCertificateSchema> | ApiError>): Observable<ApiError | AtekCertificates>;
  private processResponse(obs: Observable<AtekCertificateSchema | ApiError>): Observable<ApiError | AtekCertificate>;
  private processResponse(
    obs: Observable<AtekCertificateSchema | Array<AtekCertificateSchema> | ApiError>
  ): Observable<ApiError | AtekCertificates | AtekCertificate> {
    return obs.pipe(
      map((raw: ApiError | AtekCertificates | AtekCertificate) => {
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
          return new AtekCertificates(raw as Array<AtekCertificateSchema>);
        } else {
          return new AtekCertificate(raw as AtekCertificateSchema);
        }
      })
    );
  }
}
