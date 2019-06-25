import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Libs
// import { TextMaskModule } from 'angular2-text-mask';

// Components
import { CheckboxUiComponent } from './checkbox/checkbox-ui.component';
import { DropdownUiComponent, DropdownUiOptionDirective } from './dropdown/dropdown-ui.component';
import { InlineSwitchUiComponent, InlineSwitchUiOptionDirective } from './inline-switch/inline-switch-ui.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
    // TextMaskModule,
  ],
  declarations: [
    CheckboxUiComponent,
    DropdownUiComponent,
    DropdownUiOptionDirective,
    InlineSwitchUiComponent,
    InlineSwitchUiOptionDirective
  ],
  exports: [
    // TextMaskModule,
    CheckboxUiComponent,
    DropdownUiComponent,
    DropdownUiOptionDirective,
    InlineSwitchUiComponent,
    InlineSwitchUiOptionDirective
  ]
})
export class FormUiModule {}
