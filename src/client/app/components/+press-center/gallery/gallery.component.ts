// angular
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WorkdirectionsService } from '../../../models/workdirections.service';
import { AesService } from '../../../models/aes.service';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { NewsComponent } from '../news/news.component';
import { Observable } from 'rxjs/Observable';
import { ApiError } from '../../../netlab-framework/api/src/api.service';
import { GalleryService, Records } from '../../../models/gallery.service';

@Component({
  templateUrl: './gallery.component.html',
  styleUrls: ['gallery.component.scss']
})
export class GalleryComponent  implements OnDestroy {
  static PER_PAGE = '12';

  defaultParams = new HttpParams()
    .set('page', '1')
    .set('per', GalleryComponent.PER_PAGE);

  params: BehaviorSubject<HttpParams> = new BehaviorSubject(this.defaultParams);

  news$: Observable<Records | ApiError> = this.params
    .pipe(
      switchMap(params => {
        return this.news.indexSections(params)
          .pipe(
            filter(e => !(e instanceof ApiError)),
            tap(() => this.elementRef.nativeElement.parentElement.scrollTop = 0)
          );
      })
    );

  private subscriptions: Subscription = new Subscription();

  constructor(
    readonly elementRef: ElementRef,
    readonly news: GalleryService,
    readonly aes: AesService,
    readonly workDirections: WorkdirectionsService,
    readonly fb: FormBuilder
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
}
