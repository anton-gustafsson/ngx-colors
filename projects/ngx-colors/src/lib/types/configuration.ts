export type DisplayOptions = {
  text: boolean;
  sliders: boolean;
  palette: boolean;
};

export type LayoutOptions = 'full-vertical' | 'full-horizontal' | 'pages';

export type Configuration = {
  display: DisplayOptions;
  layout: LayoutOptions;
};
