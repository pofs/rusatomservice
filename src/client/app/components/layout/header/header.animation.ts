// angular
import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations';

const menuAnimation = trigger('menuAnimation', [
  transition('false => true', [
    style({
      display: 'none'
    }),
    style({
      display: 'block'
    })
  ])
]);

export const headerAnimations = [menuAnimation];
