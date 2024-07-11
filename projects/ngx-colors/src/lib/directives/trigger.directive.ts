import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { OverlayService } from '../services/overlay.service';

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
  implements ControlValueAccessor, OnDestroy
{
  constructor(private overlayService: OverlayService) {}
  @HostListener('click') onClick() {
    this.openPanel();
  }
  @Input() disabled: boolean = false;
  @Output() change: EventEmitter<string | undefined | null> = new EventEmitter<
    string | undefined | null
  >();
  destroy$: Subject<void> = new Subject<void>();

  value: string | undefined | null = undefined;

  public openPanel() {
    let overlayRef = this.overlayService.createOverlay(undefined, 'pepe');
    overlayRef.instance.change$.subscribe((r) => {
      this.value = r;
      this.onChange(r);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(obj: string | undefined | null): void {
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
