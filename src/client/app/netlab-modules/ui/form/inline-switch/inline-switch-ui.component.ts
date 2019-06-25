// Angular
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList
} from '@angular/core';

import {
  animate, state, style, transition, trigger
} from '@angular/animations';

// Framework

// Libs
import { isNull, isUndefined } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AbstractControl, FormGroup } from '@angular/forms';

import { of as observableOf } from 'rxjs/observable/of';
import { merge } from 'rxjs/operators';

@Directive({
  selector: '[app-inline-switch-ui-option]'
})
export class InlineSwitchUiOptionDirective implements AfterContentInit {
  @Input() value: number | string;
  @Input() disabled = false;
  @Input() label: string;

  constructor(
    private element: ElementRef
  ) { }

  ngAfterContentInit(): void {
    this.label = this.label || this.element.nativeElement.innerText;
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-inline-switch-ui',
  styleUrls: ['./inline-switch-ui.component.scss'],
  templateUrl: './inline-switch-ui.component.html',
  animations: [
    trigger('openCloseOptions', [
      state('false', style({
        height: 0
      })),
      state('true', style({
        height: '*'
      })),
      transition('false => true', [
        style({
          height: 0
        }),
        animate('500ms cubic-bezier(.47,.11,.3,1.3)',
          style({
            height: '*'
          }))
      ]),
      transition('true => false', [
        style({
          height: '*'
        }),
        animate('400ms cubic-bezier(.63,-0.36,.4,.82)',
          style({
            height: 0
          }))
      ])
    ])
  ]
})
export class InlineSwitchUiComponent implements AfterContentInit, OnDestroy, OnInit {
  control: AbstractControl;
  controlSubscription: Subscription = new Subscription();
  contentChildrenSubscription: Subscription;

  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() disabled = false;
  @Input() deClickable = false;

  @ContentChildren(InlineSwitchUiOptionDirective) optionElements: QueryList<InlineSwitchUiOptionDirective>;

  options: Array<InlineSwitchUiOptionDirective>;

  private value: string | number;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.form) {
      this.control = this.form.controls[this.controlName];
    }
  }

  ngAfterContentInit(): void {
    if (this.control) {
      this.controlSubscription = observableOf(this.control.value)
          .pipe(
            merge(this.control.valueChanges)
          )
          .subscribe(val => this.checkControlValue(val));
    }

    this.options = this.optionElements.toArray();
    this.contentChildrenSubscription = this.optionElements.changes.subscribe(e => {
      this.options = e.toArray();
      if (
        this.options.length === 0 ||
          this.currentValueNotInOptions()
      ) {
        this.control.reset(undefined);
        this.control.markAsPristine();
        this.cd.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.controlSubscription.unsubscribe();
    this.contentChildrenSubscription.unsubscribe();
  }

  currentValueNotInOptions(): boolean {
    if (isUndefined(this.control.value) || isNull(this.control.value)) {
      return false;
    }

    let founded;
    for (const item of this.options) {
      founded = item.value === this.control.value;
      if (founded) {
        break;
      }
    }

    return !founded;
  }

  selectOption(option: InlineSwitchUiOptionDirective): void {
    if (option.disabled) {
      return void(0);
    }
    const value = option.value;

    if (value === this.control.value) {
      if (this.deClickable) {
        this.control.reset(undefined);
        this.control.markAsPristine();
      }
    } else {
      this.control.setValue(value);
      this.control.markAsDirty();
    }
  }

  isSelected(option: InlineSwitchUiOptionDirective): boolean {
    return this.value === option.value;
  }

  optionClass(option: InlineSwitchUiOptionDirective): any {
    return {
      selected: this.isSelected(option),
      disabled: option.disabled
    };
  }

  private checkControlValue(value: any): void {
    this.value = value;
    this.cd.markForCheck();
  }
}
