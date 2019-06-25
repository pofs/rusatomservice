// Angular
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit
} from '@angular/core';

import {
  DialogUiNotification, ToastUiNotification, UiNotification, UiNotificationsService
} from '../core';

// Libs
import { filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { merge as ObservableMerge } from 'rxjs/observable/merge';
import { pull } from 'lodash';

import { dialogAnimations } from './dialog.animations';
import { overlayAnimations } from './overlay.animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ui-notifications',
  animations: [ dialogAnimations, overlayAnimations ],
  templateUrl: './ui-notifications.component.html'
})
export class UiNotificationsComponent implements OnInit {

  toasts$: Observable<Array<ToastUiNotification>>;
  dialogs$: Observable<Array<UiNotification>>;

  overlayVisible = false;

  private toastsList: Array<ToastUiNotification> = [];
  private dialogsList: Array<UiNotification> = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private notifications: UiNotificationsService
  ) { }

  ngOnInit(): void {
    this.subscribeToToasts();
    this.subscribeToDialogs();
  }

  ngOnDestroy(): void {

  }

  getIndexOf(item: any): number {
    if (item instanceof DialogUiNotification) {
      return this.dialogsList.lastIndexOf(item);
    } else {
      return this.toastsList.lastIndexOf(item);
    }
  }

  isOnTop(item: any): boolean {
    if (item instanceof DialogUiNotification) {
      const topEl = this.dialogsList[this.dialogsList.length - 1];

      return (typeof topEl === 'undefined') || topEl.uniqId === item.uniqId;
    } else {
      const topEl = this.toastsList[this.toastsList.length - 1];

      return (typeof topEl === 'undefined') || topEl.uniqId === item.uniqId;
    }
  }

  closeDialog(dialog: any): void {}

  private subscribeToToasts(): void {
    this.toasts$ = ObservableMerge(
      this.notifications
        .events
        .pipe(
          filter(ev => {
            return ev.event === 'requested' && ev.notification instanceof ToastUiNotification;
          }),
          map(ev => {
            this.toastsList.push(ev.notification);

            return this.toastsList;
          })
        ),
      this.notifications
        .events
        .pipe(
          filter(ev => {
            return ev.event === 'resolved' && ev.notification instanceof ToastUiNotification;
          }),
          map(ev => {
            pull(this.toastsList, ev.notification);

            return this.toastsList;
          })
        )
    )
      .pipe(
      tap(() => this.cdr.detectChanges())
    );
  }

  private subscribeToDialogs(): void {
    this.dialogs$ = ObservableMerge(
      this.notifications
        .events
        .pipe(
          filter(ev => {
            return ev.event === 'requested' && ev.notification instanceof DialogUiNotification;
          }),
          map(ev => {
            this.dialogsList.push(ev.notification);

            return this.dialogsList;
          })
        ),
      this.notifications
        .events
        .pipe(
          filter(ev => {
            return ev.event === 'resolved' && ev.notification instanceof DialogUiNotification;
          }),
          map(ev => {
            pull(this.dialogsList, ev.notification);

            return this.dialogsList;
          })
        )
    )
      .pipe(
      tap(() => {
        this.overlayVisible = this.dialogsList.length > 0;
        this.cdr.detectChanges();
      })
    );
  }
}
