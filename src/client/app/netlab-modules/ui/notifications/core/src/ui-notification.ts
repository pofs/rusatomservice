import { DialogOptions, ToastOptions, UiNotificationOptions } from './ui-notification-options';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { uniqueId } from 'lodash';

export abstract class UiNotification {
  abstract resolved: BehaviorSubject<any>;
  requestedAt: Date = new Date();
  uniqId = uniqueId();

  constructor(
    public options: UiNotificationOptions
  ) { }
}

export class ToastUiNotification extends UiNotification {
  resolved: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public options: ToastOptions
  ) {
    super(options);
  }
}

export class DialogResolvedStatus {
  static INITIAL = 'INITIAL';
  static ACCEPTED = 'ACCEPTED';
  static DECLINED = 'DECLINED';
  static CLOSED   = 'CLOSED';
  static MESSAGE  = 'MESSAGE';

  static resolvedStatuses = ['ACCEPTED', 'DECLINED', 'CLOSED'];
}

export class DialogResolvedValue {
  constructor(
    public status: string = DialogResolvedStatus.INITIAL,
    public value?: any
  ) { }

  get isResolved(): boolean {
    return DialogResolvedStatus.resolvedStatuses.indexOf(this.status) >= 0;
  }
}

export class DialogUiNotification extends UiNotification {
  resolved: BehaviorSubject<DialogResolvedValue> = new BehaviorSubject(new DialogResolvedValue());

  constructor(
    public options: DialogOptions
  ) {
    super(options);
  }
}
