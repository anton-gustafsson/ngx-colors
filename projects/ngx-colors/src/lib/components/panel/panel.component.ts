import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  forwardRef,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Rgba } from '../../models/rgba';
import { Subject, map, merge, take, takeUntil, tap } from 'rxjs';
import { Changes } from '../../types/changes';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { PaletteComponent } from '../palette/palette.component';

@Component({
  selector: 'ngx-colors-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColorPickerComponent,
    TextInputComponent,
    PaletteComponent,
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
  constructor(public stateService: StateService) {}
  @HostListener('pointerdown', ['$event'])
  public onClick(event: PointerEvent): void {
    event.stopPropagation();
  }

  private destroy$: Subject<void> = new Subject<void>();
  public showSliders: boolean = false;

  public paletteCtrl: FormControl<Rgba | null | undefined> = new FormControl<
    Rgba | undefined
  >(undefined);
  public slidersCtrl: FormControl<Rgba | null | undefined> =
    new FormControl<Rgba | null>(null);
  public textInputCtrl: FormControl<Rgba | null | undefined> = new FormControl<
    Rgba | undefined
  >(undefined);

  public tempValue: Rgba | null | undefined = undefined;

  public disabled: boolean = false;

  public ngOnInit(): void {
    merge(
      this.stateService.state.pipe(
        map<Rgba | null | undefined, Changes>((newValue) => {
          return { value: newValue, origin: 'trigger' };
        })
      ),
      this.textInputCtrl.valueChanges.pipe(
        map<Rgba | null | undefined, Changes>((newValue) => {
          return { value: newValue, origin: 'text-input' };
        })
      ),
      this.slidersCtrl.valueChanges.pipe(
        tap((value) => {
          this.stateService.sliderChange$.emit(value);
        }),
        map<Rgba | null | undefined, Changes>((newValue) => {
          return { value: newValue, origin: 'color-picker' };
        })
      ),
      this.paletteCtrl.valueChanges.pipe(
        map<Rgba | null | undefined, Changes>((newValue) => {
          return { value: newValue, origin: 'palette' };
        })
      )
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((changes) => {
        this.tempValue = changes.value;
        this.updateCtrlValues(changes.value, changes.origin);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateCtrlValues(
    value: Rgba | null | undefined,
    origin:
      | 'text-input'
      | 'color-picker'
      | 'trigger'
      | 'palette'
      | undefined = undefined
  ) {
    if (origin == 'palette') {
      this.stateService.set(value);
    }
    if (origin != 'palette') {
      this.paletteCtrl.setValue(value, { emitEvent: false });
    }
    if (origin != 'text-input') {
      this.textInputCtrl.setValue(value, { emitEvent: false });
    }
    if (origin != 'color-picker') {
      this.slidersCtrl.setValue(value, { emitEvent: false });
    }
  }

  public accept() {
    this.stateService.set(this.tempValue);
  }
  public cancel() {
    this.stateService.state
      .pipe(take(1))
      .subscribe((res) => this.updateCtrlValues(res));
  }

  public onClickBack() {
    this.showSliders = false;
  }

  public onClickShowSliders() {
    this.showSliders = true;
  }
}
