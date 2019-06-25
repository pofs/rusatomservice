export class UiNotificationOptions {
  static types = ['success', 'error', 'alert', 'info', 'warn', 'neutral'];
  animation?: string;
  title?: string;
  text?: string;
  type?: string;
}

export class ToastOptions extends UiNotificationOptions {
  timeOut?: number;
  showProgressBar?: boolean;
  pauseOnHover?: boolean;
  clickToClose?: boolean;
  icon?: string;
  removeIds?: Array<any>;
}

export class DefaultToastOptions extends ToastOptions {
  timeOut = 2000;
  showProgressBar = true;
  pauseOnHover = true;
  clickToClose = true;
  type = 'success';
  animation = 'fromTop';
}

export class DialogOptions extends UiNotificationOptions {
  clickOverlayToClose?: boolean;
  alert?: boolean;
  acceptButtonText?: string;
  declineButtonText?: string;
  showClose?: boolean;
  title?: string;
  width?: number;
  height?: number;
  content?: string;
  component?: any;
  componentInput?: {[name: string]: any};
}

export class DefaultDialogOptions extends DialogOptions {
  type = 'neutral';
  acceptButtonText = 'Применить';
  declineButtonText = 'Отменить';
  alert = false;
  clickOverlayToClose = true;
  showClose = true;
  componentInput = {};
  width = 500;
}
