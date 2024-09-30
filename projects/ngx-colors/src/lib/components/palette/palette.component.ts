import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { Rgba } from '../../models/rgba';
import { Palette } from '../../types/palette';
import { defaultColors } from '../../utility/default-colors';
import { PaletteColor } from '../../models/color';
import { CommonModule } from '@angular/common';
import { Convert } from '../../utility/convert';

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
})
export class PaletteComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  private destroy$: Subject<void> = new Subject<void>();
  public value: Rgba | undefined = undefined;
  public disabled: boolean = false;
  //Used to highlight the selected color on the palette
  public selected: string | undefined = undefined;
  public palette: Palette = {
    back: undefined,
    list: defaultColors.map((c) => new PaletteColor(c)),
  };

  public ngOnInit(): void {
    console.log('PALETTE INIT', this.palette);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClickBack() {
    if (!this.palette.back) {
      console.error('The back stack is empty');
      return;
    }
    this.palette.list = this.palette.back.list;
    this.palette.back = this.palette.back.back;
  }

  public onClickColor(color: PaletteColor) {
    if (color.childs?.length) {
      this.palette.back = { ...this.palette };
      this.palette.list = color.childs;
    } else {
      console.log('[palette] color selected', color);
      this.selected = color.preview;
      this.value = color.value;
      this.onChange(this.value);
    }
  }

  writeValue(obj: Rgba | undefined): void {
    this.value = obj;
    if (obj) {
      this.selected = Convert.rgbaToColorModel(obj, 'HEX').toString();
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
