import { ColorOption } from '../types/color-option';
import {
  AnimationOptions,
  DisplayOptions,
  LayoutOptions,
  ModelOptions,
  slidersModeOptions,
} from '../types/configuration';

export interface Configuration {
  display?: DisplayOptions;
  layout?: LayoutOptions;
  slidersMode?: slidersModeOptions;
  outputModel?: ModelOptions | 'auto';
  allowedModels?: Array<ModelOptions>;
  alphaChannel?: boolean;
  eyedroper?: boolean;
  palette?: Array<ColorOption>;
  animation?: AnimationOptions;
  animationFn?: Function;
  overlayClass?: string;
  attachTo?: string;
  labels?: {
    accept: string;
    cancel: string;
  };
}
