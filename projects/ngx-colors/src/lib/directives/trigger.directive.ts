import {
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { OverlayService } from '../services/overlay.service';
import { Convert } from '../utility/convert';
import { StateService } from '../services/state.service';

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
  implements ControlValueAccessor, OnDestroy, OnInit
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

  public ngOnInit(): void {
    this.stateService.state.subscribe((value) => {
      console.log('[trigger] currentState', value);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(obj: string | undefined | null): void {
    if (obj) {
      const rgba = Convert.stringToRgba(obj);
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
