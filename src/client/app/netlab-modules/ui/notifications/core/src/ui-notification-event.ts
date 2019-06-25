import { UiNotification } from './ui-notification';

export class UiNotificationEvent {
  // requested, created, opened, resolved

  constructor(
    public notification: UiNotification,
    public event: string
  ) { }
}

export class UiNotificationMessageEvent extends UiNotificationEvent {
  constructor(
    public message: any,
    public notification: UiNotification,
    public event: string
  ) {
    super(notification, event);
  }
}
