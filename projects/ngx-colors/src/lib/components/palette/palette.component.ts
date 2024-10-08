import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { Rgba } from '../../models/rgba';
import { defaultColors } from '../../utility/default-colors';
import { PaletteColor } from '../../models/color';
import { CommonModule } from '@angular/common';
import { ColorHelper } from '../../utility/color-helper';
import { PaletteStack } from '../../models/palette-stack';
import { ColorOption } from '../../types/color-option';
import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'ngx-colors-palette',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaletteComponent),
      multi: true,
    },
  ],
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss', '../../shared/shared.scss'],
  animations: [
    trigger('paletteAnimation', [
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
                ])
              ),
            ]),
          ],
          { optional: true }
        ),
        query(
          'div.slide-in:enter',
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
                ])
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class PaletteComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  private destroy$: Subject<void> = new Subject<void>();
  private value: Rgba | undefined = undefined;
  public disabled: boolean = false;
  public paletteStack: PaletteStack = new PaletteStack();
  public animation = 'popup';
  //Used to highlight the selected color on the palette
  private selected: string | undefined = undefined;
  public indexSelected: number = -1;

  public loading = false;

  @Output() onColorHover: EventEmitter<Rgba | undefined> = new EventEmitter<
    Rgba | undefined
  >();

  @Input()
  public palette$: Observable<Array<ColorOption>> | undefined =
    of(defaultColors);

  public ngOnInit(): void {
    console.log('[palette] OnInit');
    this.getPalette(this.palette$);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClickBack() {
    this.paletteStack.pop();
    this.indexSelected = this.getIndexSelected(this.selected);
  }

  public onMouseEnter(color: PaletteColor) {
    this.onColorHover.emit(color.value);
  }

  private getPalette(palette: Observable<Array<ColorOption>> | undefined) {
    if (!palette) return;
    if (this.palette$ instanceof Observable) {
      if (this.paletteStack.size == 0) {
        this.loading = true;
      }
      this.palette$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (colors) => {
          this.paletteStack.clear();
          this.paletteStack.push(colors.map((c) => new PaletteColor(c)));
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      throw new Error('The palette provided is not an Observable');
    }
  }

  private isSelected(color: PaletteColor, selected: string): boolean {
    return (
      color.preview == selected ||
      (!!color.childs?.length &&
        color.childs.some((child) => this.isSelected(child, selected)))
    );
  }

  private getIndexSelected(selected: string | undefined): number {
    if (selected === undefined || !this.paletteStack?.size) {
      return -1;
    }
    return this.paletteStack
      .last()
      .findIndex((c) => this.isSelected(c, selected));
  }

  public onClickColor(color: PaletteColor) {
    if (color.childs?.length) {
      this.paletteStack.push(color.childs);
    } else {
      console.log('[palette] color selected', color);
      this.selected = color.preview;
      this.value = color.value;
      this.onChange(this.value);
    }
    this.indexSelected = this.getIndexSelected(this.selected);
  }

  writeValue(obj: Rgba | undefined): void {
    console.log('[palette] writeValue', obj);
    this.value = obj;
    if (this.value) {
      this.selected = ColorHelper.rgbaToColorModel(
        this.value,
        'HEX'
      ).toString();
      this.indexSelected = this.getIndexSelected(this.selected);
      console.log('[palette] selected:', this.selected, this.value);
    }
  }

  onChange: (value: Rgba | undefined) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: Rgba | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
