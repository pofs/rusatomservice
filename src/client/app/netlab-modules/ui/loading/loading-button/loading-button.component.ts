// Angular
import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

// Framework
import { LoadingService, LoadingStreamEvent } from '../../../../netlab-framework/api/src/loading.service';

// Libs
import { isUndefined } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-loading-button',
  styleUrls: [ './loading-button.component.scss' ],
  templateUrl: './loading-button.component.html'
})
export class LoadingButtonComponent implements OnDestroy, OnInit {
  @Input() showForResource: string;
  @Input() showForMethod: string;
  @Input() type: string;
  @ViewChild('button') button: ElementRef;

  @HostBinding('class.active') active = false;

  private loadingSubscription: Subscription;

  constructor(
    private loading: LoadingService
  ) {}

  @HostListener('click') onClick(): void {
    if (!this.active) {
      this.button.nativeElement.click();
    }
  }

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

      this.active = (ev.event === 'start') ? true : this.loading.loading;
    }
  }
}
