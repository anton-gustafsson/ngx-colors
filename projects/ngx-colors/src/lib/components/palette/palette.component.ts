import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { Rgba } from '../../models/rgba';
import { Palette } from '../../types/palette';
import { defaultColors } from '../../utility/default-colors';
import { PaletteColor } from '../../models/color';
import { CommonModule } from '@angular/common';
import { Convert } from '../../utility/convert';
import { PaletteStack } from '../../models/palette-stack';

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
  public palette: PaletteStack = new PaletteStack();

  public ngOnInit(): void {
    this.palette.push(defaultColors.map((c) => new PaletteColor(c)));
    console.log('palette init', this.palette);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClickBack() {
    this.palette.pop();
  }

  public onClickColor(color: PaletteColor) {
    if (color.childs?.length) {
      this.palette.push(color.childs);
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
