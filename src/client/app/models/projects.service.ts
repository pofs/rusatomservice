// angular
import { Injectable } from '@angular/core';

// Framework
import { ApiClientService, ApiError, Collection, Resource } from '../netlab-framework/api/src/api.service';
import { ModelSchema } from './models';
import { UiNotificationsService } from '../netlab-modules/ui/notifications';
import { HttpParams } from '@angular/common/http';

// libs
import { Observable } from 'rxjs/Observable';
import { map,  switchMap } from 'rxjs/operators';
import { merge } from 'lodash';
import { select, Store } from '@ngrx/store';
import { getWorkingLanguage, Language } from '../framework/i18n/i18n.module';
import { isUndefined } from 'util';

export class ProjectSchema extends ModelSchema {
  id: number;
}

export class Project extends ProjectSchema {
  constructor(data: ProjectSchema) {
    super();
    merge(this, data);
  }
}

export class Projects extends Collection<Project> {
  constructor(prjcts: Collection<ProjectSchema>) {
    super();

    this.currentPage = prjcts.currentPage;
    this.total = prjcts.total;
    this.perPage = prjcts.perPage;
    this.pageCount = prjcts.pageCount;

    prjcts.forEach(prjct => {
      this.push(new Project(prjct));
    });

    Object.setPrototypeOf(this, Object.create(Projects.prototype));
  }
}

@Injectable()
export class ProjectsService {
  private currentLanguage$: Observable<Language>;
  private resource: Resource<ProjectSchema> = this.api.build('allprojects', false);

  constructor(
    private api: ApiClientService,
    private notifications: UiNotificationsService,
    private readonly store: Store<Language>
  ) {
    this.currentLanguage$ = this.store
      .pipe(select(getWorkingLanguage));
  }

  index(properties: HttpParams = new HttpParams()): Observable<ApiError | Projects> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        let params: HttpParams = properties;
        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }

        return this.processResponse(this.resource.index(params));
      })
    );
  }

  show(id: number, params = new HttpParams()): Observable<ApiError | Project> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }

        return this.processResponse(this.resource.show(id, params));
      })
    );
  }

  recent(): Observable<ApiError | Projects> {
    return this.currentLanguage$.pipe(
      switchMap(lang => {
        let params: HttpParams = new HttpParams();

        if (!isUndefined(lang) && lang.code) {
          params = params.set('lang', lang.code);
        }

        params = params.set('page', '1')
                       .set('per', '3')
                       .set('PROPERTY_homepagePhotoShow_VALUE', 'Yes')
                       .set('properties', 'homepagePhoto,aes');

        return this.processResponse(this.resource.index(params));
      })
    );
  }

  private processResponse(obs: Observable<Array<ProjectSchema> | ApiError>): Observable<ApiError | Projects>;
  private processResponse(obs: Observable<ProjectSchema | ApiError>): Observable<ApiError | Project>;
  private processResponse(
    obs: Observable<ProjectSchema | Array<ProjectSchema> | ApiError>
  ): Observable<ApiError | Projects | Project> {
    return obs.pipe(
      map((raw: ApiError | Projects | Project) => {
        if (raw instanceof ApiError) {
          this.notifications
            .toast({
              type: 'error',
              timeOut: 4000,
              title: 'Ошибка API!',
              text: 'При запросе проектов произошла ошибка',
              icon: 'fas fa-code-branch'
            })
            .subscribe();

          return raw;
        }
        if (raw instanceof Array) {
          return new Projects(raw as Collection<ProjectSchema>);
        } else {
          return new Project(raw as ProjectSchema);
        }
      })
    );
  }
}
