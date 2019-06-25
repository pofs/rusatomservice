// angular
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { filter, map, share, switchMap, tap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WorkdirectionsService } from '../../../models/workdirections.service';
import { AesService } from '../../../models/aes.service';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ApiError } from '../../../netlab-framework/api/src/api.service';
import { GalleryService, Record, Records } from '../../../models/gallery.service';
import { Lightbox } from 'angular2-lightbox';
import { ConfigService } from '@ngx-config/core';
import { MetaService } from '@ngx-meta/core';
import { NewsRecord } from '../../../models/news.service';
import { empty } from 'rxjs/observable/empty';
import { ActivatedRoute } from '@angular/router';
import { filter as f } from 'lodash';

@Component({
  templateUrl: './gallery-item.component.html'
})
export class GalleryItemComponent  implements OnDestroy {
  defaultParams = new HttpParams()
    .set('properties', 'IN_SLIDER,AES,WORK_DIRECTION')
    .set('page', '1');

  params: BehaviorSubject<HttpParams> = new BehaviorSubject(this.defaultParams);

  element$: Observable<Record | any> = this.route.params.pipe(
    switchMap((e: { id: string }) => {
      if (typeof e.id !== 'undefined') {
        return this.news.indexSections()
          .pipe(
            filter(r => !(r instanceof ApiError)),
            map(r => f(r as Records, record => +record.id === +e.id)[0]),
            tap(r => this.setMetaTags(r))
          );
      } else {
        return empty();
      }
    }),
    share()
  );

  news$: Observable<Records | any> = this.route.params.pipe(
    switchMap((e: { id: string }) => {
      if (typeof e.id !== 'undefined') {
        const params = new HttpParams()
          .set('properties', 'VIDEO')
          .set('SECTION_ID', e.id);

        return this.news
          .index(params)
          .pipe(
            tap(() => this.elementRef.nativeElement.parentElement.scrollTop = 0)
          );
      } else {
        return empty();
      }
    }),
    share()
  );

  readonly backendHost = this.config.getSettings('system.backendHost');

  private subscriptions: Subscription = new Subscription();

  constructor(
    readonly elementRef: ElementRef,
    readonly news: GalleryService,
    readonly aes: AesService,
    readonly workDirections: WorkdirectionsService,
    readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly meta: MetaService,
    private readonly config: ConfigService,
    private readonly lightbox: Lightbox
  ) { }

  ngOnDestroy(): void {
    this.params.complete();
    this.subscriptions.unsubscribe();
  }

  paginate($ev: number): void {
    const params = this.defaultParams
      .set('page', $ev.toString());

    this.params.next(params);
  }
  box(photo: any): void {
    this.lightbox.open([{
      src: this.backendHost + photo,
      thumb: this.backendHost + photo
    }]);
  }

  private setMetaTags(wd: NewsRecord): void {
    if (wd && wd.name) {
      this.meta.setTitle(wd.name);
    }
  }
}
