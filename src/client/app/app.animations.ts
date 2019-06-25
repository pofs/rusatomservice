// angular
import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations';

export const voidRouteAnimation: any = [];

export const defaultRouteAnimation: any = [];

export const pageInAnimation = [
  group([
    query(':enter .inner-page',  [
      style({
        opacity: 0,
        transform: 'translate3d(30%, 0, 0)'
      }),
      animate('500ms cubic-bezier(.62,.26,.19,1)', style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      }))
    ]),
    query('.logo',  [
      style({
        transform: 'translate3d(0, 0, 0)'
      }), animate('400ms ease', style({
        transform: 'translate3d(30px, 0, 0)'
      }))
    ]),
    query('.back-to-home',  [
      style({
        opacity: 0,
        transform: 'translate3d(-30px, 0, 0)'
      }), animate('400ms ease', style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      }))
    ]),
    query('.inner-page-overlay',  [
      style({
        opacity: 0
      }), animate('600ms ease', style({
        opacity: 1
      }))
    ])
  ])
];

export const pageOutAnimation = [
  group([
    query(':leave .inner-page',  [
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      }),
      animate('400ms cubic-bezier(.62,.26,.19,1)', style({
        opacity: 0,
        transform: 'translate3d(10%, 0, 0)'
      }))
    ]),
    query('.logo',  [
      style({
        transform: 'translate3d(30px, 0, 0)'
      }), animate('400ms ease', style({
        transform: 'translate3d(0, 0, 0)'
      }))
    ]),
    query('.back-to-home',  [
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      }),
      animate('400ms ease', style({
        opacity: 0,
        transform: 'translate3d(-30px, 0, 0)'
      }))
    ]),
    query('.inner-page-overlay',  [
      style({
        opacity: 1
      }), animate('600ms ease', style({
        opacity: 0
      }))
    ])
  ])
];

export const routeAnimation = trigger('routeAnimation', [
  transition('void => *', voidRouteAnimation),
  transition('home => *', pageInAnimation),
  transition('* => home', pageOutAnimation),
  transition('* => *', defaultRouteAnimation)
]);
