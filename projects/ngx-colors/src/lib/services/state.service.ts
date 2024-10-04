import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rgba } from '../models/rgba';

@Injectable()
export class StateService {
  private _state = new BehaviorSubject<Rgba | undefined | null>(undefined);
  public state = this._state.asObservable();

  constructor() {}

  set(value: Rgba | undefined | null) {
    this._state.next(value);
  }
}
