import { Configuration } from '../types/configuration';
import { defaultColors } from './default-colors';
export const DEFAULT_CONFIGURATION: Configuration = {
  display: {
    text: true,
    sliders: true,
    palette: true,
  },
  layout: 'pages',
  alphaChannel: true,
  palette: defaultColors,
  labels: {
    accept: 'Accept',
    cancel: 'Cancel',
  },
  attachTo: undefined,
  animation: 'popup',
  eyedroper: false,
  animationFn: undefined,
  outputModel: 'auto',
  slidersMode: 'normal',
  overlayClass: undefined,
  allowedModels: ['hexa', 'rgba', 'cmyk', 'hsva', 'hsla'],
};
