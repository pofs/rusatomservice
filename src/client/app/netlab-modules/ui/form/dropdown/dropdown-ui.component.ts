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
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

// Framework

// Libs
import { indexOf, isArray, isNull, isUndefined, without } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AbstractControl, FormGroup } from '@angular/forms';

import { of as observableOf } from 'rxjs/observable/of';
import { merge } from 'rxjs/operators';
/* tslint:disable */
@Directive({
  selector: 'app-dropdown-ui-option'
})
/* tslint:enable */
export class DropdownUiOptionDirective implements AfterContentInit {
  @Input() value: number | string;
  @Input() disabled = false;
  @Input() label: string;
  @Input() default = false;

  constructor(
    private element: ElementRef
  ) { }

  ngAfterContentInit(): void {
    this.label = this.label || this.element.nativeElement.innerText;
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dropdown-ui',
  styleUrls: ['./dropdown-ui.component.scss'],
  templateUrl: './dropdown-ui.component.html',
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
export class DropdownUiComponent implements AfterContentInit, OnDestroy, OnInit {
  control: AbstractControl;
  controlSubscription: Subscription = new Subscription();
  contentChildrenSubscription: Subscription;

  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() disabled = false;

  @Input() multiple = false;
  @Input() label = '';
  @Input() default: any;

  @ContentChildren(DropdownUiOptionDirective) optionElements: QueryList<DropdownUiOptionDirective>;

  options: Array<DropdownUiOptionDirective>;

  opened = false;
  private value: Array<string | number> | string | number;

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
    this.checkDefaultValue();
    this.contentChildrenSubscription = this.optionElements.changes.subscribe(e => {
      this.options = e.toArray();
      if (
        this.options.length === 0 ||
          this.currentValueNotInOptions()
      ) {
        this.control.reset(undefined);
        this.control.markAsPristine();
        this.cd.markForCheck();
      } else {
        this.checkDefaultValue();
      }
    });
  }

  ngOnDestroy(): void {
    this.controlSubscription.unsubscribe();
    this.contentChildrenSubscription.unsubscribe();
  }

  checkDefaultValue(): void {
    if (typeof this.default !== 'undefined') {
      for (const item of this.options) {
        if (item.value === this.default) {
          this.control.reset(item.value);
          this.control.markAsPristine();
          this.cd.markForCheck();
          break;
        }
      }
    } else {
      for (const item of this.options) {
        if (item.default !== false) {
          this.control.reset(item.value);
          this.control.markAsPristine();
          this.cd.markForCheck();
          break;
        }
      }
    }
  }

  isDisabled(): boolean {
    if (this.form) {
      return this.disabled || this.control.disabled;
    } else {
      return false;
    }
  }

  /*
   * TODO: расширить метод currentValueNotInOptions для компонента с режимом multiple
   */
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

  get labelText(): string {
    if (this.options.length > 0 &&
      this.control &&
      !isNull(this.control.value)) {
      if (this.multiple) {
        return (this.value as Array<string | number>).join(', ');
      } else {
        const value = this.optionElements.filter(option => option.value === this.value);
        if (value.length > 0) {
          return this.optionElements.filter(option => option.value === this.value)[0].label;
        } else {
          return this.label;
        }
      }
    } else {
      return this.label;
    }
  }

  openDropdown(): void {
    if (this.isDisabled()) {
      return void 0;
    }
    this.opened = true;
    if (this.control) {
      this.control.markAsTouched();
    }
  }

  closeDropdown(): void {
    this.opened = false;
  }

  toggleDropdown(): void {
    if (this.isDisabled()) {
      return void 0;
    }
    this.opened = !this.opened;
  }

  selectOption(option: DropdownUiOptionDirective): void {
    if (option.disabled) {
      return void(0);
    }
    let value;
    if (this.multiple) {
      if (isArray(this.control.value)) {
        value = (indexOf(this.control.value, option.value) >= 0) ?
            ((this.control.value.length === 1) ? undefined : without(this.control.value, option.value)) :
            [...this.control.value, option.value];
      } else {
        value = (isUndefined(this.control.value) || isNull(this.control.value)) ?
            [option.value] :
            [this.control.value, option.value];
      }
    } else {
      value = option.value;
      this.closeDropdown();
    }
    this.control.setValue(value);
    this.control.markAsDirty();
  }

  isSelected(option: DropdownUiOptionDirective): boolean {
    if (this.multiple) {
      return indexOf(this.value as Array<string | number>, option.value) >= 0;
    } else {
      return this.value === option.value;
    }
  }

  optionClass(option: DropdownUiOptionDirective): any {
    return {
      selected: this.isSelected(option),
      disabled: option.disabled
    };
  }

  private checkControlValue(value: any): void {
    if (this.multiple) {
      this.value = (!isArray(value)) ?
          ((isUndefined(value) || isNull(value)) ? [] : [value]) :
          value as Array<string | number>;
    } else {
      this.value = value;
    }
    this.cd.markForCheck();
  }
}
