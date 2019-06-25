// Angular
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input, NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';

// Framework
import { LoadingService, LoadingStreamEvent } from '../../../../netlab-framework/api/src/loading.service';

// Libs
import { isUndefined } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loading-bar',
  styleUrls: [ './loading-bar.component.scss' ],
  templateUrl: './loading-bar.component.html'
})
export class LoadingBarComponent implements OnDestroy, OnInit {
  @Input() showForResource: string;
  @Input() showForMethod: string;
  @Input() template = 'simple';
  state = 'inactive';

  private loadingSubscription: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.loading.eventStream.subscribe(ev => this.listenToLoadingEvStream(ev));
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  private listenToLoadingEvStream(ev: LoadingStreamEvent): void {
    if ((new RegExp(this.showForResource)).test(ev.loading.resource)) {
      if (!isUndefined(this.showForMethod) &&
        !(new RegExp(this.showForMethod)).test(ev.loading.method)) {
        return void(0);
      }

      this.state = (ev.event === 'start') ? this.state = 'active' : (
          (!this.loading.loading) ? 'inactive' : 'active'
      );
      this.cd.markForCheck();
    }
  }
}
