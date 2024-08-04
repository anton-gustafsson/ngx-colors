import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  forwardRef,
} from '@angular/core';
import { defaultColors } from '../../utility/default-colors';
import { Color } from '../../models/color';
import { Palette } from '../../types/palette';
import {
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { Rgba } from '../../models/rgba';
import { TextInputComponent } from '../text-input/text-input.component';
import { BehaviorSubject, Subject, map, merge, takeUntil } from 'rxjs';
import { Changes } from '../../types/changes';

@Component({
  selector: 'ngx-colors-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColorPickerComponent,
    TextInputComponent,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PanelComponent),
      multi: true,
    },
  ],

  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', '../../shared/shared.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  @HostListener('pointerdown', ['$event'])
  public onClick(event: PointerEvent): void {
    event.stopPropagation();
  }

  private destroy$: Subject<void> = new Subject<void>();
  public palette: Palette = {
    back: undefined,
    list: defaultColors.map((c) => new Color(c)),
  };
  public selected: string = '#9575CD';
  public showSliders: boolean = false;

  public value: Rgba | undefined = new Rgba(255, 0, 0, 1);

  public colorPickerControl: FormControl<Rgba | null | undefined> =
    new FormControl<Rgba | undefined>(this.value);
  public textInputControl: FormControl<Rgba | null | undefined> =
    new FormControl<Rgba | undefined>(this.value);

  public disabled: boolean = false;

  public value$: BehaviorSubject<Changes> | undefined = undefined;
  constructor() {}

  public ngOnInit(): void {
    if (this.value$) {
      merge(
        this.textInputControl.valueChanges.pipe(
          map<Rgba | null | undefined, Changes>((newValue) => {
            return { value: newValue, origin: 'text-input' };
          })
        ),
        this.colorPickerControl.valueChanges.pipe(
          map<Rgba | null | undefined, Changes>((newValue) => {
            return { value: newValue, origin: 'color-picker' };
          })
        )
      )
        .pipe(takeUntil(this.destroy$))
        .subscribe((changes) => {
          console.log('[panel] valueChanges text/cpr', changes);
          if (this.value$) {
            if (changes) {
              console.log(
                '[panel] (ngOnInit valueChanges text and colorPicker Controls) next valueEvent '
              );
              this.value$.next(changes);
            }
          }
        });
      this.value$.subscribe((changes) => {
        console.log('[panel] valueEvent recibed', changes);
        if (changes.origin != 'text-input') {
          this.textInputControl.setValue(changes.value, { emitEvent: false });
        }
        if (changes.origin != 'color-picker') {
          this.colorPickerControl.setValue(changes.value, { emitEvent: false });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClickColor(color: Color): void {
    if (color.childs?.length) {
      this.palette.back = { ...this.palette };
      this.palette.list = color.childs;
    } else {
      this.selectColor(color);
    }
  }

  public onClickBack() {
    if (this.showSliders) {
      this.showSliders = false;
    }
    if (this.palette.back) {
      this.palette.list = this.palette.back.list;
      this.palette.back = this.palette.back.back;
    }
  }

  public onClickShowSliders() {
    this.showSliders = true;
  }

  private selectColor(color: Color) {
    this.selected = color.preview;
    this.value = color.value;
    console.log('[panel] (selectColor) next valueEvent ');
    this.value$?.next({ value: color.value, origin: 'palette' });
    this.onChange(color.preview);
  }

  writeValue(obj: Rgba | undefined): void {
    this.value = obj;
  }

  onChange: (value: string | undefined) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
