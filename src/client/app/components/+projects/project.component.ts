// angular
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { Project, Projects, ProjectsService } from '../../models/projects.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ApiError } from '../../netlab-framework/api/src/api.service';
import { MetaService } from '@ngx-meta/core';
import { ActivatedRoute } from '@angular/router';
import { empty } from 'rxjs/observable/empty';
import { HttpParams } from '@angular/common/http';
import { AesService, Record } from '../../models/aes.service';
import { ConfigService } from '@ngx-config/core';
import { Lightbox } from 'angular2-lightbox';
import { NguCarousel } from '@ngu/carousel';
import { Records, TeamService } from '../../models/team.service';
import { StepsService } from '../../models/steps.service';
import { WorkVolumeService } from '../../models/work-volume.service';
import { ResultService } from '../../models/result.service';
import { of } from 'rxjs/observable/of';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project.component.html',
  styleUrls: ['project.component.scss']
})
export class ProjectComponent implements OnDestroy {
  @ViewChild('scrollBar') scrollBar: ElementRef;
  properties = ['aes',
    'start',
    'finish',
    'ADVANCE_TPL',
    'STAGES',
    'DESCRIPTION',
    'RESULTS_TEXT',
    'TARGET',
    'ProjectSlider',
    'PROJECTS_LIKE',
    'RESPONSIBLE',
    'REVIEW',
    'REVIEW_NAME',
    'REVIEW_POSITION',
    'REVIEW_IMAGE'];

  project$: Observable<Project | any> = this.route.params.pipe(
    switchMap((e: { id: string }) => {
      if (typeof e.id !== 'undefined') {
        const props = new HttpParams()
          .set('properties', this.properties.join(','));

        return this.projects
          .show(+e.id, props)
          .pipe(
            tap((p: Project) => this.setMetaTags(p)),
            tap(() => this.scrollBar.nativeElement.scrollTop = 0)
          );
      } else {
        return empty();
      }
    }),
    shareReplay()
  );

  aes$: Observable<Record | ApiError> = this.project$
    .pipe(
      switchMap(project => {
        return this.aes.show(project.props.aes.id, new HttpParams().set('properties', 'location'))
          .pipe(
            filter(e => !(e instanceof ApiError))
          );
      })
    );

  team$: Observable<Records | ApiError> = this.project$
    .pipe(
      switchMap(project => {
        if (project.props.responsible && project.props.responsible.length > 0) {
          const ids = project.props.responsible.map((r: Record) => r.id);
          const params = new HttpParams()
            .set('ID', ids.join(','));

          return this.team.index(params)
            .pipe(
              filter(e => !(e instanceof ApiError))
            );
        } else {
          return empty();
        }
      })
    );

  projectsLike$: Observable<Projects | ApiError> = this.project$
    .pipe(
      switchMap(project => {
        if (project.props.projectsLike && project.props.projectsLike.length > 0) {
          const ids = project.props.projectsLike.map((p: Project) => p.id);
          const params = new HttpParams()
            .set('ID', ids.join(','))
            .set('properties', 'aes');

          return this.projects.index(params)
            .pipe(
              filter(e => !(e instanceof ApiError))
            );
        } else {
          return empty();
        }
      })
    );

  steps$: Observable<Records | ApiError> = this.project$
    .pipe(
      switchMap(project => {
        if (project.props.stages) {
          const params = new HttpParams()
            .set('SECTION_ID', project.props.stages)
            .set('properties', 'PARTNERS,NORM_TIME,CONTR_TIME,TEAM,WORK,COMMENTS,RESULTS');

          return this.steps.index(params)
            .pipe(
              filter(e => !(e instanceof ApiError))
            );
        } else {
          return empty();
        }
      })
    );

  stepsWork: Array<Records> = [];
  stepsResults: Array<Records> = [];

  galleryCarousel: NguCarousel = {
    grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
    slide: 1,
    speed: 330,
    interval: 4000,
    point: {
      visible: false
    },
    load: 3,
    touch: true,
    loop: true,
    easing: 'ease',
    custom: 'banner'
  };

  teamCarousel: NguCarousel = {
    grid: {xs: 1, sm: 2, md: 3, lg: 4, all: 0},
    slide: 1,
    speed: 330,
    interval: 4000,
    point: {
      visible: false
    },
    load: 3,
    touch: true,
    loop: true,
    easing: 'ease',
    custom: 'banner'
  };

  similarCarousel: NguCarousel = {
    grid: {xs: 1, sm: 1, md: 2, lg: 2, all: 0},
    slide: 1,
    speed: 330,
    interval: 4000,
    point: {
      visible: false
    },
    load: 3,
    touch: true,
    loop: true,
    easing: 'ease',
    custom: 'banner'
  };

  readonly backendHost = this.config.getSettings('system.backendHost');

  private subscriptions: Subscription = new Subscription();

  constructor(
    readonly projects: ProjectsService,
    readonly aes: AesService,
    private readonly meta: MetaService,
    private readonly elementRef: ElementRef,
    private readonly route: ActivatedRoute,
    private readonly lightbox: Lightbox,
    private readonly config: ConfigService,
    private readonly team: TeamService,
    private readonly steps: StepsService,
    private readonly work: WorkVolumeService,
    private readonly results: ResultService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  box(photo: any): void {
    this.lightbox.open([{
      src: this.backendHost + photo.src,
      thumb: this.backendHost + photo.src
    }]);
  }

  stepsWork$(step: Record, index = 0): Observable<Records | ApiError> {
    const params = new HttpParams()
      .set('SECTION_ID', step.props.work)
      .set('properties', '');
    if (this.stepsWork[index]) {
      return of(this.stepsWork[index]);
    } else {
      return this.work.index(params)
        .pipe(
          filter(e => !(e instanceof ApiError)),
          tap((e: Records) => this.stepsWork[index] = e)
        );
    }
  }

  stepsResults$(step: Record, index = 0): Observable<Records | ApiError> {
    const params = new HttpParams()
      .set('SECTION_ID', step.props.results)
      .set('properties', '');

    if (this.stepsResults[index]) {
      return of(this.stepsResults[index]);
    } else {
      return this.results.index(params)
        .pipe(
          filter(e => !(e instanceof ApiError)),
          tap((e: Records) => this.stepsResults[index] = e)
        );
    }
  }

  private setMetaTags(p: Project): void {
    if (p && p.name) {
      this.meta.setTitle(p.name);
    }
  }
}
