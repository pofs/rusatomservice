import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordeonComponent, AccordeonElementComponent } from './accordeon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AccordeonElementComponent, AccordeonComponent
  ],
  exports: [
    AccordeonElementComponent, AccordeonComponent
  ]
})
export class AccordeonModule {}
