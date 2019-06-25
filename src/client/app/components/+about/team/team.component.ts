// angular
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ApiError } from '../../../netlab-framework/api/src/api.service';
import { Record, Records, TeamService } from '../../../models/team.service';

import { Observable } from 'rxjs/Observable';
import { filter, switchMap, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './team.component.html',
  styleUrls: ['team.component.scss']
})
export class TeamComponent implements OnDestroy {
  static PER_PAGE = '18';

  title = 'PUBLIC.ABOUT.TEAM.TITLE';
  atex = false;

  defaultParams = new HttpParams()
    .set('INCLUDE_SUBSECTIONS', 'Y')
    .set('page', '1')
    .set('per', TeamComponent.PER_PAGE);

  params: BehaviorSubject<HttpParams> = new BehaviorSubject(
    this.defaultParams.set('per', TeamComponent.PER_PAGE)
  );

  team$: Observable<Records | ApiError> = this.route.data.pipe(
    switchMap((data: {sectionCode: string}) => {
      this.title = (data.sectionCode === 'atex') ? 'PUBLIC.ABOUT.ATEX_TEAM.TITLE' : 'PUBLIC.ABOUT.TEAM.TITLE';
      this.atex = (data.sectionCode === 'atex');

      return this.params
        .pipe(
          switchMap(params => {
            params = params.set('SECTION_CODE', data.sectionCode);

            return this.team.index(params)
              .pipe(
                filter(e => !(e instanceof ApiError)),
                tap(() => this.elementRef.nativeElement.parentElement.scrollTop = 0)
              );
          })
        );
    })
  );

  smallClass = 'col-6 col-lg-4 col-xl-3 item';
  largeClass = 'col-6 col-lg-4 col-xl-6 item big-item';

  position: number;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private readonly elementRef: ElementRef,
    private readonly team: TeamService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.params.complete();
    this.subscriptions.unsubscribe();
  }

  showAll(): void {
    this.position = undefined;
    this.params.next(
      this.defaultParams
    );
  }

  showPosition(positionId: number): void {
    this.position = positionId;
    this.params.next(
      this.defaultParams.set('PROPERTY_POSITION_TYPE', positionId.toString())
    );
  }

  paginate($ev: number): void {
    let params = this.defaultParams
      .set('page', $ev.toString());

    if (this.position) {
      params = params.set('PROPERTY_POSITION_TYPE', this.position.toString());
    }

    this.params.next(params);
  }

  getClassFor(e: Record): string {
    if (+e.props.positionType === 7 || +e.props.positionType === 74) {
      return this.largeClass;
    } else {
      return this.smallClass;
    }
  }
}
