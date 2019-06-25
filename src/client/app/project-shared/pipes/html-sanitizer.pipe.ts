import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '@ngx-config/core';

import { replace } from 'lodash';

@Pipe({
  name: 'sanitizeHtml'
})
export class HtmlSanitizerPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: any): any {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Pipe({
  name: 'addDefaultHost'
})
export class AddDefaultHostPipe implements PipeTransform {
  readonly backendHost = this.config.getSettings('system.backendHost');
  constructor(
    private readonly config: ConfigService
  ) { }

  transform(value: string): string {
    return replace(value, /(\/upload)/, (match: string) => this.backendHost + match);
  }
}
