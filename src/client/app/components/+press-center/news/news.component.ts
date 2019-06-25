// angular
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WorkDirections, WorkdirectionsService } from '../../../models/workdirections.service';
import { AesService, Records } from '../../../models/aes.service';
import { ApiError } from '../../../netlab-framework/api/src/api.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http';
import { News, NewsService } from '../../../models/news.service';

@Component({
  templateUrl: './news.component.html',
  styleUrls: ['news.component.scss']
})
export class NewsComponent implements OnDestroy, OnInit {
  static PER_PAGE = '12';

  filter = this.fb.group({
    location: undefined,
    aes: undefined,
    workDirection: undefined
  });

  defaultParams = new HttpParams()
    .set('properties', 'IN_SLIDER,AES,WORK_DIRECTION')
    .set('page', '1')
    .set('per', NewsComponent.PER_PAGE);

  params: BehaviorSubject<HttpParams> = new BehaviorSubject(this.defaultParams);

  news$: Observable<News | ApiError> = this.params
    .pipe(
      switchMap(params => {
        return this.news.index(params)
          .pipe(
            filter(e => !(e instanceof ApiError)),
            tap(() => this.elementRef.nativeElement.parentElement.scrollTop = 0)
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
    readonly elementRef: ElementRef,
    readonly news: NewsService,
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
