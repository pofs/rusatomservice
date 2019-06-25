// angular
import { Component } from '@angular/core';
import { CustomerAdvantagesService, Records } from '../../../models/customer-advantages.service';
import { DealerAdvantagesService } from '../../../models/dealer-advantages.service';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ApiError } from '../../../netlab-framework/api/src/api.service';

@Component({
  templateUrl: './advantages.component.html',
  styleUrls: ['advantages.component.scss']
})
export class AdvantagesComponent {
  customerAdvantages$: Observable<Records> = this.customerAdvantages
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    ) as Observable<Records>;

  dealerAdvantages$: Observable<Records> = this.dealerAdvantages
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    ) as Observable<Records>;

  constructor(
    readonly customerAdvantages: CustomerAdvantagesService,
    readonly dealerAdvantages: DealerAdvantagesService
  ) {}
}
