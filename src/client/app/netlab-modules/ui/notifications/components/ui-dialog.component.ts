// Angular
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  Input,
  OnDestroy,
  OnInit, ViewChild, ViewContainerRef
} from '@angular/core';

import { DialogResolvedStatus, DialogResolvedValue, DialogUiNotification } from '../core';

// Libs
import { merge } from 'lodash';

@Component({
  selector: 'ui-dialog',
  styleUrls: ['./ui-dialog.component.scss'],
  templateUrl: './ui-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiDialogComponent implements OnDestroy, DoCheck, OnInit {
  @Input() onTop = true;
  @Input() index = 0;
  @Input() dialog: DialogUiNotification;
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  component: any;
  animation: string;

  constructor(
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.initComponent();
    this.animation = this.dialog.options.animation;
  }

  ngOnDestroy(): void {
    this.component && this.component.destroy();
  }

  ngDoCheck(): void {
    this.checkComponent();
  }

  initComponent(): void {
    if (typeof this.dialog.options.component !== 'undefined') {
      this.container.clear();
      this.component = this.container.createComponent(
         this.resolver.resolveComponentFactory(this.dialog.options.component)
      );

      this.component.instance.dialogComponent = this;
      merge(this.component.instance, this.dialog.options.componentInput);
    }
  }

  escape($ev?: any): void {
    if (this.onTop) {
      this.close();
    }
  }

  close(): void {
    this.animation = `${this.animation}Out`;
    this.dialog.resolved.next(new DialogResolvedValue(DialogResolvedStatus.CLOSED));
  }

  accept(data = {}): void {
    this.dialog.resolved.next(new DialogResolvedValue(DialogResolvedStatus.ACCEPTED, data));
  }

  message(data = {}): void {
    this.dialog.resolved.next(new DialogResolvedValue(DialogResolvedStatus.MESSAGE, data));
    this.checkComponent();
  }

  decline() {
    this.dialog.resolved.next(new DialogResolvedValue(DialogResolvedStatus.DECLINED));
  }

  private checkComponent(): void {
    this.component && this.component.changeDetectorRef.detectChanges();
  }
}
