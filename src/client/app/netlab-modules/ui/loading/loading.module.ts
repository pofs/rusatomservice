import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { LoadingButtonComponent } from './loading-button/loading-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LoadingBarComponent,
    LoadingButtonComponent
  ],
  exports: [
    LoadingBarComponent,
    LoadingButtonComponent
  ]
})
export class LoadingUiModule {}
