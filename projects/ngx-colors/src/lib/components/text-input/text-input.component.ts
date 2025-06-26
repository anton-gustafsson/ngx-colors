import { CommonModule } from '@angular/common';
import { Component, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Rgba } from '../../models/rgba';
import { ColorHelper } from '../../utility/color-helper';
import { ColorModel } from '../../types/color-model';
import { ColorValidator } from '../../validators/color-validator';
import { StateService } from '../../services/state.service';

@Component({
    selector: 'ngx-colors-text-input',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextInputComponent),
            multi: true,
        },
    ],
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss', '../../shared/shared.scss']
})
export class TextInputComponent implements ControlValueAccessor, OnInit {
  constructor(private stateService: StateService) {}
  value: Rgba | undefined = undefined;

  inputControl: FormControl<string | null | undefined> = new FormControl<
    string | undefined
  >('', [ColorValidator()]);

  disabled: boolean = false;

  public colorModelIndex: number = 0;

  public availableModels: Array<ColorModel> = [
    'RGBA',
    'HEXA',
    'HSVA',
    'HSLA',
    'CMYK',
  ];

  ngOnInit(): void {
    this.inputControl.valueChanges.subscribe((changes) => {
      if (typeof changes === 'string') {
        if (ColorHelper.getColorModelByString(changes) === 'INVALID') {
          return;
        }
        this.value = ColorHelper.stringToRgba(changes);
        this.onChange(this.value);
      }
    });
    this.availableModels = this.stateService.configuration.allowedModels;
    const currentModelIndex = this.availableModels.findIndex(
      (model) => model === this.stateService.colorModel,
    );
    this.colorModelIndex = currentModelIndex >= 0 ? currentModelIndex : 0;
  }

  public onClickColorModel(): void {
    this.colorModelIndex =
      (this.colorModelIndex + 1) % this.availableModels.length;
    this.stateService.colorModel = this.availableModels[this.colorModelIndex];
    if (this.value) {
      this.inputControl.setValue(
        ColorHelper.rgbaToColorModel(
          this.value,
          this.availableModels[this.colorModelIndex],
        ).toString(),
      );
    }
  }

  writeValue(obj: Rgba | undefined): void {
    console.log('[text-input] writeValue', obj);
    this.value = obj;
    if (this.value) {
      this.inputControl.setValue(
        ColorHelper.rgbaToColorModel(
          this.value,
          this.availableModels[this.colorModelIndex],
        ).toString(),
        { emitEvent: false },
      );
    } else {
      this.inputControl.setValue('', { emitEvent: false });
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
