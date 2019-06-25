import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { PaginationComponent } from './pagination.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PaginationComponent
  ],
  exports: [
    PaginationComponent
  ]
})
export class PaginationUiModule {}
