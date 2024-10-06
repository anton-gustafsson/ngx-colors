import {
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, delay, of, shareReplay } from 'rxjs';
import { OverlayService } from '../services/overlay.service';
import { ColorHelper } from '../utility/color-helper';
import { StateService } from '../services/state.service';
import { ColorGroup } from '../interfaces/color-group';
import { defaultColors } from '../utility/default-colors';

@Directive({
  selector: '[ngxColorsTrigger]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxColorsTriggerDirective),
      multi: true,
    },
    OverlayService,
    StateService,
  ],
})
export class NgxColorsTriggerDirective
  implements ControlValueAccessor, OnDestroy, OnInit, OnChanges
{
  constructor(
    public triggerRef: ElementRef<HTMLElement>,
    private overlayService: OverlayService,
    private stateService: StateService
  ) {}
  @HostListener('click') onClick() {
    this.openPanel();
  }
  @Input() disabled: boolean = false;
  destroy$: Subject<void> = new Subject<void>();
  value: string | undefined | null = undefined;
  @Input()
  public palette:
    | Observable<Array<ColorGroup | string>>
    | Array<ColorGroup | string>
    | undefined = defaultColors;

  public ngOnInit(): void {
    this.setPalette(this.palette);
    this.stateService.state.subscribe((value) => {
      if (value) {
        this.value = value.toString();
        this.onChange(this.value);
        this.overlayService.removePanel();
        return;
      }
      this.value = null;
      this.onChange(null);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['palette']) {
      this.setPalette(changes['palette'].currentValue);
    }
    console.log('[trigger] changes', changes);
  }

  public openPanel() {
    this.onTouch();
    const injector = Injector.create({
      providers: [
        { provide: StateService, useValue: this.stateService },
        { provide: OverlayService, useValue: this.overlayService },
      ],
    });
    this.overlayService.createOverlay(this, undefined, 'pepe', injector);
  }

  private setPalette(
    palette:
      | Observable<Array<ColorGroup | string>>
      | Array<ColorGroup | string>
      | undefined
  ) {
    if (!palette) return;
    if (Array.isArray(this.palette)) {
      this.stateService.palette$ = of(this.palette);
    } else if (this.palette instanceof Observable) {
      this.stateService.palette$ = this.palette.pipe(shareReplay());
    } else {
      throw new Error('The palette provided is not of a valid type');
    }
  }

  writeValue(obj: string | undefined | null): void {
    if (obj) {
      const rgba = ColorHelper.stringToRgba(obj);
      this.stateService.set(rgba);
    } else {
      this.stateService.set(null);
    }
    this.value = obj;
  }

  onChange: (value: string | undefined | null) => void = () => {};
  onTouch: () => void = () => {};

  registerOnChange(fn: (value: string | undefined | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
