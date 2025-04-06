export type DisplayOptions = {
  text?: boolean;
  sliders?: boolean;
  palette?: boolean;
};

export type LayoutOptions = 'full-vertical' | 'full-horizontal' | 'pages';
export type LockValuesOptions = {
  hue?: number | undefined;
  saturation?: number | undefined;
  brightness?: number | undefined;
  alpha?: number | undefined;
};
export type ModelOptions = 'hexa' | 'rgba' | 'cmyk' | 'hsva' | 'hsla';
export type AnimationOptions = 'popup' | 'slideIn';
