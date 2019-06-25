// angular
import { NgModule } from '@angular/core';

// libs
import { ApiClientService } from './src/api.service';
import { LoadingService } from './src/loading.service';

@NgModule({
  providers: [
    ApiClientService,
    LoadingService
  ]
})
export class ApiModule { }
