import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { Rgba } from '../models/rgba';
import { ColorOption } from '../types/color-option';

@Injectable()
export class StateService {
  private _state = new BehaviorSubject<Rgba | undefined | null>(undefined);
  public state = this._state.asObservable();

  constructor() {}

  set(value: Rgba | undefined | null) {
    this._state.next(value);
  }

  public palette$: Observable<ColorOption[]> | undefined = undefined;
}
