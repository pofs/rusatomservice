// Angular
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';

import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

// Framework

// Libs
import { Subscription } from 'rxjs/Subscription';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [ './accordeon-element.component.scss' ],
  templateUrl: './accordeon-element.component.html',
  selector: 'app-accordeon-ui-element',
  animations: [
    trigger('openClose', [
      state('false', style({
        height: 0,
        opacity: .2,
        overflow: 'hidden'
      })),
      state('true', style({
        height: '*',
        opacity: 1,
        overflow: 'visible'
      })),
      transition('false => true', [
        style({
          height: 0,
          opacity: .2,
          overflow: 'hidden'
        }),
        animate('500ms cubic-bezier(.47,.11,.3,1.3)',
          style({
            height: '*',
            opacity: 1,
            overflow: 'visible'
          }))
      ]),
      transition('true => false', [
        style({
          height: '*',
          opacity: 1,
          overflow: 'visible'
        }),
        animate('400ms cubic-bezier(.63,-0.36,.4,.82)',
          style({
            height: 0,
            opacity: .2,
            overflow: 'hidden'
          }))
      ])
    ])
  ]
})
export class AccordeonElementComponent {
  @Input() title: string;
  @Input() state: string;
  @Output() isOpened = new EventEmitter();

  opened = false;

  constructor(private cd: ChangeDetectorRef) { }

  toggle(fireEvent = true): void {
    this.opened = !this.opened;
    if (fireEvent) {
      this.isOpened.emit(this.opened);
    }
    this.cd.markForCheck();
  }

  close(fireEvent = true): void {
    this.opened = false;
    if (fireEvent) {
      this.isOpened.emit(this.opened);
    }
    this.cd.markForCheck();
  }

  open(fireEvent = true): void {
    this.opened = true;
    if (fireEvent) {
      this.isOpened.emit(this.opened);
    }
    this.cd.markForCheck();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-accordeon-ui',
  styleUrls: [ './accordeon.component.scss' ],
  templateUrl: './accordeon.component.html'
})
export class AccordeonComponent implements AfterContentInit, OnDestroy {
  @Input() multiple = false;
  @Output() state = new EventEmitter();

  @ContentChildren(AccordeonElementComponent) accordeonElements: QueryList<AccordeonElementComponent>;
  private subscriptions: Subscription = new Subscription();

  ngAfterContentInit(): void {
    this.accordeonElements.forEach((accordeonElement: AccordeonElementComponent) => {
      this.subscriptions.add(
        accordeonElement.isOpened
            .subscribe((val: boolean) => this.accordeonElementOpenClose(accordeonElement, val))
      );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private accordeonElementOpenClose(element: AccordeonElementComponent, val: boolean): void {
    if (!this.multiple && val) {
      this.state.emit(element.state);
      this.accordeonElements.forEach((accordeonElement: AccordeonElementComponent) => {
        if (accordeonElement !== element) {
          accordeonElement.close(false);
        }
      });
    }
  }
}
