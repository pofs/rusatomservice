// angular
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { headerAnimations } from './header.animation';
import * as language from '../../../framework/i18n/src/language.actions';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: headerAnimations
})
export class HeaderComponent implements OnInit {
  showMenu = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events
      .subscribe(() => {
        this.closeMenu();
      });
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  closeMenu(): void {
    this.showMenu = false;
  }
}
