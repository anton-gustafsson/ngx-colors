import { Observable } from 'rxjs';
import { NgxColorsConfiguration } from '../interfaces/configuration';
import { ColorOption } from '../types/color-option';
import {
  AnimationOptions,
  DisplayOptions,
  LayoutOptions,
  ModelOptions,
  slidersModeOptions,
} from '../types/configuration';
import { defaultColors } from '../utility/default-colors';

export class Configuration implements NgxColorsConfiguration {
  public display: DisplayOptions = {
    text: true,
    sliders: true,
    palette: true,
  };
  public layout: LayoutOptions = 'pages';
  public slidersMode: slidersModeOptions = 'normal';
  public outputModel: ModelOptions | 'auto' = 'auto';
  public allowedModels: Array<ModelOptions> = [
    'hexa',
    'rgba',
    'cmyk',
    'hsva',
    'hsla',
  ];
  public alphaChannel: boolean = true;
  public eyedroper: boolean = false;
  public palette: Observable<ColorOption[]> | ColorOption[] | undefined =
    defaultColors;
  public animation: AnimationOptions = 'popup';
  public animationFn: Function | undefined = undefined;
  public overlayClass: string | undefined = undefined;
  public attachTo: string | undefined = undefined;
  public labels: {
    accept: string;
    cancel: string;
  } = {
    accept: 'Accept',
    cancel: 'Cancel',
  };

  constructor(...configOverwrites: NgxColorsConfiguration[]) {
    for (const overwrite of configOverwrites) {
      if (overwrite.display !== undefined) {
        this.display = { ...this.display, ...overwrite.display };
      }
      if (overwrite.layout !== undefined) {
        this.layout = overwrite.layout;
      }
      if (overwrite.slidersMode !== undefined) {
        this.slidersMode = overwrite.slidersMode;
      }
      if (overwrite.outputModel !== undefined) {
        this.outputModel = overwrite.outputModel;
      }
      if (overwrite.allowedModels !== undefined) {
        this.allowedModels = overwrite.allowedModels;
      }
      if (overwrite.alphaChannel !== undefined) {
        this.alphaChannel = overwrite.alphaChannel;
      }
      if (overwrite.eyedroper !== undefined) {
        this.eyedroper = overwrite.eyedroper;
      }
      if (overwrite.palette !== undefined) {
        this.palette = overwrite.palette;
      }
      if (overwrite.animation !== undefined) {
        this.animation = overwrite.animation;
      }
      if (overwrite.animationFn !== undefined) {
        this.animationFn = overwrite.animationFn;
      }
      if (overwrite.overlayClass !== undefined) {
        this.overlayClass = overwrite.overlayClass;
      }
      if (overwrite.attachTo !== undefined) {
        this.attachTo = overwrite.attachTo;
      }
      if (overwrite.labels !== undefined) {
        this.labels = { ...this.labels, ...overwrite.labels };
      }
    }
  }
}
