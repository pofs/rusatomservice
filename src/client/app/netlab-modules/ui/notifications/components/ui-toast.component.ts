import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  Input,
  NgZone, OnChanges,
  OnDestroy,
  OnInit
} from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Libs
import { ToastUiNotification } from '../core';
import { toastAnimations } from './toast.animations';

@Component({
  selector: 'ui-toast',
  styleUrls: ['./ui-toast.component.scss'],
  templateUrl: './ui-toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ toastAnimations ]
})
export class UiToastComponent implements OnChanges, OnDestroy, OnInit {
  @Input() toast: ToastUiNotification;
  @Input() index: number;
  @Input() onTop: boolean;

  title: SafeHtml;
  text: SafeHtml;
  state: string;
  icon: string;

  progressWidth = 0;

  elHeight: 0;
  elWidth: 0;

  private perspectiveWrapper: any;

  private stopTime = false;
  private timer: any;
  private steps: number;
  private speed: number;
  private count = 0;
  private start: any;

  private diff: any;
  private destroyed = false;
  private visible = false;

  constructor(
    private element: ElementRef,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.elWidth = this.element.nativeElement.children[0].offsetWidth;
    this.elHeight = this.element.nativeElement.children[0].offsetHeight;
    this.perspectiveWrapper = this.element.nativeElement.children[0].querySelector('.perspective-wrapper');

    this.state = this.toast.options.animation;

    if (this.toast.options.title) {
      this.title = this.getContentOf(this.toast.options.title);
    }

    if (this.toast.options.text) {
      this.text = this.getContentOf(this.toast.options.text);
    }

    if (this.toast.options.icon) {
      this.icon = this.toast.options.icon;
    }

    if (this.toast.options.timeOut !== 0) {
      this.startTimeOut();
    }
  }

  ngOnChanges(changes: {onTop: any}): void {
    const visible = (typeof changes.onTop === 'undefined' || changes.onTop.currentValue);
    if (!this.visible && visible) {
      this.visible = visible;
      this.zone.runOutsideAngular(() => this.timer = setTimeout(this.instance.bind(this), (this.speed - this.diff)));
    }
    this.visible = visible;
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.destroyed = true;
  }

  startTimeOut(): void {
    this.steps = this.toast.options.timeOut / 10;
    this.speed = this.toast.options.timeOut / this.steps;
    this.start = new Date().getTime();
    this.zone.runOutsideAngular(() => this.timer = setTimeout(this.instance.bind(this), this.speed));
  }

  onEnter($event?: any): void {
    if (this.toast.options.pauseOnHover) {
      this.stopTime = true;
    }
  }

  onMouseMove($event: any): void {
    const offsetY = (this.element.nativeElement.children[0].offsetHeight / 2 - $event.offsetY) /
      (this.element.nativeElement.children[0].offsetHeight / 2);
    const offsetX = -(this.element.nativeElement.children[0].offsetWidth / 2 - $event.offsetX) /
      (this.element.nativeElement.children[0].offsetWidth / 2);
    this.perspectiveWrapper.style.transform = `rotateX(${offsetY * 4}deg) rotateY(${offsetX}deg)`;
  }

  onLeave($event?: any): void {
    this.perspectiveWrapper.style.transform = '';
    if (this.toast.options.pauseOnHover) {
      this.stopTime = false;
      this.zone.runOutsideAngular(() => this.timer = setTimeout(this.instance.bind(this), (this.speed - this.diff)));
    }
  }

  onClick($e: any): void {
    this.remove();
  }

  remove(): void {
    if (this.toast.options.animation) {
      this.state = `${this.toast.options.animation}Out`;
      setTimeout(() => {
        this.toast.resolved.next(true);
        this.toast.resolved.complete();
      }, 500);
    } else {
      this.toast.resolved.next(true);
      this.toast.resolved.complete();
    }
  }

  private getContentOf(text: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(text);
  }

  private instance(): void {
    this.diff = (new Date().getTime() - this.start) - (this.count * this.speed);

    if (this.count++ === this.steps) {
      this.remove();
    } else if (!this.stopTime && this.visible) {
      if (this.toast.options.showProgressBar) {
        this.progressWidth += 100 / this.steps;
      }
      this.timer = setTimeout(this.instance.bind(this), (this.speed - this.diff));
    }

    if (!this.destroyed) {
      this.zone.run(() => this.cdr.detectChanges());
    }
  }
}
