// angular
import { Component } from '@angular/core';
import { ConfigService } from '@ngx-config/core';
import { Lightbox } from 'angular2-lightbox';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ApiError } from '../../../netlab-framework/api/src/api.service';
import { Record, Records, ReferencesService } from '../../../models/references.service';

@Component({
  templateUrl: './reviews.component.html',
  styleUrls: ['reviews.component.scss']
})
export class ReviewsComponent {
  references$: Observable<Records> = this.references
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    ) as Observable<Records>;

  readonly backendHost = this.config.getSettings('system.backendHost');

  constructor(
    readonly references: ReferencesService,
    private readonly lightbox: Lightbox,
    private readonly config: ConfigService
  ) { }

  open(cert: Record): void {
    this.lightbox.open([{
      src: this.backendHost + cert.detailPicture,
      caption: cert.name,
      thumb: this.backendHost + cert.detailPicture
    }]);
  }
}
