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
  slidersMode: slidersModeOptions;
  outputModel: ModelOptions | 'auto';
  allowedModels: Array<ModelOptions>;
  alphaChannel: boolean;
  eyedroper: boolean;
  palette: Array<ColorOption>;
  animation: AnimationOptions;
  animationFn: Function | undefined;
  overlayClass: string | undefined;
  attachTo: string | undefined;
  labels: {
    accept: string;
    cancel: string;
  };
};
