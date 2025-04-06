import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, of, shareReplay } from 'rxjs';
import { OverlayService } from '../services/overlay.service';
import { ColorHelper } from '../utility/color-helper';
import { StateService } from '../services/state.service';
import { ColorOption } from '../types/color-option';
import { defaultColors } from '../utility/default-colors';
import { Rgba } from '../models/rgba';
import {
  NGX_COLORS_CONFIG,
  NgxColorsConfiguration,
} from '../interfaces/configuration';
import { Configuration } from '../models/configuration';
import {
  DisplayOptions,
  LayoutOptions,
  LockValuesOptions,
} from '../types/configuration';

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
  implements
    ControlValueAccessor,
    OnDestroy,
    OnInit,
    OnChanges,
    NgxColorsConfiguration
{
  constructor(
    public triggerRef: ElementRef<HTMLElement>,
    private overlayService: OverlayService,
    private stateService: StateService,
    @Optional()
    @Inject(NGX_COLORS_CONFIG)
    private config: NgxColorsConfiguration,
  ) {}
  @HostListener('click') onClick() {
    this.openPanel();
  }
  @Input() disabled: boolean = false;
  destroy$: Subject<void> = new Subject<void>();
  value: string | undefined | null = undefined;
  @Output()
  public onSliderChange: EventEmitter<Rgba | null> =
    this.stateService.sliderChange$;
  @Output()
  public onColorHover: EventEmitter<Rgba | null> =
    this.stateService.paleteColorHover$;

  // CONFIGURATION
  @Input()
  public display: DisplayOptions | undefined;
  @Input()
  public layout: LayoutOptions | undefined;
  @Input()
  public lockValues: LockValuesOptions | undefined;
  @Input()
  public palette: Observable<ColorOption[]> | ColorOption[] | undefined =
    defaultColors;
  @Input()
  public alphaChannel: boolean | undefined;

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
    this.applyConfig();
  }

  private applyConfig() {
    this.stateService.configuration = new Configuration(this.config, this);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['palette']) {
      this.setPalette(changes['palette'].currentValue);
    }
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
    palette: Observable<ColorOption[]> | ColorOption[] | undefined,
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
