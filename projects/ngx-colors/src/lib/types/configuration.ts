import { outputAst } from '@angular/compiler';
import { ColorOption } from './color-option';

export type DisplayOptions = {
  text?: boolean;
  sliders?: boolean;
  palette?: boolean;
};

export type LayoutOptions = 'full-vertical' | 'full-horizontal' | 'pages';
export type slidersModeOptions = 'normal' | 'grayscale' | 'alpha';
export type ModelOptions = 'hexa' | 'rgba' | 'cmyk' | 'hsva' | 'hsla';
export type AnimationOptions = 'popup' | 'slideIn';

export type Configuration = {
  display: DisplayOptions;
  layout: LayoutOptions;
  slidersMode?: slidersModeOptions;
  outputModel?: ModelOptions | 'auto';
  allowedModels?: Array<ModelOptions>;
  alphaChannel?: boolean;
  eyedroper?: boolean;
  palette?: Array<ColorOption>;
  animation?: AnimationOptions;
  overlayClass?: string;
  attachTo?: string;
  labels?: {
    accept: string;
    cancel: string;
  };
};
