// angular
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { MetaService } from '@ngx-meta/core';
import { NguCarousel } from '@ngu/carousel';

import { WorkDirection, WorkdirectionsService } from '../../../models/workdirections.service';
import { Projects, ProjectsService } from '../../../models/projects.service';
import { ApiError } from '../../../netlab-framework/api/src/api.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { filter, share, switchMap, tap } from 'rxjs/operators';

@Component({
  templateUrl: './activity.component.html',
  styleUrls: ['activity.component.scss']
})
export class ActivityComponent implements OnDestroy, OnInit {
  showTree = false;
  activity$: Observable<WorkDirection | any> = this.route.params.pipe(
    switchMap((e: { activitySlug: string }) => {
      if (typeof e.activitySlug !== 'undefined') {
        return this.workdirections
          .show(e.activitySlug)
          .pipe(
            tap((wd: WorkDirection) => this.setMetaTags(wd)),
            tap((wd: WorkDirection) => this.loadProjects(wd))
          );
      } else {
        return empty();
      }
    }),
    share()
  );

  projects$: Observable<Projects>;

  carousel: NguCarousel = {
    grid: {xs: 1, sm: 1, md: 2, lg: 3, all: 0},
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

  private readonly subscriptions: Subscription = Subscription.EMPTY;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly route: ActivatedRoute,
    private readonly workdirections: WorkdirectionsService,
    private readonly projects: ProjectsService,
    private readonly meta: MetaService
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(
        (e: { activitySlug: string }) => {
          this.showTree = typeof e.activitySlug === 'undefined';
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  carouselLoad(event: Event): void {
    // carouselLoad will trigger this funnction when your load value reaches
    // it is helps to load the data by parts to increase the performance of the app
    // must use feature to all carousel
  }

  private loadProjects(wd: WorkDirection): void {
    this.elementRef.nativeElement.parentElement.scrollTop = 0;

    this.projects$ = this.projects.index(
        new HttpParams()
          .set('PROPERTY_WORK_DIRECTION.ID', wd.id.toString())
          .set('properties', 'aes')
      )
      .pipe(
        filter(e => !(e instanceof ApiError))
      ) as Observable<Projects>;
  }

  private setMetaTags(wd: WorkDirection): void {
    if (wd && wd.name) {
      this.meta.setTitle(wd.name);
    }
  }
}
