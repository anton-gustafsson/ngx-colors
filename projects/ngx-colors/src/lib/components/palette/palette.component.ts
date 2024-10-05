import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { Rgba } from '../../models/rgba';
import { defaultColors } from '../../utility/default-colors';
import { PaletteColor } from '../../models/color';
import { CommonModule } from '@angular/common';
import { ColorHelper } from '../../utility/color-helper';
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
  private value: Rgba | undefined = undefined;
  public disabled: boolean = false;
  public palette: PaletteStack = new PaletteStack();

  //Used to highlight the selected color on the palette
  private selected: string | undefined = undefined;
  public indexSelected: number = -1;

  public ngOnInit(): void {
    console.log('[palette] OnInit');
    this.palette.push(defaultColors.map((c) => new PaletteColor(c)));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClickBack() {
    this.palette.pop();
    this.indexSelected = this.getIndexSelected(this.selected);
  }

  private isSelected(color: PaletteColor, selected: string): boolean {
    return (
      color.preview == selected ||
      (!!color.childs?.length &&
        color.childs.some((child) => this.isSelected(child, selected)))
    );
  }

  private getIndexSelected(selected: string | undefined): number {
    if (selected === undefined) {
      return -1;
    }
    return this.palette.last().findIndex((c) => this.isSelected(c, selected));
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
