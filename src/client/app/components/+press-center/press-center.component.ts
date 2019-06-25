// angular
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './press-center.component.html',
  styleUrls: ['press-center.component.scss']
})
export class PressCenterComponent { }
