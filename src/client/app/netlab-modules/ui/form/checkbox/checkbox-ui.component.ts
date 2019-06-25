// Angular
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

// Framework

// Libs
import { indexOf, isArray, isNull, isUndefined, without } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AbstractControl, FormGroup } from '@angular/forms';

import { of as observableOf } from 'rxjs/observable/of';
import { merge } from 'rxjs/operators';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkbox-ui',
  styleUrls: [ './checkbox-ui.component.scss' ],
  templateUrl: './checkbox-ui.component.html'
})
export class CheckboxUiComponent implements OnDestroy, OnInit {
  control: AbstractControl;
  controlSubscription: Subscription;

  checked = false;

  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() disabled = false;
  @Input() value: string | number | boolean = true;
  @Input() icon: string;
  @Input() iconTemplate: SafeHtml;
  @Input() template = 'checkbox-default';

  @Input('type')
  set type(data: string) {
    if (data && data !== 'checkbox') {
      this.classType = data;
      if (data === 'radio') {
        this.inputType = data;
      }
    }
  }

  private inputType = 'checkbox';
  private classType = 'checkbox';

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (
      this.form &&
      this.controlName &&
      this.form.controls[this.controlName]
    ) {
      this.control = this.form.controls[this.controlName];
      this.controlSubscription = observableOf(this.control.value)
          .pipe(
              merge(this.control.valueChanges)
          )
          .subscribe(val => this.checkControlValue(val));
    }
  }

  ngOnDestroy(): void {
    if (
      this.controlSubscription
    ) {
      this.controlSubscription.unsubscribe();
    }
  }

  onClick(ev: any): void {
    this.setControlValue();
  }

  focusIn(ev: any): void {
    this.control.markAsTouched();
  }

  keypress(ev: any): void {
    if (ev.code === 'Space') {
      this.setControlValue();
    }
  }

  get classList(): {[key: string]: boolean} {
    let classList;

    if (this.form) {
      classList = {
        valid: this.form.controls[this.controlName].valid,
        pristine: this.form.controls[this.controlName].pristine,
        disabled: this.form.controls[this.controlName].disabled || this.disabled,
        touched: this.form.controls[this.controlName].touched,
        dirty: this.form.controls[this.controlName].dirty,
        checked: this.checked
      };

      classList[this.classType] = true;
      classList[this.template] = true;
    } else {
      classList = {};
      classList[this.classType] = true;
      classList[this.template] = true;
    }

    return classList;
  }

  private setControlValue(): void {
    if (
      !this.form.controls[this.controlName].disabled &&
      !this.disabled
    ) {
      if (this.inputType === 'radio') {
        this.control.setValue(this.value);
        this.control.markAsDirty();
      } else {
        if (this.value === true) {
          if (this.control.value === true) {
            this.control.setValue(!this.control.value);
          } else {
            this.control.setValue(this.value);
          }
        } else {
          if (isUndefined(this.control.value) || isNull(this.control.value) || !isArray(this.control.value)) {
            this.control.setValue([this.value]);
          } else {
            if (indexOf(this.control.value, this.value) >= 0) {
              if (this.control.value.length === 1) {
                this.control.setValue(undefined);
              } else {
                this.control.setValue(
                  without(this.control.value, this.value)
                );
              }
            } else {
              this.control.setValue(
                [...this.control.value, this.value]
              );
            }
          }
        }
      }
    }
  }

  private checkControlValue(value: any): void {
    this.checked = (this.inputType === 'radio' || this.value === true) ?
        value === this.value :
        (indexOf(value, this.value) >= 0);

    this.cd.markForCheck();
  }
}
