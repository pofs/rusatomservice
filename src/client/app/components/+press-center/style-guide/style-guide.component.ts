// angular
import { Component } from '@angular/core';
import { ConfigService } from '@ngx-config/core';

@Component({
  templateUrl: './style-guide.component.html',
  styleUrls: ['style-guide.component.scss']
})
export class StyleGuideComponent {
  readonly backendHost = this.config.getSettings('system.backendHost');

  constructor(
    private readonly config: ConfigService
  ) {}
}
