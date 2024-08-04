import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { OverlayService } from '../services/overlay.service';
import { Rgba } from '../models/rgba';
import { Convert } from '../utility/convert';
import { Changes } from '../types/changes';

@Directive({
  selector: '[ngxColorsTrigger]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxColorsTriggerDirective),
      multi: true,
    },
  ],
})
export class NgxColorsTriggerDirective
  implements ControlValueAccessor, OnDestroy, OnInit
{
  constructor(
    private triggerRef: ElementRef<NgxColorsTriggerDirective>,
    private overlayService: OverlayService
  ) {}
  @HostListener('click') onClick() {
    this.openPanel();
  }
  @Input() disabled: boolean = false;
  @Output() change: EventEmitter<string | undefined | null> = new EventEmitter<
    string | undefined | null
  >();
  destroy$: Subject<void> = new Subject<void>();

  value: string | undefined | null = undefined;
  valueEvent: BehaviorSubject<Changes> = new BehaviorSubject<Changes>({
    value: undefined,
    origin: 'trigger',
  });

  public ngOnInit(): void {
    this.valueEvent.subscribe((changes) => {
      console.log('[trigger] (onInit) valueEvent recibed ', this.valueEvent);
      this.value = changes.value?.toString();
      this.onChange(this.value);
    });
  }
  public openPanel() {
    let overlayRef = this.overlayService.createOverlay(
      this,
      undefined,
      'pepe',
      this.valueEvent
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(obj: string | undefined | null): void {
    console.log('[trigger] writeValue', obj);
    if (obj) {
      this.valueEvent.next({
        value: Convert.stringToRgba(obj),
        origin: 'trigger',
      });
    } else {
      this.valueEvent.next({
        value: null,
        origin: 'trigger',
      });
    }
    this.value = obj;
    this.change.emit(obj);
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
