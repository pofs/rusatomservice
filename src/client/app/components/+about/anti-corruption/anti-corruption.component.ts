// angular
import { Component } from '@angular/core';
import { ConfigService } from '@ngx-config/core';

@Component({
  templateUrl: './anti-corruption.component.html',
  styleUrls: ['anti-corruption.component.scss']
})
export class AntiCorruptionComponent {
  popupVisible = false;

  readonly backendHost = this.config.getSettings('system.backendHost');

  constructor(
    private readonly config: ConfigService
  ) {}

  showFiles(): void {
    this.popupVisible = true;
  }

  hideFiles(): void {
    this.popupVisible = false;
  }
}
