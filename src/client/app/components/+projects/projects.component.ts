// angular
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy, OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { Project, Projects, ProjectsService } from '../../models/projects.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpParams } from '@angular/common/http';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiError } from '../../netlab-framework/api/src/api.service';
import { AesService, Records } from '../../models/aes.service';
import { WorkDirections, WorkdirectionsService } from '../../models/workdirections.service';
import { FormBuilder } from '@angular/forms';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
  styleUrls: ['projects.component.scss']
})
export class ProjectsComponent implements OnDestroy, OnInit {
  static PER_PAGE = '16';
  @ViewChild('scrollBar') scrollBar: ElementRef;

  filter = this.fb.group({
    location: undefined,
    aes: undefined,
    workDirection: undefined
  });

  defaultParams = new HttpParams()
    .set('properties', 'homepagePhoto,aes')
    .set('page', '1')
    .set('per', ProjectsComponent.PER_PAGE);

  params: BehaviorSubject<HttpParams> = new BehaviorSubject(this.defaultParams);

  projects$: Observable<Projects | ApiError> = this.params
    .pipe(
      switchMap(params => {
        return this.projects.index(params)
          .pipe(
            filter(e => !(e instanceof ApiError)),
            tap(() => this.scrollBar.nativeElement.scrollTop = 0)
          );
      })
    );

  aes$: Observable<Records | ApiError> = this.aes
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    );

  workDirections$: Observable<WorkDirections | ApiError> = this.workDirections
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    );

  private subscriptions: Subscription = new Subscription();

  constructor(
    readonly projects: ProjectsService,
    readonly aes: AesService,
    readonly workDirections: WorkdirectionsService,
    readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.filter.valueChanges
        .pipe(
          map(v => this.processFilterValue(v))
        )
        .subscribe(v => this.params.next(v))
    );
  }

  ngOnDestroy(): void {
    this.params.complete();
    this.subscriptions.unsubscribe();
  }

  paginate($ev: number): void {
    const params = this.processFilterValue(this.filter.value)
      .set('page', $ev.toString());

    this.params.next(params);
  }

  private processFilterValue(v: {location: any, workDirection: any, aes: any}): HttpParams {
    let params = this.defaultParams;

    if (v.location) {
      params = params.set('PROPERTY_AES.NAME', `%${v.location.toString()}%`);
    }

    if (v.aes) {
      params = params.set('PROPERTY_AES', v.aes.toString());
    }

    if (v.workDirection) {
      params = params.set('PROPERTY_WORK_DIRECTION', v.workDirection.toString());
    }

    return params;
  }
}
