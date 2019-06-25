// angular
import { Component } from '@angular/core';
import { CertificatesService } from '../../../models/certificates.service';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ApiError } from '../../../netlab-framework/api/src/api.service';
import { Records } from '../../../models/customer-advantages.service';
import { ConfigService } from '@ngx-config/core';
import { Lightbox } from 'angular2-lightbox';
import { AtekCertificate } from '../../../models/atek-certs.service';

@Component({
  templateUrl: './certificates.component.html',
  styleUrls: ['certificates.component.scss']
})
export class CertificatesComponent {
  certificates$: Observable<Records> = this.certificates
    .index()
    .pipe(
      filter(e => !(e instanceof ApiError))
    ) as Observable<Records>;

  readonly backendHost = this.config.getSettings('system.backendHost');

  constructor(
    readonly certificates: CertificatesService,
    private readonly lightbox: Lightbox,
    private readonly config: ConfigService
  ) { }

  open(cert: AtekCertificate): void {
    this.lightbox.open([{
      src: this.backendHost + cert.detailPicture,
      caption: cert.name,
      thumb: this.backendHost + cert.detailPicture
    }]);
  }
}
