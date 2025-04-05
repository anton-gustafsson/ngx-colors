import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, shareReplay, tap } from 'rxjs';
import { Rgba } from '../models/rgba';
import { ColorOption } from '../types/color-option';
import { Configuration } from '../models/configuration';

@Injectable()
export class StateService {
  private _state = new BehaviorSubject<Rgba | undefined | null>(undefined);
  public state = this._state.asObservable();

  constructor() {}

  set(value: Rgba | undefined | null) {
    this._state.next(value);
  }

  public palette$: Observable<ColorOption[]> | undefined = undefined;

  public sliderChange$: EventEmitter<Rgba | null> =
    new EventEmitter<Rgba | null>();
  public paleteColorHover$: EventEmitter<Rgba | null> =
    new EventEmitter<Rgba | null>();
  public configuration: Configuration = new Configuration();
}
