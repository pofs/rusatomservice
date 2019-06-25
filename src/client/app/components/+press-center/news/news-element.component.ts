// angular
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MetaService } from '@ngx-meta/core';
import { NguCarousel } from '@ngu/carousel';
import { Projects, ProjectsService } from '../../../models/projects.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { filter, share, switchMap, tap } from 'rxjs/operators';
import { News, NewsRecord, NewsService } from '../../../models/news.service';
import { Lightbox } from 'angular2-lightbox';
import { ConfigService } from '@ngx-config/core';

@Component({
  templateUrl: './news-element.component.html'
})
export class NewsElementComponent implements OnDestroy, OnInit {
  showTree = false;
  newsElement$: Observable<NewsRecord | any> = this.route.params.pipe(
    switchMap((e: { id: string }) => {
      if (typeof e.id !== 'undefined') {
        return this.news
          .show(+e.id)
          .pipe(
            tap(() => this.elementRef.nativeElement.parentElement.scrollTop = 0),
            tap((wd: NewsRecord) => this.setMetaTags(wd))
          );
      } else {
        return empty();
      }
    }),
    share()
  );

  recentNews$: Observable<News | any> = this.news.recent('4');

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

  readonly backendHost = this.config.getSettings('system.backendHost');

  private readonly subscriptions: Subscription = Subscription.EMPTY;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly route: ActivatedRoute,
    private readonly news: NewsService,
    private readonly projects: ProjectsService,
    private readonly meta: MetaService,
    private readonly config: ConfigService,
    private readonly lightbox: Lightbox
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

  box(photo: any): void {
    this.lightbox.open([{
      src: this.backendHost + photo.src,
      thumb: this.backendHost + photo.src
    }]);
  }

  private setMetaTags(wd: NewsRecord): void {
    if (wd && wd.name) {
      this.meta.setTitle(wd.name);
    }
  }
}
