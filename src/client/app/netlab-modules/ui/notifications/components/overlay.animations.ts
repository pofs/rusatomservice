import { animate, style, transition, trigger } from '@angular/animations';

export const overlayAnimations = trigger(
  'overlayAnimation',
  [
    transition(
      ':enter', [
        style({ opacity: 0 }),
        animate('380ms ease', style({ opacity: 1 }))
      ]
    ),
    transition(
      ':leave', [
        style({ opacity: 1 }),
        animate('380ms ease', style({ opacity: 0 }))
      ]
    )
  ]
);
