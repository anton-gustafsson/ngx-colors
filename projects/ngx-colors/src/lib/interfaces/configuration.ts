export const NGX_COLORS_CONFIG = new InjectionToken<NgxColorsConfiguration>(
  'NgxColorsConfiguration',
);
import { InjectionToken } from '@angular/core';
import { ColorOption } from '../types/color-option';
import {
  AnimationOptions,
  DisplayOptions,
  LayoutOptions,
  ModelOptions,
  LockValuesOptions,
} from '../types/configuration';
import { Observable } from 'rxjs';

export interface NgxColorsConfiguration {
  display?: DisplayOptions;
  layout?: LayoutOptions;
  lockValues?: LockValuesOptions;
  outputModel?: ModelOptions | 'auto';
  allowedModels?: Array<ModelOptions>;
  alphaChannel?: boolean;
  eyedroper?: boolean;
  palette?: Observable<ColorOption[]> | ColorOption[] | undefined;
  animation?: AnimationOptions;
  animationFn?: Function | undefined;
  overlayClass?: string | undefined;
  attachTo?: string | undefined;
  labels?: {
    accept: string;
    cancel: string;
  };
}
