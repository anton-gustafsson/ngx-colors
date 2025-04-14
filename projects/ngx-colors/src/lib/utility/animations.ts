import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const paletteAnimation = trigger('paletteAnimation', [
  transition('* <=> *', [
    query(
      'div.popup:enter',
      [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        stagger(10, [
          animate(
            '300ms ease-out',
            keyframes([
              style({ opacity: 1, transform: 'scale(1.2)', offset: 0.8 }),
              style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
            ]),
          ),
        ]),
      ],
      { optional: true },
    ),
    query(
      'div.slide:enter',
      [
        style({ opacity: 0, transform: 'translatex(-50%) scaleY(0.8)' }),
        stagger(10, [
          animate(
            '300ms ease-out',
            keyframes([
              style({
                opacity: 1,
                transform: 'translatex(5%) scale(1)',
                offset: 0.7,
              }),
              style({
                opacity: 1,
                transform: 'translatex(0) scale(1)',
                offset: 1,
              }),
            ]),
          ),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);
