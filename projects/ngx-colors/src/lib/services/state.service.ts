import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { Rgba } from '../models/rgba';
import { ColorGroup } from '../interfaces/color-group';

@Injectable()
export class StateService {
  private _state = new BehaviorSubject<Rgba | undefined | null>(undefined);
  public state = this._state.asObservable();

  constructor() {}

  set(value: Rgba | undefined | null) {
    this._state.next(value);
  }

  public palette$: Observable<Array<ColorGroup | string>> | undefined =
    undefined;
}
