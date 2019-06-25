import { animate, style, transition, trigger } from '@angular/animations';

export const dialogAnimations = trigger('dialogEnterLeave', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translate3d(0, -3%, 0)'
    }),
    animate('400ms ease', style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }))
  ]),
  transition(':leave', [
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }),
    animate('200ms ease', style({
      opacity: 0,
      transform: 'translate3d(0, 2%, 0)'
    }))
  ])
]);
