// angular
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of as ObservableOf } from 'rxjs/observable/of';
import { merge as ObservableMerge } from 'rxjs/observable/merge';

import { UiNotificationEvent } from './ui-notification-event';
import { DefaultDialogOptions, DefaultToastOptions, DialogOptions, ToastOptions } from './ui-notification-options';
import { DialogResolvedStatus, DialogUiNotification, ToastUiNotification } from './ui-notification';

import { filter, ignoreElements, map, mapTo, tap } from 'rxjs/operators';

@Injectable()
export class UiNotificationsService {
  events = new Subject<UiNotificationEvent>();

  toast(opts: ToastOptions): Observable<UiNotificationEvent> {
    const options = {...new DefaultToastOptions(), ...opts};
    const toast = new ToastUiNotification(options);

    return ObservableMerge(
        ObservableOf(new UiNotificationEvent(toast, 'requested')),
        toast.resolved.pipe(
          filter(resolved => resolved),
          mapTo(new UiNotificationEvent(toast, 'resolved'))
        )
      )
      .pipe(
        tap(ev => {
          this.events.next(ev);
        })
      );
  }

  dialog(opts: DialogOptions): Observable<UiNotificationEvent> {
    const options = {...new DefaultDialogOptions(), ...opts};
    const dialog = new DialogUiNotification(options);

    return ObservableMerge(
      ObservableOf(new UiNotificationEvent(dialog, 'requested')),
      dialog.resolved.pipe(
        filter(dialogResolved => dialogResolved.status !== DialogResolvedStatus.INITIAL),
        map(dialogResolved => {
          return new UiNotificationEvent(dialog, dialogResolved.isResolved ? 'resolved' : 'message');
        })
      ),
      dialog.resolved.pipe(
        filter(dialogResolved => dialogResolved.isResolved),
        tap(() => dialog.resolved.complete()),
        ignoreElements()
      )
      )
      .pipe(
        tap((ev: UiNotificationEvent) => {
          this.events.next(ev);
        })
      );
  }
}
