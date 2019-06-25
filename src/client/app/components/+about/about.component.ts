// angular
import { Component } from '@angular/core';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['about.component.scss']
})
export class AboutComponent {
  onActivate($event: any, scrollContainer: any): void {
    scrollContainer.scrollTop = 0;
  }
}
