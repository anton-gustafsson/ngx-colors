import { Component, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'ngx-colors-thumb',
    imports: [],
    templateUrl: './thumb.component.html',
    styleUrl: './thumb.component.scss'
})
export class ThumbComponent {
  @Input() apparence: 'circle' | 'oval' = 'circle';
  constructor(public elementRef: ElementRef) {}
}
