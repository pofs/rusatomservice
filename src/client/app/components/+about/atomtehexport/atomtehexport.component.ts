// angular
import { Component } from '@angular/core';
import { AtexHistory, AtexHistoryService } from '../../../models/atex-history.service';
import { Observable } from 'rxjs/Observable';
import { ApiError } from '../../../netlab-framework/api/src/api.service';
import { filter, tap } from 'rxjs/operators';
import { NguCarousel } from '@ngu/carousel';
import { AtekCertificate, AtekCertificates, AtekCertificatesService } from '../../../models/atek-certs.service';
import { AtekDealerinfoes, AtekDealerinfoesService } from '../../../models/atek-dealerinfo.service';
import { Lightbox } from 'angular2-lightbox';
import { ConfigService } from '@ngx-config/core';

@Component({
  templateUrl: './atomtehexport.component.html',
  styleUrls: ['atomtehexport.component.scss']
})
export class AtomtehexportComponent {
  historyCarousel: NguCarousel = {
    grid: {xs: 1, sm: 2, md: 3, lg: 4, all: 0},
    slide: 1,
    speed: 330,
    interval: 4000,
    point: {
      visible: false
    },
    load: 3,
    touch: true,
    loop: true,
    easing: 'ease',
    custom: 'banner'
  };

  historyCerts: NguCarousel = {
    grid: {xs: 1, sm: 1, md: 4, lg: 5, all: 0},
    slide: 1,
    speed: 330,
    interval: 4000,
    point: {
      visible: false
    },
    load: 3,
    touch: true,
    loop: true,
    easing: 'ease',
    custom: 'banner'
  };

  atekHistories$: Observable<AtexHistory> = this.atekHistory
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    ) as Observable<AtexHistory>;

  atekCerts$: Observable<AtekCertificates> = this.atekCerts
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    ) as Observable<AtekCertificates>;

  atekDealerInfoes$: Observable<AtekDealerinfoes> = this.atekDealerInfoes
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    ) as Observable<AtekDealerinfoes>;

  readonly backendHost = this.config.getSettings('system.backendHost');

  constructor(
    readonly atekHistory: AtexHistoryService,
    readonly atekCerts: AtekCertificatesService,
    readonly atekDealerInfoes: AtekDealerinfoesService,
    readonly lightbox: Lightbox,
    private readonly config: ConfigService
  ) {}

  open(cert: AtekCertificate): void {
    this.lightbox.open([{
      src: this.backendHost + cert.previewPicture,
      caption: cert.name,
      thumb: this.backendHost + cert.previewPicture
    }]);
  }
}
